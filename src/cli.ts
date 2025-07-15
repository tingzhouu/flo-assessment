#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import { createNEM12Converter } from './converter/nem12-converter-factory';
import { ERROR_FILE_EXTENSION } from './constants/nem12-converter.constants';
import {
  HeaderRecordIndex,
  RecordType,
} from './constants/nem12-parser.constants';
import * as readline from 'readline';

const program = new Command();

program
  .name('nem12-converter')
  .description('Convert NEM12 format meter reading files to SQL')
  .version('1.0.0');

program
  .command('convert')
  .description('Convert a NEM12 file to SQL format')
  .argument('<input>', 'Input NEM12 file path')
  .argument(
    '[output]',
    'Output file path (without extension) - defaults to input filename'
  )
  .option('-v, --verbose', 'Enable verbose output')
  .action(
    async (inputPath: string, outputPath: string | undefined, options) => {
      try {
        await convertFile(inputPath, outputPath, options);
      } catch (error) {
        console.error(chalk.red('❌ Conversion failed:'), error.message);
        process.exit(1);
      }
    }
  );

program
  .command('info')
  .description('Display information about a NEM12 file')
  .argument('<input>', 'Input NEM12 file path')
  .action(async (inputPath: string) => {
    try {
      await displayFileInfo(inputPath);
    } catch (error) {
      console.error(chalk.red('❌ Failed to read file info:'), error.message);
      process.exit(1);
    }
  });

async function convertFile(
  inputPath: string,
  outputPath: string | undefined,
  options: any
): Promise<void> {
  await validateInputFile(inputPath);

  // Generate default output path if not provided
  if (!outputPath) {
    const inputDir = path.dirname(inputPath);
    const inputBase = path.basename(inputPath, path.extname(inputPath));
    outputPath = path.join(inputDir, inputBase);

    if (options.verbose) {
      console.log(chalk.yellow(`📁 No output specified, using: ${outputPath}`));
    }
  }

  await validateOutputPath(outputPath);

  if (options.verbose) {
    console.log(chalk.blue('📝 Starting conversion...'));
    console.log(chalk.gray(`   Input:  ${inputPath}`));
    console.log(chalk.gray(`   Output: ${outputPath}.sql`));
  }

  const startTime = Date.now();

  try {
    const converter = createNEM12Converter();

    if (options.verbose) {
      console.log(chalk.blue('⚡ Converting file...'));
    }

    await converter.convertFile({
      inputPath,
      outputPath,
    });

    const duration = Date.now() - startTime;

    if (options.verbose) {
      console.log(chalk.green(`⏱️  Conversion completed in ${duration}ms`));
    }

    const errorFilePath = `${outputPath}${ERROR_FILE_EXTENSION}`;
    const hasErrors = await fileExists(errorFilePath);

    if (hasErrors) {
      console.log(
        chalk.yellow('⚠️  Conversion completed with warnings/errors')
      );
      console.log(chalk.gray(`   Check error file: ${errorFilePath}`));
    } else {
      console.log(chalk.green('✅ Conversion completed successfully'));
    }

    console.log(chalk.gray(`   SQL output: ${outputPath}.sql`));
  } catch (error) {
    throw new Error(`Conversion failed: ${error.message}`);
  }
}

async function displayFileInfo(inputPath: string): Promise<void> {
  await validateInputFile(inputPath);

  console.log(chalk.blue(`📊 File Information: ${path.basename(inputPath)}`));
  console.log(chalk.gray('─'.repeat(50)));

  try {
    const stats = await fs.promises.stat(inputPath);
    console.log(chalk.white(`File Size: ${formatBytes(stats.size)}`));
    console.log(chalk.white(`Modified:  ${stats.mtime.toISOString()}`));

    const { nem12FileCreatedAt, nem12Version, lineCount } =
      await analyzeFileStructure(inputPath);

    console.log(chalk.white(`Version:    ${nem12Version}`));
    console.log(chalk.white(`File Created At:   ${nem12FileCreatedAt}`));
    console.log(chalk.white(`Lines:     ${lineCount}`));
  } catch (error) {
    throw new Error(`Failed to read file information: ${error.message}`);
  }
}

async function analyzeFileStructure(filePath: string): Promise<{
  nem12FileCreatedAt: string;
  nem12Version: string;
  lineCount: number;
}> {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let nem12FileCreatedAt = 'Unknown';
    let nem12Version = 'Unknown';
    let lineCount = 0;
    let isFirstLine = true;

    rl.on('line', (line) => {
      lineCount++;

      // Check first line only - NEM12 files must start with header record (100)
      if (isFirstLine) {
        isFirstLine = false;
        if (line.trim().startsWith(RecordType.HEADER)) {
          const fields = line.split(',');
          if (fields.length >= 3) {
            nem12Version = fields[HeaderRecordIndex.VERSION] || 'Unknown';
            nem12FileCreatedAt =
              fields[HeaderRecordIndex.DATE_TIME] || 'Unknown';
          }
        }
      }
    });

    rl.on('close', () => {
      resolve({ nem12FileCreatedAt, nem12Version, lineCount });
    });

    rl.on('error', (error) => {
      reject(error);
    });
  });
}

async function validateInputFile(filePath: string): Promise<void> {
  try {
    await fs.promises.access(filePath, fs.constants.R_OK);
  } catch {
    throw new Error(`Input file not found or not readable: ${filePath}`);
  }

  const stats = await fs.promises.stat(filePath);
  if (!stats.isFile()) {
    throw new Error(`Input path is not a file: ${filePath}`);
  }

  if (stats.size === 0) {
    throw new Error(`Input file is empty: ${filePath}`);
  }
}

async function validateOutputPath(outputPath: string): Promise<void> {
  const outputDir = path.dirname(outputPath);

  try {
    await fs.promises.access(outputDir, fs.constants.W_OK);
  } catch {
    throw new Error(`Output directory not writable: ${outputDir}`);
  }

  const sqlPath = `${outputPath}.sql`;
  if (await fileExists(sqlPath)) {
    console.log(
      chalk.yellow(`⚠️  Output file will be overwritten: ${sqlPath}`)
    );
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

process.on('unhandledRejection', (error: any) => {
  console.error(chalk.red('❌ Unexpected error:'), error.message);
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  console.error(chalk.red('❌ Unexpected error:'), error.message);
  process.exit(1);
});

program.parse();
