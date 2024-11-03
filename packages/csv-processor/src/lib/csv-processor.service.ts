import { Injectable } from '@nestjs/common';
import { Readable } from 'node:stream';
import * as readline from 'node:readline';
import { EventEmitter } from 'node:events';

@Injectable()
export class CsvProcessorService {
  readStream(stream: Readable): EventEmitter {
    let isFirstLine = true;
    const emitter = new EventEmitter();

    const rl = readline.createInterface({
      input: stream,
    });

    rl.on('line', (line) => {
      if (isFirstLine) {
        isFirstLine = false;
        return;
      }

      const data = line.split(',');
      emitter.emit('line', data);
    });

    rl.once('close', () => {
      emitter.emit('finish');
    });

    rl.on('error', (error) => {
      emitter.emit('error', error);
    });

    return emitter;
  }
}
