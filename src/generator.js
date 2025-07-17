import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';
import { camelCase, pascalCase } from 'change-case';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Register Handlebars helpers
Handlebars.registerHelper('camelCase', function(str) {
  return camelCase(str);
});

Handlebars.registerHelper('pascalCase', function(str) {
  return pascalCase(str);
});

export async function generateSdk(api, apiWithRefs, outputDir, version, verbose) {
  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Extract API metadata
  const apiInfo = {
    title: api.info.title,
    description: api.info.description || '',
    version: version || api.info.version,
    baseUrl: getBaseUrl(api)
  };

  if (verbose) {
    console.log('API Info:', apiInfo);
  }

  // Generate resources and models from paths and schemas
  const resources = extractResources(api, apiWithRefs, verbose);
  const models = extractModels(api, apiWithRefs, verbose);

  // Generate the SDK files
  await generateIndexFile(apiInfo, resources, outputDir, verbose);
  await generateClientFile(apiInfo, outputDir, verbose);
  await generateResourceFiles(resources, outputDir, verbose);
  await generateModelFiles(models, outputDir, verbose);
  await generatePackageJson(apiInfo, outputDir, verbose);
  await generateReadmeFile(apiInfo, resources, outputDir, verbose);
  await copyTemplateFiles(outputDir, verbose);

  if (verbose) {
    console.log('SDK generation completed.');
  }
}

function getBaseUrl(api) {
  if (api.servers && api.servers.length > 0) {
    return api.servers[0].url;
  }
  return 'http://localhost';
}

function extractResources(api, apiWithRefs, verbose) {
  const resources = {};

  for (const [path, pathItem] of Object.entries(api.paths)) {
    const segments = path.split('/').filter(Boolean);
    if (segments.length === 0) continue;

    // The top-level resource is always the first segment.
    const resourceName = segments[0];
    if (!resources[resourceName]) {
      resources[resourceName] = {
        name: resourceName,
        operations: [],
        subResources: {},
      };
    }

    let targetResource = resources[resourceName];

    // Traverse path to find the correct resource/sub-resource to attach the operation to.
    // A sub-resource is a segment that follows a parameter segment.
    for (let i = 1; i < segments.length; i++) {
      const prevSegment = segments[i - 1];
      const currentSegment = segments[i];

      if (prevSegment.startsWith('{')) {
        // The previous segment was a parameter, so the current one is a sub-resource.
        if (!targetResource.subResources[currentSegment]) {
          targetResource.subResources[currentSegment] = {
            name: currentSegment,
            operations: [],
            subResources: {},
          };
        }
        targetResource = targetResource.subResources[currentSegment];
      } else if (currentSegment.startsWith('{')) {
        // This is a parameter of an already identified sub-resource path, just continue.
        continue;
      }
    }

    // Now, create the operation and add it to the determined targetResource
    for (const [method, operation] of Object.entries(pathItem)) {
      if (!['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
        continue;
      }

      const parameters = operation.parameters || [];
      const pathParams = parameters.filter(p => p.in === 'path').map(p => p.name);
      const queryParams = parameters.filter(p => p.in === 'query').map(p => p.name);

      let requestBodySchema = null;
      if (operation.requestBody && operation.requestBody.content) {
        const contentType = Object.keys(operation.requestBody.content)[0];
        if (contentType && operation.requestBody.content[contentType].schema) {
          requestBodySchema = operation.requestBody.content[contentType].schema;
        }
      }

      const operationObj = {
        id: operation.operationId || `${method}${pascalCase(path.replace(/[\/{}]/g, ''))}`,
        summary: operation.summary || '',
        description: operation.description || '',
        method,
        path,
        pathParams,
        queryParams,
        hasRequestBody: !!requestBodySchema,
        hasResponseBody: false,
        returnType: 'void',
      };

      if (operation.responses && operation.responses['200']) {
        const response = operation.responses['200'];
        if (response.content) {
          const contentType = Object.keys(response.content)[0];
          if (contentType && response.content[contentType].schema) {
            operationObj.hasResponseBody = true;
            operationObj.returnType = getResponseType(response.content[contentType].schema);
          }
        }
      }
      
      targetResource.operations.push(operationObj);
    }
  }

  if (verbose) {
    console.log(`Extracted ${Object.keys(resources).length} resources.`);
  }

  return resources;
}

function extractModels(api, apiWithRefs, verbose) {
  const models = {};

  // Extract models from components.schemas
  if (api.components && api.components.schemas) {
    for (const [name, schema] of Object.entries(api.components.schemas)) {
      models[name] = {
        name,
        properties: {},
        required: schema.required || []
      };

      // Extract properties
      if (schema.properties) {
        for (const [propName, propSchema] of Object.entries(schema.properties)) {
          models[name].properties[propName] = {
            name: propName,
            type: getPropertyType(propSchema),
            required: models[name].required.includes(propName),
            description: propSchema.description || ''
          };
        }
      }
    }
  }

  if (verbose) {
    console.log(`Extracted ${Object.keys(models).length} models.`);
  }

  return models;
}

function deriveResourceNameFromPath(path) {
  // Extract resource name from the path - preserving as-is
  const parts = path.split('/').filter(Boolean);
  if (parts.length > 0) {
    // Keep the path segment exactly as it appears in the URL
    return parts[0];
  }
  return 'api';
}

function getPropertyType(schema) {
  if (schema.$ref) {
    return schema.$ref.split('/').pop();
  }

  if (schema.type === 'array' && schema.items) {
    if (schema.items.$ref) {
      return `${schema.items.$ref.split('/').pop()}[]`;
    }
    return `${schema.items.type || 'any'}[]`;
  }

  if (schema.type === 'object' && schema.additionalProperties) {
    if (schema.additionalProperties.$ref) {
      return `Record<string, ${schema.additionalProperties.$ref.split('/').pop()}>`;
    }
    return `Record<string, ${schema.additionalProperties.type || 'any'}>`;
  }

  return schema.type || 'any';
}

function getResponseType(schema) {
  if (schema.$ref) {
    return schema.$ref.split('/').pop();
  }

  if (schema.type === 'array' && schema.items) {
    if (schema.items.$ref) {
      return `${schema.items.$ref.split('/').pop()}[]`;
    }
    return `${schema.items.type || 'any'}[]`;
  }

  return schema.type || 'any';
}

async function generateIndexFile(apiInfo, resources, outputDir, verbose) {
  if (verbose) {
    console.log('Generating index.js file...');
  }

  const template = await fs.readFile(path.join(__dirname, 'templates', 'index.hbs'), 'utf8');
  const compiledTemplate = Handlebars.compile(template);

  const content = compiledTemplate({
    apiInfo,
    resources: Object.values(resources),
    timestamp: new Date().toISOString()
  });

  await fs.writeFile(path.join(outputDir, 'index.js'), content);
}

async function generateClientFile(apiInfo, outputDir, verbose) {
  if (verbose) {
    console.log('Generating client.js file...');
  }

  const template = await fs.readFile(path.join(__dirname, 'templates', 'client.hbs'), 'utf8');
  const compiledTemplate = Handlebars.compile(template);

  const content = compiledTemplate({
    apiInfo,
    timestamp: new Date().toISOString()
  });

  await fs.writeFile(path.join(outputDir, 'client.js'), content);
}

async function generateResourceFiles(resources, outputDir, verbose) {
  if (verbose) {
    console.log('Generating resource files...');
  }

  // Create resources directory
  const resourcesDir = path.join(outputDir, 'resources');
  await fs.mkdir(resourcesDir, { recursive: true });

  const template = await fs.readFile(path.join(__dirname, 'templates', 'resource.hbs'), 'utf8');
  const compiledTemplate = Handlebars.compile(template);

  // Generate a file for each resource
  for (const [resourceName, resource] of Object.entries(resources)) {
    if (verbose) {
      console.log(`Generating resource file for ${resourceName}...`);
    }

    const content = compiledTemplate({
      resource,
      timestamp: new Date().toISOString()
    });

    await fs.writeFile(path.join(resourcesDir, `${camelCase(resourceName)}.js`), content);
  }
}

async function generateModelFiles(models, outputDir, verbose) {
  if (verbose) {
    console.log('Generating model files...');
  }

  // Create models directory
  const modelsDir = path.join(outputDir, 'models');
  await fs.mkdir(modelsDir, { recursive: true });

  const template = await fs.readFile(path.join(__dirname, 'templates', 'model.hbs'), 'utf8');
  const compiledTemplate = Handlebars.compile(template);

  // Generate a file for each model
  for (const [modelName, model] of Object.entries(models)) {
    if (verbose) {
      console.log(`Generating model file for ${modelName}...`);
    }

    const content = compiledTemplate({
      model,
      timestamp: new Date().toISOString()
    });

    await fs.writeFile(path.join(modelsDir, `${camelCase(modelName)}.js`), content);
  }
}

async function generatePackageJson(apiInfo, outputDir, verbose) {
  if (verbose) {
    console.log('Generating package.json file...');
  }

  const packageJson = {
    name: camelCase(apiInfo.title) + '-sdk',
    version: apiInfo.version,
    description: `JavaScript SDK for ${apiInfo.title}`,
    type: 'module',
    main: 'index.js',
    dependencies: {
      axios: '^1.6.1'
    }
  };

  await fs.writeFile(
    path.join(outputDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
}

async function generateReadmeFile(apiInfo, resources, outputDir, verbose) {
  if (verbose) {
    console.log('Generating README.md file...');
  }

  // Try to find a good example resource (prefer user/users if available)
  let exampleResource = null;
  if (resources['user']) {
    exampleResource = resources['user'];
  } else if (resources['users']) {
    exampleResource = resources['users'];
  } else if (Object.keys(resources).length > 0) {
    // Fallback to first available resource
    exampleResource = resources[Object.keys(resources)[0]];
  }

  const exampleResourceName = exampleResource ? camelCase(exampleResource.name) : 'resourceName';

  // Simple README content
  const readmeContent = `# ${apiInfo.title} - JavaScript SDK

${apiInfo.description}

## Installation

\`\`\`bash
npm install ${camelCase(apiInfo.title)}-sdk
\`\`\`

## Basic Usage

\`\`\`javascript
import API from '${camelCase(apiInfo.title)}-sdk';

// Initialize the SDK
const api = new API({
  baseUrl: '${apiInfo.baseUrl}',
  auth: {
    token: 'your-auth-token'
    // Or use basic auth
    // username: 'user',
    // password: 'pass'
  }
});

// Examples using Waterline-like syntax
async function examples() {
  // Find all records
  const allRecords = await api.${exampleResourceName}.find().execute();

  // Find with criteria
  const filteredRecords = await api.${exampleResourceName}
    .find({ field: 'value' })
    .execute();

  // Find with pagination and sorting
  const paginatedRecords = await api.${exampleResourceName}
    .find()
    .limit(10)
    .skip(20)
    .sort('createdAt DESC')
    .execute();

  // Find one by ID
  const record = await api.${exampleResourceName}.findOne(123);

  // Create a record
  const newRecord = await api.${exampleResourceName}.create({
    field1: 'value1',
    field2: 'value2'
  });

  // Update a record
  const updatedRecord = await api.${exampleResourceName}.update(123, {
    field1: 'updated value'
  });

  // Delete a record
  await api.${exampleResourceName}.destroy(123);
}
\`\`\`

## Available Resources

${Object.keys(resources).map(name => `- \`${camelCase(name)}\``).join('\n')}

## SDK Version

\`${apiInfo.version}\`
`;

  await fs.writeFile(path.join(outputDir, 'README.md'), readmeContent);
}

async function copyTemplateFiles(outputDir, verbose) {
  if (verbose) {
    console.log('Copying template files...');
  }

  const utilsDir = path.join(outputDir, 'utils');
  await fs.mkdir(utilsDir, { recursive: true });

  // Copy utils files
  const queryUtils = await fs.readFile(path.join(__dirname, 'templates', 'utils', 'queryUtils.js'), 'utf8');
  await fs.writeFile(path.join(utilsDir, 'queryUtils.js'), queryUtils);
}