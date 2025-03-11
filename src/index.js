#!/usr/bin/env node

import { parseArgs } from 'node:util';
import SwaggerParser from '@apidevtools/swagger-parser';
import { generateSdk } from './generator.js';

async function main() {
  try {
    const { positionals, values } = parseArgs({
      options: {
        verbose: { type: 'boolean', short: 'v' }
      },
      allowPositionals: true
    });

    if (positionals.length < 3) {
      console.error('Usage: node src/index.js <swagger-file> <output-dir> <version> [--verbose]');
      process.exit(1);
    }

    const [swaggerFile, outputDir, version] = positionals;
    const verbose = values.verbose || false;

    if (verbose) {
      console.log(`Parsing OpenAPI specification from ${swaggerFile}`);
      console.log(`Output directory: ${outputDir}`);
      console.log(`SDK Version: ${version}`);
    }

    // Parse the OpenAPI specification
    const api = await SwaggerParser.parse(swaggerFile);
    const apiWithRefs = await SwaggerParser.resolve(swaggerFile);

    // Generate the SDK
    await generateSdk(api, apiWithRefs, outputDir, version, verbose);

    console.log(`✅ SDK successfully generated in ${outputDir}`);
  } catch (error) {
    console.error('Error generating SDK:', error);
    process.exit(1);
  }
}

main();