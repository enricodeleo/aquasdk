/**
 * QueryBuilder for constructing and executing API requests in a Waterline-style.
 */
export class QueryBuilder {
  constructor({ client, method, path, criteria = {} }) {
    this.client = client;
    this.method = method;
    this.path = path;
    this.params = { where: criteria };
  }

  /**
   * Specifies which fields to return in the result.
   * @param {string|string[]} fieldNames - A field name or an array of field names.
   * @returns {QueryBuilder} The QueryBuilder instance for chaining.
   */
  select(fieldNames) {
    this.params.select = Array.isArray(fieldNames) ? fieldNames.join(',') : fieldNames;
    return this;
  }

  /**
   * Specifies related models to populate.
   * @param {string|string[]} association - An association name or an array of association names.
   * @returns {QueryBuilder} The QueryBuilder instance for chaining.
   */
  populate(association) {
    this.params.populate = Array.isArray(association) ? association.join(',') : association;
    return this;
  }

  /**
   * Specifies the number of records to skip.
   * @param {number} num - The number of records to skip.
   * @returns {QueryBuilder} The QueryBuilder instance for chaining.
   */
  skip(num) {
    this.params.skip = num;
    return this;
  }

  /**
   * Specifies the maximum number of records to return.
   * @param {number} num - The maximum number of records.
   * @returns {QueryBuilder} The QueryBuilder instance for chaining.
   */
  limit(num) {
    this.params.limit = num;
    return this;
  }

  /**
   * Specifies the sorting order.
   * @param {string} sortStr - The sort string (e.g., 'createdAt DESC').
   * @returns {QueryBuilder} The QueryBuilder instance for chaining.
   */
  sort(sortStr) {
    this.params.sort = sortStr;
    return this;
  }

  /**
   * Executes the query.
   * @returns {Promise<any>} A promise that resolves with the API response.
   */
  execute() {
    const finalPath = this.path.replace(/\{(\w+)\}/g, (match, key) => {
      if (this.params.where[key]) {
        const value = this.params.where[key];
        delete this.params.where[key];
        return encodeURIComponent(value);
      }
      return match;
    });

    // Clone the params to avoid mutation
    const finalParams = { ...this.params };

    // If the where clause is empty, remove it completely
    if (finalParams.where && Object.keys(finalParams.where).length === 0) {
      delete finalParams.where;
    }

    return this.client.request({
      method: this.method,
      url: finalPath,
      params: finalParams,
    });
  }

  /**
   * Makes the QueryBuilder "thenable," allowing it to be used with async/await.
   * @param {function} onFulfilled - The success callback.
   * @param {function} onRejected - The error callback.
   * @returns {Promise<any>} A promise that resolves with the API response.
   */
  then(onFulfilled, onRejected) {
    return this.execute().then(onFulfilled, onRejected);
  }
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