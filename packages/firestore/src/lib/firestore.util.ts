import { DocumentData, QueryDocumentSnapshot } from '@google-cloud/firestore';

export function Converter<T extends DocumentData>() {
  return {
    toFirestore(item: T): DocumentData {
      return item;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): T {
      // @todo - as we're casting here, we're assuming the data from Firestore aligns to the provided type
      //         'best practice' would be to ensure all properties are present and the correct type, but unsure if we want the overhead
      return snapshot.data() as T;
    },
  };
}
