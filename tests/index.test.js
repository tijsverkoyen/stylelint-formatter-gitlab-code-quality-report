import { describe, expect, test } from '@jest/globals'
import formatter from '../index.js'

describe('formatter', () => {
  test('returns a string', () => {
    expect(typeof formatter()).toBe('string')
  })

  test('return the correct string', () => {
    const result = formatter()

    expect(result).toBe('a string of formatted results')
  })
})
