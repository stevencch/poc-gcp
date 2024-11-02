import { DocumentData, FieldPath, Filter, Firestore, OrderByDirection, Transaction } from '@google-cloud/firestore';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import firestoreConfig from './firestore.config';
import { ConfigType } from '@nestjs/config';
import { Converter } from './firestore.util';
import { isRunningLocally } from '@poc-gcp/vault';
export enum CollectionEnum {
    MOCK = 'mock',
    OUTBOX = 'outbox',
  }

@Injectable()
export class FirestoreService implements OnModuleInit {
  private readonly logger = new Logger(FirestoreService.name);
  private db!: Firestore;

  constructor(
    @Inject(firestoreConfig.KEY)
    private readonly config: ConfigType<typeof firestoreConfig>
  ) {}
  async onModuleInit() {
    
    if(isRunningLocally()){
        this.db = new Firestore({
            projectId: this.config.projectId,
            host:"localhost:8080",
            ssl: false
          });
    }
    else{
        return;
        this.db = new Firestore({
            projectId: this.config.projectId,
            databaseId: this.config.databaseId,
          });
    }
    
  }

  async getDocument<T extends DocumentData>(
    collection: CollectionEnum,
    docId: string
  ) {
    try {
      const docSnapshot = await this.db
        .collection(collection)
        .withConverter(Converter<T>())
        .doc(docId)
        .get();

      if (!docSnapshot.exists) {
        return undefined;
      }

      return docSnapshot.data();
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error while getting document: ${error.message}`);
      }
      throw error;
    }
  }
  async queryDocuments<T extends DocumentData>(
    collection: CollectionEnum,
    filter: Filter
  ): Promise<(T & { documentId: string })[]> {
    try {
      const collectionRef = this.db
        .collection(collection)
        .withConverter(Converter<T>());

      const query = collectionRef
        .where(filter);

      const snapshot = await query.get();
      const result: (T & { documentId: string })[] = [];

      snapshot.forEach((doc) => {
        result.push({
          ...doc.data(),
          documentId: doc.id,
        });
      });

      return result;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error while getting document: ${error.message}`);
      }
      throw error;
    }
  }
  async insertDocument<T extends DocumentData>(
    collection: CollectionEnum,
    document: T,
    documentPath?: string,
    transaction?: Transaction
  ) {
    try {
      const collectionRef = await this.db
        .collection(collection)
        .withConverter(Converter<T>());

      const docRef = documentPath
        ? collectionRef.doc(documentPath)
        : collectionRef.doc();
      if (transaction) {
        transaction.set(docRef, document);
      } else {
        await collectionRef.doc().set(document);
      }
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error while inserting document: ${error.message}`);
      }
      throw error;
    }
  }

  async deleteDocument<T extends DocumentData>(
    collection: CollectionEnum,
    documentPath: string
  ) {
    try {
      const collectionRef = this.db.collection(collection);
      await collectionRef.doc(documentPath).delete();
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error while deleting document: ${error.message}`);
      }
      throw error;
    }
  }

  async updateDocument<T extends DocumentData>(
    collection: CollectionEnum,
    document: T,
    documentPath: string,
    transaction?: Transaction
  ) {
    try {
      const collectionRef = this.db.collection(collection);
      const docRef = collectionRef.doc(documentPath);
      if (transaction) {
        transaction.update(docRef, document);
      } else {
        await docRef.update(document);
      }
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error while updating document: ${error.message}`);
      }
      throw error;
    }
  }

  async runTransaction<T>(
    operation: (transaction: Transaction) => Promise<T>
  ): Promise<T> {
    try {
      return await this.db.runTransaction(operation);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error while running transaction: ${error.message}`);
      }
      throw error;
    }
  }
}
