import type { NodeFile } from './types/NodeFile'
import type { SubjectConfig } from './config/subjects'
import { nodeFileForCode } from './config/subjects'

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

export interface ProgressionMap {
  subject: string;
  curriculum: string;
  year_levels: Record<string, ProgressionYearLevel>;
  progression_threads: unknown;
}

export interface AvailableStandard {
  code: string;
  title: string;
  strand?: string;
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

export function getStandardsForYear(
  map: ProgressionMap,
  subject: SubjectConfig,
  year: string,
  topicKey?: string
): AvailableStandard[] {
  const key = topicKey ?? year
  const yearData = map.year_levels[key]
  if (!yearData) return []
  return yearData.standards
    .filter((std) => nodeFileForCode(subject, std.code) !== undefined)
    .map((std) => ({ code: std.code, title: std.title, strand: std.strand_key }))
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