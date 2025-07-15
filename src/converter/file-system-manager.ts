import * as fs from 'fs';
import {
  TEMP_FILE_EXTENSION,
  SQL_FILE_EXTENSION,
  ERROR_FILE_EXTENSION,
} from '../constants/nem12-converter.constants';
import { ConversionContext, ConversionInput } from './conversion-context';

export class FileSystemManager {
  createContext(input: ConversionInput): ConversionContext {
    const { inputPath, outputPath } = input;
    return {
      inputPath,
      outputPath,
      tempPath: `${outputPath}${TEMP_FILE_EXTENSION}`,
      errorPath: `${outputPath}${ERROR_FILE_EXTENSION}`,
      sqlStream: null,
      errorStream: null,
    };
  }

  async removeFile(path: string): Promise<void> {
    try {
      await fs.promises.unlink(path);
    } catch (error) {
      // Ignore if file does not exist
    }
  }

  async moveToFinal(context: ConversionContext): Promise<void> {
    await fs.promises.rename(
      context.tempPath,
      `${context.outputPath}${SQL_FILE_EXTENSION}`
    );
  }

  async cleanupOnError(
    context: ConversionContext,
    hasErrors: boolean
  ): Promise<void> {
    await this.removeFile(context.tempPath);

    if (!hasErrors) {
      await this.removeFile(context.errorPath);
    }
  }

  async cleanupOnSuccess(
    context: ConversionContext,
    hasErrors: boolean
  ): Promise<void> {
    if (!hasErrors) {
      await this.removeFile(context.errorPath);
    }
  }

  getFinalOutputPath(context: ConversionContext): string {
    return `${context.outputPath}${SQL_FILE_EXTENSION}`;
  }
}
