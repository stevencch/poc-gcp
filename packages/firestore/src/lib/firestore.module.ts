import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import firestoreConfig from './firestore.config';
import { FirestoreService } from './firestore.service';

@Module({
  imports: [ConfigModule.forFeature(firestoreConfig)],
  controllers: [],
  providers: [FirestoreService],
  exports: [FirestoreService],
})
export class FirestoreModule {}
