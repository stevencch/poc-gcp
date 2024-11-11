import { Message, DeadLetterAttributes } from '@poc-gcp/common';
import { Injectable, Logger } from '@nestjs/common';
import { FirestoreService } from './firestore/firestore.service';

@Injectable()
export class ErrorHandlerService {
  private readonly logger = new Logger(ErrorHandlerService.name);

  constructor(private readonly firestoreService: FirestoreService) {}

  async process(message: Message<DeadLetterAttributes>): Promise<void> {
    this.logger.log('Processing started!');
    await this.firestoreService.insertDeadLetterMessage(message);
    this.logger.log('Processing finished');
  }
}
