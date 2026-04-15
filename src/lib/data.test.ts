import { describe, it, expect } from 'vitest'
import { extractCriteria, groupCriteria } from './data'
import type { NodeFile as NodeFile } from './types/NodeFile'

// Minimal mock node file
const mockNodeFile: NodeFile = {
  year_level: '7',
  subject: 'Science',
  curriculum: 'ACARA v9',
  standard: {
    code: 'AC9S7U01',
    title: 'Classification and Biodiversity',
    description: 'Test description',
    prior_knowledge: 'Test prior knowledge',
    progression_endpoint: 'Students can explain classification.',
    nodes: [
      {
        id: 1,
        label: 'Purpose of classification',
        progression_checkpoint: 'Students can explain why classification is useful.',
        minimum_width: 'State two reasons.',
        typical_width: 'Compare two systems.',
        wider: ['Investigate First Nations systems'],
        hinge: false,
        hinge_reason: null,
        success_criteria: [
          'Names at least two reasons why classification is useful',
          'Gives a correct everyday example of classification',
        ],
      },
      {
        id: 2,
        label: 'Taxonomy: major groups',
        progression_checkpoint: 'Students can place organisms into kingdoms.',
        minimum_width: 'Name the major kingdoms.',
        typical_width: 'Sort 12 organisms.',
        wider: ['Research boundary cases'],
        hinge: true,
        hinge_reason: 'Gateway misconception',
        success_criteria: [
          'Correctly places 5 organisms into kingdoms',
          'Identifies at least one organism that is difficult to classify',
        ],
      },
      {
        id: 3,
        label: 'Using dichotomous keys',
        progression_checkpoint: 'Students can use a dichotomous key.',
        minimum_width: 'Use a provided key.',
        typical_width: 'Use two different keys.',
        wider: ['Evaluate a flawed key'],
        hinge: true,
        hinge_reason: 'Gateway misconception',
        success_criteria: [
          'Follows all decision points correctly',
          'Names the observable feature at each point',
        ],
      },
    ],
  },
}

describe('extractCriteria', () => {
  it('returns all criteria for a single node', () => {
    const result = extractCriteria(mockNodeFile, '1')
    expect(result).toHaveLength(2)
    expect(result[0].text).toBe('Names at least two reasons why classification is useful')
    expect(result[0].nodeId).toBe(1)
    expect(result[0].nodeLabel).toBe('Purpose of classification')
    expect(result[0].hinge).toBe(false)
  })

  it('returns all criteria for all nodes when nodeId is "all"', () => {
    const result = extractCriteria(mockNodeFile, 'all')
    expect(result).toHaveLength(6) // 2 from node 1 + 2 from node 2 + 2 from node 3
  })

  it('returns empty array for unknown node id', () => {
    const result = extractCriteria(mockNodeFile, '99')
    expect(result).toHaveLength(0)
  })

  it('correctly sets hinge flag on criteria', () => {
    const result = extractCriteria(mockNodeFile, '2')
    expect(result[0].hinge).toBe(true)
  })
})

describe('groupCriteria', () => {
  it('returns a single group for a specific node', () => {
    const groups = groupCriteria(mockNodeFile, '1')
    expect(groups).toHaveLength(1)
    expect(groups[0].nodeId).toBe(1)
    expect(groups[0].criteria).toHaveLength(2)
    expect(groups[0].hinge).toBe(false)
    expect(groups[0].progressionCheckpoint).toBe('Students can explain why classification is useful.')
  })

  it('returns multiple groups for "all" nodeId', () => {
    const groups = groupCriteria(mockNodeFile, 'all')
    expect(groups).toHaveLength(3)
    expect(groups[0].nodeId).toBe(1)
    expect(groups[1].nodeId).toBe(2)
    expect(groups[2].nodeId).toBe(3)
  })

  it('returns empty array for unknown node id', () => {
    const groups = groupCriteria(mockNodeFile, '99')
    expect(groups).toHaveLength(0)
  })

  it('sets correct criteria count per group', () => {
    const groups = groupCriteria(mockNodeFile, 'all')
    expect(groups[0].criteria).toHaveLength(2)
    expect(groups[1].criteria).toHaveLength(2)
    expect(groups[2].criteria).toHaveLength(2)
  })
})
