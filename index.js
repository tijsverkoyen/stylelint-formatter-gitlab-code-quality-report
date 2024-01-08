import crypto from 'crypto'

/**
 * @param {string} msg
 * @param {Partial<import('stylelint').RuleMeta> | undefined} metadata
 * @returns {string}
 */
function buildMessage (msg, metadata) {
  if (!metadata) return msg

  const url = metadata.url ? ` - ${metadata.url}` : ''

  let additional = [
    metadata.fixable ? 'maybe fixable' : '',
    metadata.deprecated ? 'deprecated' : ''
  ]
    .filter(Boolean)
    .join(', ')

  additional = additional ? ` [${additional}]` : ''

  return `${msg}${additional}${url}`
}

function createFingerprint (source, line, column, rule) {
  return crypto.createHash('sha256').update(
    `${source}:${line}:${column}:${rule}`
  ).digest('hex')
}

function mapSeverity (severity) {
  switch (severity) {
    case 'error':
      return 'major'
    default:
      return 'minor'
  }
}

/**
 * @type {import('stylelint').Formatter}
 */
export default function formatter (results, returnValue) {
  const issues = []
  const metadata = returnValue.ruleMetadata

  // early return if there are no results
  if (!Array.isArray(results) || results.length === 0) {
    return JSON.stringify(issues, null, 2)
  }

  for (const result of results) {
    for (const error of result.parseErrors || []) {
      issues.push({
        description: `${error.text} (${error.stylelintType})`,
        check_name: error.stylelintType,
        fingerprint: createFingerprint(result.source, error.line, error.column, error.stylelintType),
        severity: 'major',
        location: {
          path: result.source,
          positions: {
            begin: {
              line: error.line,
              column: error.column
            }
          }
        }
      })
    }

    for (const warning of result.warnings) {
      const location = {
        path: result.source,
        positions: {
          begin: {
            line: warning.line,
            column: warning.column
          }
        }
      }

      if (warning.endLine !== undefined) {
        location.positions = {
          ...location.positions,
          end: {
            line: warning.endLine,
            column: warning.endColumn
          }
        }
      }

      issues.push({
        description: buildMessage(warning.text, metadata[warning.rule]),
        check_name: warning.rule,
        fingerprint: createFingerprint(result.source, warning.line, warning.column, warning.rule),
        severity: mapSeverity(warning.severity),
        location
      })
    }
  }

  return JSON.stringify(issues, null, 2)
}
