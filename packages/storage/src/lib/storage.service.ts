import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { Readable } from 'stream';

@Injectable()
export class StorageService {
  private readonly storage: Storage;
  private readonly logger = new Logger(StorageService.name);

  constructor() {
    this.storage = new Storage({
      projectId: process.env['PROJECT_ID'],
    });
  }

  public getFileStream(bucketName: string, filePath: string): Readable {
    try {
      const bucket = this.storage.bucket(bucketName);
      const file = bucket.file(filePath);

      return file.createReadStream();
    } catch (error) {
      let message;

      if (error instanceof Error) {
        message = error.message;
      }

      this.logger.error(error);

      throw new InternalServerErrorException(
        'Failed to read file from Google Cloud Storage.',
        { cause: error, description: message }
      );
    }
  }
}
