import { describe, expect, test } from '@jest/globals'
import formatter from '../index.js'

describe('formatter', () => {
  test('returns a string', () => {
    const results = []
    const returnValue = { ruleMetadata: {} }
    const output = formatter(results, returnValue)

    expect(typeof output).toBe('string')
  })

  test('outputs [] if there are no results', () => {
    const results = []
    const returnValue = { ruleMetadata: {} }
    const output = formatter(results, returnValue)

    expect(output).toBe('[]')
  })
  test('outputs [] if there are no warnings and no parseErrors', () => {
    const results = [
      {
        source: 'path/to/file.css',
        warnings: []
      },
      {
        source: 'a.css',
        warnings: [],
        parseErrors: []
      }
    ]
    const returnValue = { ruleMetadata: {} }
    const output = formatter(results, returnValue)

    expect(output).toBe('[]')
  })

  test('has correct output when there are warnings and parseErrors', () => {
    const results = [
      {
        source: 'path/to/file.css',
        warnings: [
          {
            line: 1,
            column: 2,
            endLine: 1,
            endColumn: 5,
            rule: 'foo',
            severity: 'error',
            text: 'Unexpected "foo" (foo)'
          }
        ]
      },
      {
        source: 'a.css',
        warnings: [
          {
            line: 10,
            column: 20,
            rule: 'bar',
            severity: 'warning',
            text: 'Unexpected "bar" (bar)'
          },
          {
            line: 20,
            column: 3,
            text: 'Anonymous error'
          }
        ],
        parseErrors: [
          {
            line: 20,
            column: 1,
            stylelintType: 'foo-error',
            text: 'Cannot parse foo'
          }
        ]
      }
    ]
    const returnValue = {
      ruleMetadata: {
        foo: { url: 'https://stylelint.io/rules/foo' },
        bar: { url: 'https://stylelint.io/rules/bar', fixable: true, deprecated: true }
      }
    }
    const output = formatter(results, returnValue)
    const expectedOutput = [
      {
        description: 'Unexpected "foo" (foo) - https://stylelint.io/rules/foo',
        check_name: 'foo',
        fingerprint: '2dad84ea6bd3991c03f12dd83d9fca3e5733416d8c2ce702de00cff6109dba32',
        severity: 'major',
        location: {
          path: 'path/to/file.css',
          positions: {
            begin: {
              line: 1,
              column: 2
            },
            end: {
              line: 1,
              column: 5
            }
          }
        }
      },
      {
        description: 'Cannot parse foo (foo-error)',
        check_name: 'foo-error',
        fingerprint: '3559795a632ce79f77107c6eb1493f4ce95fecba616d94a1f95a7901aaa607bd',
        severity: 'major',
        location: {
          path: 'a.css',
          positions: {
            begin: {
              line: 20,
              column: 1
            }
          }
        }
      },
      {
        description: 'Unexpected "bar" (bar) [maybe fixable, deprecated] - https://stylelint.io/rules/bar',
        check_name: 'bar',
        fingerprint: '9b960db4b239da4235018dfe918bb242765a3cf78abda7bd60a989865473854c',
        severity: 'minor',
        location: {
          path: 'a.css',
          positions: {
            begin: {
              line: 10,
              column: 20
            }
          }
        }
      },
      {
        description: 'Anonymous error',
        fingerprint: '41486fdce566798e72875d697bbb83f62675a80bb500c3e2044f9cfbbbfcf520',
        severity: 'minor',
        location: {
          path: 'a.css',
          positions: {
            begin: {
              line: 20,
              column: 3
            }
          }
        }
      }
    ]

    expect(output).toBe(JSON.stringify(expectedOutput, null, 2))
  })
})
