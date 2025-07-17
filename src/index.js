#!/usr/bin/env node

import { parseArgs } from 'node:util';
import SwaggerParser from '@apidevtools/swagger-parser';
import { generateSdk } from './generator.js';

async function main() {
  try {
    const { positionals, values } = parseArgs({
      options: {
        verbose: { type: 'boolean', short: 'v' },
        strategy: { type: 'string', default: 'hierarchical' }
      },
      allowPositionals: true
    });

    const swaggerFile = positionals[0] || './swagger.json';
    const outputDir = positionals[1] || './sdk';
    const version = positionals[2] || '1.0.0';
    const { verbose, strategy } = values;

    if (verbose) {
      console.log(`Parsing OpenAPI specification from ${swaggerFile}`);
      console.log(`Output directory: ${outputDir}`);
      console.log(`SDK Version: ${version}`);
      console.log(`Resource strategy: ${strategy}`);
    }

    // Parse the OpenAPI specification
    const api = await SwaggerParser.parse(swaggerFile);
    const apiWithRefs = await SwaggerParser.resolve(swaggerFile);

    // Generate the SDK
    await generateSdk(api, apiWithRefs, outputDir, version, verbose, strategy);

    console.log(`✅ SDK successfully generated in ${outputDir}`);
  } catch (error) {
    console.error('Error generating SDK:', error);
    process.exit(1);
  }
}

main();
