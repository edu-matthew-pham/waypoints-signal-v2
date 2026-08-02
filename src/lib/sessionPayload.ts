// src/lib/sessionPayload.ts
// Parsing and validating a question-set payload pasted from Prepare.
//
// The RPC validates too, and it is the real gate — this exists so the common
// failures (pasted the wrong thing, pasted half of it) get a message that says
// what to do rather than a Postgres exception. Anything this misses, the RPC
// still catches.
//
// TOLERANT EXTRACTION. Prepare's clipboard is clean JSON, but a teacher may
// paste from a chat window or a fenced code block. Session 29 recorded
// prose-around-JSON as the expected shape at paste-back points and warned
// against reimplementing a strict parse; the same applies here.

export interface PayloadOption {
	label: string;
	text: string;
}

export interface PayloadQuestion {
	idx: number;
	type: 'mc' | 'text' | 'confidence';
	stem: string;
	options?: PayloadOption[];
	correct?: string;
	criteria?: string[];
}

export interface SessionPayload {
	version: 1;
	title: string;
	fingerprint: string;
	questions: PayloadQuestion[];
}

export interface PayloadSummary {
	title: string;
	total: number;
	mc: number;
	text: number;
	confidence: number;
	/** MC questions whose answer couldn't be resolved when the deck was exported. */
	missingAnswers: number[];
}

export type ParseResult =
	| { ok: true; payload: SessionPayload }
	| { ok: false; error: string };

const TYPES = ['mc', 'text', 'confidence'] as const;

/**
 * Pull the first balanced JSON object out of arbitrary text.
 *
 * Brace counting rather than a regex, because option text can contain braces and
 * a lazy match would truncate mid-payload. String literals and escapes are
 * tracked so a `{` inside a stem doesn't shift the depth.
 */
export function extractJson(raw: string): string | null {
	const start = raw.indexOf('{');
	if (start === -1) return null;

	let depth = 0;
	let inString = false;
	let escaped = false;

	for (let i = start; i < raw.length; i++) {
		const c = raw[i];

		if (escaped) {
			escaped = false;
			continue;
		}
		if (c === '\\') {
			escaped = true;
			continue;
		}
		if (c === '"') {
			inString = !inString;
			continue;
		}
		if (inString) continue;

		if (c === '{') depth++;
		else if (c === '}') {
			depth--;
			if (depth === 0) return raw.slice(start, i + 1);
		}
	}

	return null;
}

/** Parse and shape-check a pasted payload. */
export function parsePayload(raw: string): ParseResult {
	if (!raw.trim()) {
		return { ok: false, error: 'Nothing pasted yet.' };
	}

	const json = extractJson(raw);
	if (!json) {
		// Distinguish the two ways this fails. A partial clipboard copy is the
		// common one and it leaves unbalanced braces, so "couldn't find any JSON"
		// would be technically true and useless to someone looking at a screen
		// full of it.
		return raw.includes('{')
			? {
					ok: false,
					error: 'That looks like it was cut off partway. Copy the whole question set from Prepare.'
				}
			: { ok: false, error: "Couldn't find any JSON in what was pasted." };
	}

	let parsed: unknown;
	try {
		parsed = JSON.parse(json);
	} catch {
		return {
			ok: false,
			error: "That isn't valid JSON — it may have been cut off. Copy the whole question set from Prepare."
		};
	}

	const p = parsed as Partial<SessionPayload>;

	if (p.version !== 1) {
		return {
			ok: false,
			error: `Unsupported payload version${p.version === undefined ? '' : ` (${p.version})`} — expected 1.`
		};
	}

	if (typeof p.fingerprint !== 'string' || !/^[0-9a-f]{8}$/.test(p.fingerprint)) {
		return { ok: false, error: 'The payload is missing its check value, or it is malformed.' };
	}

	if (!Array.isArray(p.questions) || p.questions.length === 0) {
		return {
			ok: false,
			error: "That payload has no questions in it. Check the deck has at least one ::: session fence."
		};
	}

	for (const [i, q] of p.questions.entries()) {
		if (!TYPES.includes(q?.type as (typeof TYPES)[number])) {
			return { ok: false, error: `Question ${i + 1} has an unrecognised type.` };
		}
		if (typeof q?.idx !== 'number') {
			return { ok: false, error: `Question ${i + 1} is missing its position.` };
		}
	}

	return { ok: true, payload: p as SessionPayload };
}

/** What to show the teacher before they commit. */
export function summarise(payload: SessionPayload): PayloadSummary {
	const missingAnswers = payload.questions
		.filter((q) => q.type === 'mc' && !q.correct)
		.map((q) => q.idx);

	return {
		title: payload.title || 'Untitled deck',
		total: payload.questions.length,
		mc: payload.questions.filter((q) => q.type === 'mc').length,
		text: payload.questions.filter((q) => q.type === 'text').length,
		confidence: payload.questions.filter((q) => q.type === 'confidence').length,
		missingAnswers
	};
}

/**
 * The three lines the teacher pastes back into their deck's frontmatter.
 *
 * All three, always. `signal_check` is what lets Prepare notice the deck has
 * moved on since the session was created — without it the drift guard has
 * nothing to compare against and silently stops running. `signal_control` is
 * the capability that lets the presenter drive the session; Prepare's
 * student-link transform strips that key before the link is shared.
 *
 * NO OPTIONAL PARAMETER AND NO DEFAULT. The asymmetry decides it: an unused
 * token sitting in a deck costs nothing until that deck is shared as-is, which
 * is an already-accepted risk carrying the notes and the answer key anyway. A
 * MISSING token fails live, in front of a class, at the moment the teacher
 * reaches for the range control.
 */
export function frontmatterBlock(
	code: string,
	fingerprint: string,
	controlToken: string
): string {
	return `signal_session: ${code}\nsignal_check: ${fingerprint}\nsignal_control: ${controlToken}`;
}