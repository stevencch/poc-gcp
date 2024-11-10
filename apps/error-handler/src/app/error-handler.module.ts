import { Module } from '@nestjs/common';
import { ErrorHandlerService } from './error-handler.service';
import { ErrorHandlerController } from './error-handler.controller';
import { ConfigModule } from '@nestjs/config';
import firestoreConfig from './firestore/firestore.config';
import { FirestoreService } from './firestore/firestore.service';

@Module({
  providers: [ErrorHandlerService, FirestoreService],
  controllers: [ErrorHandlerController],
  imports: [
    ConfigModule.forRoot({
      load: [firestoreConfig],
    }),
  ],
})
export class ErrorHandlerModule {}
