/**
 * Preprocesses the OpenAPI specification to remove circular references
 */
function processOpenApiSpec(openApi) {
  const schema = openApi.components.schemas;

  // Helper function to replace nested objects with $refs
  const replaceNestedObjectsWithRefs = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;

    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map((item) => replaceNestedObjectsWithRefs(item));
    }

    // Process object properties
    const newObj = { ...obj };

    // Special handling for items containing direct model references
    if (obj.items && obj.$ref) {
      return obj;
    }

    // Look for places where we embed the whole model instead of referencing it
    if (obj.properties) {
      Object.keys(obj.properties).forEach((propName) => {
        const prop = obj.properties[propName];

        // If it's a complex object with its own properties, consider replacing with a ref
        if (prop.type === 'object' && prop.properties) {
          newObj.properties[propName] = {
            $ref: `#/components/schemas/${propName}`
          };

          // Add the model to schemas if it doesn't already exist
          if (!schema[propName]) {
            schema[propName] = prop;
          }
        }
        // Handle arrays of objects that could be circular
        else if (
          prop.type === 'array' &&
          prop.items &&
          prop.items.type === 'object' &&
          prop.items.properties
        ) {
          const itemType = `${propName}Item`;
          newObj.properties[propName] = {
            type: 'array',
            items: {
              $ref: `#/components/schemas/${itemType}`
            }
          };

          // Add the item model to schemas
          if (!schema[itemType]) {
            schema[itemType] = prop.items;
          }
        }
        // Handle descriptions that involve circular references
        else if (
          prop.description &&
          prop.description.includes('Array of') &&
          prop.type === 'array'
        ) {
          if (prop.items && prop.items.oneOf) {
            const fixedOneOf = prop.items.oneOf.map((item) => {
              if (item.$ref) return item;
              return { $ref: `#/components/schemas/${propName}Item` };
            });

            newObj.properties[propName] = {
              type: 'array',
              items: {
                oneOf: fixedOneOf
              }
            };
          }
        } else {
          // Recursively process other objects
          newObj.properties[propName] = replaceNestedObjectsWithRefs(prop);
        }
      });
    }

    // Process all other properties recursively
    Object.keys(obj).forEach((key) => {
      if (key !== 'properties') {
        newObj[key] = replaceNestedObjectsWithRefs(obj[key]);
      }
    });

    return newObj;
  };

  // Process all schemas
  Object.keys(schema).forEach((modelName) => {
    schema[modelName] = replaceNestedObjectsWithRefs(schema[modelName]);
  });

  // Also process the paths to ensure they don't contain circular refs
  Object.keys(openApi.paths).forEach((pathKey) => {
    const path = openApi.paths[pathKey];

    Object.keys(path).forEach((methodKey) => {
      const method = path[methodKey];

      // Process requestBody if it exists
      if (method.requestBody && method.requestBody.content) {
        Object.keys(method.requestBody.content).forEach((contentType) => {
          const content = method.requestBody.content[contentType];
          if (content.schema) {
            content.schema = replaceNestedObjectsWithRefs(content.schema);
          }
        });
      }

      // Process responses
      if (method.responses) {
        Object.keys(method.responses).forEach((statusCode) => {
          const response = method.responses[statusCode];
          if (response.content) {
            Object.keys(response.content).forEach((contentType) => {
              const content = response.content[contentType];
              if (content.schema) {
                content.schema = replaceNestedObjectsWithRefs(content.schema);
              }
            });
          }
        });
      }
    });
  });

  return openApi;
}

module.exports = {
  processOpenApiSpec
};
