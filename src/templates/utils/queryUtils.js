/**
 * Utility functions for query operations
 */

/**
 * Build a query string from an object
 * @param {Object} params - Query parameters
 * @returns {string} - Query string
 */
export function buildQueryString(params) {
  if (!params || Object.keys(params).length === 0) {
    return '';
  }

  const queryParts = [];

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (Array.isArray(value)) {
      // Handle array values
      for (const item of value) {
        queryParts.push(`${encodeURIComponent(key)}[]=${encodeURIComponent(item)}`);
      }
    } else if (typeof value === 'object') {
      // Handle nested objects
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        queryParts.push(
          `${encodeURIComponent(key)}[${encodeURIComponent(nestedKey)}]=${encodeURIComponent(nestedValue)}`
        );
      }
    } else {
      // Handle primitive values
      queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  }

  return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
}

/**
 * Create WHERE criteria in Waterline format
 * @param {Object} criteria - Filter criteria
 * @returns {Object} - Formatted criteria
 */
export function where(criteria) {
  return { where: criteria };
}

/**
 * Create a complex criteria with operators
 */
export const operators = {
  /**
   * Less than operator
   * @param {*} value - Comparison value
   * @returns {Object} - Operator expression
   */
  lessThan: (value) => ({ '<': value }),

  /**
   * Less than or equal operator
   * @param {*} value - Comparison value
   * @returns {Object} - Operator expression
   */
  lessThanOrEqual: (value) => ({ '<=': value }),

  /**
   * Greater than operator
   * @param {*} value - Comparison value
   * @returns {Object} - Operator expression
   */
  greaterThan: (value) => ({ '>': value }),

  /**
   * Greater than or equal operator
   * @param {*} value - Comparison value
   * @returns {Object} - Operator expression
   */
  greaterThanOrEqual: (value) => ({ '>=': value }),

  /**
   * Not equal operator
   * @param {*} value - Comparison value
   * @returns {Object} - Operator expression
   */
  notEquals: (value) => ({ '!=': value }),

  /**
   * IN operator (value is in array)
   * @param {Array} values - Array of values
   * @returns {Object} - Operator expression
   */
  in: (values) => ({ in: values }),

  /**
   * NOT IN operator (value is not in array)
   * @param {Array} values - Array of values
   * @returns {Object} - Operator expression
   */
  notIn: (values) => ({ notIn: values }),

  /**
   * LIKE operator (string contains)
   * @param {string} value - String to match
   * @returns {Object} - Operator expression
   */
  contains: (value) => ({ contains: value }),

  /**
   * Starts with operator
   * @param {string} value - String to match
   * @returns {Object} - Operator expression
   */
  startsWith: (value) => ({ startsWith: value }),

  /**
   * Ends with operator
   * @param {string} value - String to match
   * @returns {Object} - Operator expression
   */
  endsWith: (value) => ({ endsWith: value })
};