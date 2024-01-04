import { describe, expect, test } from '@jest/globals'
import formatter from '../index.js'

describe('formatter', () => {
  test('returns a string', () => {
    expect(typeof formatter()).toBe('string')
  })

  test('outputs [] if there are no results', () => {
    const results = []
    const returnValue = { ruleMetadata: {} }

    const output = formatter(results, returnValue)

    expect(output).toBe('[]')
  })
})
