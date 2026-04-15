import type { NodeFile } from './types/NodeFile'

// Fetch a node file from static/data/
export async function loadNodeFile(code: string): Promise<NodeFile> {
  const year = code.match(/AC9S(\d+)/)?.[1] ?? '7'
  const res = await fetch(`/data/y${year}_science_${code}.json`)
  if (!res.ok) throw new Error(`Could not load node file for ${code}`)
  return res.json() as Promise<NodeFile>
}

// Flat list of all criteria texts for a given node_id ('all' or a numeric id)
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

// Group criteria by node — used for 'all waypoints' display
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
  return [
    {
      nodeId: node.id,
      nodeLabel: node.label,
      hinge: node.hinge,
      progressionCheckpoint: node.progression_checkpoint,
      criteria: node.success_criteria ?? [],
    },
  ]
}
