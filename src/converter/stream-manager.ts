import * as fs from 'fs';
import { ConversionContext } from './conversion-context';

export class StreamManager {
  async createStreams(context: ConversionContext): Promise<void> {
    context.sqlStream = fs.createWriteStream(context.tempPath);
    context.errorStream = fs.createWriteStream(context.errorPath);
  }

  async closeStreams(context: ConversionContext): Promise<void> {
    if (context.sqlStream) {
      context.sqlStream.end();
      await this.waitForStreamClose(context.sqlStream);
    }
  }

  async destroyStreams(context: ConversionContext): Promise<void> {
    if (context.sqlStream && !context.sqlStream.destroyed) {
      context.sqlStream.destroy();
    }
    if (context.errorStream && !context.errorStream.destroyed) {
      context.errorStream.destroy();
    }
  }

  private waitForStreamClose(stream: fs.WriteStream): Promise<void> {
    return new Promise((resolve, reject) => {
      stream.on('close', resolve);
      stream.on('error', reject);
    });
  }
}
