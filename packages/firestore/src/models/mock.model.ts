import { DocumentData } from '@google-cloud/firestore';

export interface MockDocument extends DocumentData {
  key: string;
  name?: string;
}
