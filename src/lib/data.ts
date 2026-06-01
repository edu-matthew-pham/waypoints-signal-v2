import type { NodeFile } from './types/NodeFile'
import type { SubjectConfig } from './config/subjects'
import { SUBJECTS, nodeFileForCode } from './config/subjects'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ProgressionStandard {
  code: string;
  title: string;
  progression_checkpoint: string;
  strand_key?: string;
}

export interface ProgressionYearLevel {
  label: string;
  standards: ProgressionStandard[];
}

export type StrandType = 'concept' | 'capability'

export interface StrandMeta {
  label: string;
  type: StrandType;
}

export interface ProgressionThreads {
  description?: string;
  strands: Record<string, StrandMeta>;
}

export interface ProgressionMap {
  subject: string;
  curriculum: string;
  year_levels: Record<string, ProgressionYearLevel>;
  progression_threads: ProgressionThreads;
}

export interface AvailableStandard {
  code: string;
  title: string;
  strand?: string;
}

// ── Year → band mapping ─────────────────────────────────────────────────────────
// Capability strands (Science H/I, Technologies P) are keyed by band in the
// progression maps, while concept strands sit under individual year keys.
// Subjects whose authoredYears are already bands (e.g. Tech '7-8') resolve via
// the year key directly; the band lookup returns undefined for them.

const YEAR_TO_BAND: Record<string, string> = {
  '1': '1-2', '2': '1-2',
  '3': '3-4', '4': '3-4',
  '5': '5-6', '6': '5-6',
  '7': '7-8', '8': '7-8',
  '9': '9-10', '10': '9-10',
}

// ── Caches ────────────────────────────────────────────────────────────────────

const progressionMapCache = new Map<string, ProgressionMap>()
const nodeFileCache = new Map<string, NodeFile>()

// ── Progression map ───────────────────────────────────────────────────────────

export async function loadProgressionMap(subject: SubjectConfig): Promise<ProgressionMap> {
  const cached = progressionMapCache.get(subject.id)
  if (cached) return cached
  const res = await fetch(`/data/${subject.dataFile}`)
  if (!res.ok) throw new Error(`Failed to load progression map for ${subject.id}`)
  const data: ProgressionMap = await res.json()
  progressionMapCache.set(subject.id, data)
  return data
}

/**
 * Return standards for a year, checked across three key shapes:
 *   1. topicKey  — topic-scoped concept standards (History/Geography Y7–10)
 *   2. year      — flat year key (HASS-family skills)
 *   3. bandKey   — banded capability strands (Science H/I, Technologies P)
 * Deduplicates by code (first key wins). Only standards with a resolvable node
 * file appear, so capability standards surface once their files are in the
 * subject config.
 */
export function getStandardsForYear(
  map: ProgressionMap,
  subject: SubjectConfig,
  year: string,
  topicKey?: string
): AvailableStandard[] {
  const keys = [topicKey, year, YEAR_TO_BAND[year]].filter(
    (k): k is string => Boolean(k),
  )

  const seen = new Set<string>()
  const out: AvailableStandard[] = []

  for (const key of keys) {
    const yearData = map.year_levels[key]
    if (!yearData) continue
    for (const std of yearData.standards) {
      if (seen.has(std.code)) continue
      if (nodeFileForCode(subject, std.code) === undefined) continue
      seen.add(std.code)
      out.push({ code: std.code, title: std.title, strand: std.strand_key })
    }
  }

  return out
}

/**
 * Split standards into concept / capability using the map's strand types.
 * Matches Planner's signature — reads `progression_threads.strands[strand].type`.
 * Untyped / unknown strands default to concept.
 */
export function splitStandardsByType(
  standards: AvailableStandard[],
  map: ProgressionMap,
): { concept: AvailableStandard[]; capability: AvailableStandard[] } {
  const strands = map.progression_threads?.strands ?? {}
  const concept: AvailableStandard[] = []
  const capability: AvailableStandard[] = []
  for (const std of standards) {
    const type = std.strand ? strands[std.strand]?.type : undefined
    if (type === 'capability') capability.push(std)
    else concept.push(std)
  }
  return { concept, capability }
}

// ── Node files ────────────────────────────────────────────────────────────────

export async function loadNodeFile(subject: SubjectConfig, code: string): Promise<NodeFile> {
  const path = nodeFileForCode(subject, code)
  if (!path) throw new Error(`No node file for ${code} in ${subject.id}`)
  const cached = nodeFileCache.get(path)
  if (cached) return cached
  const res = await fetch(`/data/${path}`)
  if (!res.ok) throw new Error(`Could not load node file for ${code}`)
  const data = await res.json() as NodeFile
  nodeFileCache.set(path, data)
  return data
}

/**
 * Load a node file knowing only the curriculum code — resolves the owning
 * subject from SUBJECTS first. Used by the student check-in, which stores
 * `standard` (the code) but not the subject id. Shared node files (e.g. HASS
 * F–6 across disciplines) resolve to the same path regardless of which subject
 * matches first.
 */
export async function loadNodeFileByCode(code: string): Promise<NodeFile> {
  const subject = SUBJECTS.find((s) => nodeFileForCode(s, code) !== undefined)
  if (!subject) throw new Error(`No subject contains a node file for ${code}`)
  return loadNodeFile(subject, code)
}

// ── Criteria helpers ──────────────────────────────────────────────────────────

export function extractCriteria(
  nodeFile: NodeFile,
  nodeId: string
): { text: string; nodeId: number; nodeLabel: string; hinge: boolean }[] {
  const nodes = nodeFile.standard.nodes

  if (nodeId === 'all') {
    return nodes.flatMap((n) =>
      (n.success_criteria ?? []).map((text) => ({
        text,
        nodeId: n.id,
        nodeLabel: n.label,
        hinge: n.hinge,
      }))
    )
  }

  const node = nodes.find((n) => n.id === parseInt(nodeId))
  if (!node) return []
  return (node.success_criteria ?? []).map((text) => ({
    text,
    nodeId: node.id,
    nodeLabel: node.label,
    hinge: node.hinge,
  }))
}

export interface CriteriaGroup {
  nodeId: number
  nodeLabel: string
  hinge: boolean
  progressionCheckpoint: string
  criteria: string[]
}

export function groupCriteria(nodeFile: NodeFile, nodeId: string): CriteriaGroup[] {
  const nodes = nodeFile.standard.nodes

  if (nodeId === 'all') {
    return nodes
      .filter((n) => (n.success_criteria ?? []).length > 0)
      .map((n) => ({
        nodeId: n.id,
        nodeLabel: n.label,
        hinge: n.hinge,
        progressionCheckpoint: n.progression_checkpoint,
        criteria: n.success_criteria ?? [],
      }))
  }

  const node = nodes.find((n) => n.id === parseInt(nodeId))
  if (!node || !(node.success_criteria ?? []).length) return []
  return [{
    nodeId: node.id,
    nodeLabel: node.label,
    hinge: node.hinge,
    progressionCheckpoint: node.progression_checkpoint,
    criteria: node.success_criteria ?? [],
  }]
}