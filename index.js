/**
 * @type {import('stylelint').Formatter}
 */
export default function formatter (results, returnValue) {
  const issues = []

  // early return if there are no results
  if (!Array.isArray(results) || results.length === 0) {
    return JSON.stringify(issues)
  }

  return JSON.stringify(issues)
}
