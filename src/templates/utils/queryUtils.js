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
  lessThan: (value) => ({ '<': value }),
  lessThanOrEqual: (value) => ({ '<=': value }),
  greaterThan: (value) => ({ '>': value }),
  greaterThanOrEqual: (value) => ({ '>=': value }),
  notEquals: (value) => ({ '!=': value }),
  in: (values) => ({ in: values }),
  notIn: (values) => ({ notIn: values }),
  contains: (value) => ({ contains: value }),
  startsWith: (value) => ({ startsWith: value }),
  endsWith: (value) => ({ endsWith: value })
};

/**
 * Query chain for waterline-like syntax
 */
export class QueryChain {
  constructor(client, resourcePath, criteria = {}) {
    this.client = client;
    this.resourcePath = resourcePath;
    this.criteria = { ...criteria };
    this.limitValue = null;
    this.skipValue = 0;
    this.sortValue = null;
    this.selectFields = null;
    this.populateFields = null;

    // Make the QueryChain thenable
    this.then = (resolve, reject) => this.execute().then(resolve, reject);
  }

  limit(limit) {
    this.limitValue = limit;
    return this;
  }

  skip(skip) {
    this.skipValue = skip;
    return this;
  }

  select(fields) {
    this.selectFields = Array.isArray(fields) ? fields : [fields];
    return this;
  }

  sort(sort) {
    this.sortValue = sort;
    return this;
  }

  populate(fields) {
    this.populateFields = Array.isArray(fields) ? fields : [fields];
    return this;
  }

  async execute() {
    const queryParams = { ...this.criteria };

    if (this.limitValue !== null) {
      queryParams.limit = this.limitValue;
    }

    if (this.skipValue > 0) {
      queryParams.skip = this.skipValue;
    }

    if (this.sortValue) {
      queryParams.sort = this.sortValue;
    }

    if (this.selectFields) {
      queryParams.select = this.selectFields.join(',');
    }

    if (this.populateFields) {
      queryParams.populate = this.populateFields.join(',');
    }

    return await this.client.request({
      method: 'get',
      url: this.resourcePath,
      params: queryParams
    });
  }

  async executeOne() {
    const response = await this.limit(1).execute();
    if (response.data && Array.isArray(response.data)) {
      return {
        data: response.data.length > 0 ? response.data[0] : null,
        headers: response.headers
      };
    }
    return response;
  }

  async count() {
    const response = await this.client.request({
      method: 'get',
      url: `${this.resourcePath}/count`,
      params: this.criteria
    });

    if (response.data) {
      return {
        data: { count: response.data.count || 0 },
        headers: response.headers
      };
    }

    return response;
  }
}
