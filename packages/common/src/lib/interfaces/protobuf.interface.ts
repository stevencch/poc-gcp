import { google } from '@google-cloud/firestore/types/protos/firestore_v1beta1_proto_api';


export enum ProtobufSchemaKey {
  FirestoreData = 'FirestoreData'
}

export interface ProtobufMetadata {
  file: string;
  type: string;
}

export type FirestoreFields = google.firestore.v1beta1.IDocument['fields'];

export interface FirestoreData {
  value: google.firestore.v1beta1.IDocument;
}

export interface ProtobufSchemaType {
  [ProtobufSchemaKey.FirestoreData]: FirestoreData;
}
