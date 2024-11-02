import { Test, TestingModule } from '@nestjs/testing';
import {
  CollectionReference,
  Filter,
  Transaction,
} from '@google-cloud/firestore';
import { CollectionEnum, FirestoreService } from './firestore.service';
import { ConfigModule } from '@nestjs/config';
import firestoreConfig from './firestore.config';
import { MockDocument } from '../models';

const originalEnv = process.env;

describe('FirestoreService', () => {
  let service: FirestoreService;

  const mockDocRef = {
    set: jest.fn(),
    get: jest.fn().mockResolvedValue({ exists: false }),
    delete: jest.fn(),
    update: jest.fn(),
  };

  const mockCollection = {
    withConverter: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    get: jest.fn(),
    doc: jest.fn().mockReturnValue(mockDocRef),
    orderBy: jest.fn().mockReturnThis(),
  };

  const mockTransaction = {
    update: jest.fn(),
    set: jest.fn(),
  };

  const mockEnv = {
    PROJECT_ID: 'test-project-id',
    DATABASE_ID: 'test-database-id',
  };

  beforeEach(async () => {
    process.env = {
      ...originalEnv,
      ...mockEnv,
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(firestoreConfig)],
      providers: [FirestoreService],
    }).compile();

    service = module.get<FirestoreService>(FirestoreService);
    await service.onModuleInit();
    jest
      .spyOn(service['logger'], 'verbose')
      .mockImplementation(() => undefined);
    jest.spyOn(service['logger'], 'error').mockImplementation();
    jest
      .spyOn(service['db'], 'collection')
      .mockReturnValue(mockCollection as unknown as CollectionReference);
    jest
      .spyOn(service['db'], 'runTransaction')
      .mockImplementation(async (callback) => {
        await callback(mockTransaction as unknown as Transaction); // Pass mock transaction
        return;
      });
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should retrieve a document from a collection', async () => {
    const mockDocument: MockDocument = {
      key: 'test_key',
    };
    const mockDocSnapshot = {
      exists: true,
      data: jest.fn().mockReturnValue(mockDocument),
    };
    mockDocRef.get.mockReturnValue(mockDocSnapshot);

    const result = await service.getDocument(
      CollectionEnum.MOCK,
      mockDocument.key
    );

    expect(mockCollection.doc).toHaveBeenCalledWith(mockDocument.key);
    expect(mockDocRef.get).toHaveBeenCalled();
    expect(mockDocSnapshot.data).toHaveBeenCalled();
    expect(result).toBe(mockDocument);
  });

  it('should throw if error while retrieving a document', async () => {
    const mockDocument: MockDocument = {
      key: 'test_key',
    };
    mockDocRef.get.mockImplementation(() => {
      throw new Error('Error');
    });

    await expect(
      service.getDocument(CollectionEnum.MOCK, mockDocument.key)
    ).rejects.toThrow();
  });

  it('should retrieve documents from a collection', async () => {
    const mockDocument1 = {
      documentId: 'test_key1',
      key: 'test_key1',
      name: 'foo',
    };
    const mockDocumentSnapshot1 = {
      exists: true,
      data: jest.fn().mockReturnValue(mockDocument1),
      id: 'test_key1',
    };
    const mockDocument2 = {
      documentId: 'test_key2',
      key: 'test_key2',
      name: 'foo',
    };
    const mockDocumentSnapshot2 = {
      exists: true,
      data: jest.fn().mockReturnValue(mockDocument2),
      id: 'test_key2',
    };
    mockCollection.get.mockReturnValue([
      mockDocumentSnapshot1,
      mockDocumentSnapshot2,
    ]);

    const filter = Filter.where('name', '==', 'foo');

    const result = await service.queryDocuments(
      CollectionEnum.MOCK,
      filter,
      'key',
      'asc',
      2
    );

    expect(mockCollection.where).toHaveBeenCalledWith(filter);
    expect(mockCollection.orderBy).toHaveBeenCalledWith('key', 'asc');
    expect(mockCollection.limit).toHaveBeenCalledWith(2);
    expect(mockCollection.get).toHaveBeenCalled();
    expect(mockDocumentSnapshot1.data).toHaveBeenCalled();
    expect(mockDocumentSnapshot2.data).toHaveBeenCalled();
    expect(result).toEqual([mockDocument1, mockDocument2]);
  });

  it('should throw if error while retrieving documents', async () => {
    const mockDocument1 = {
      key: 'test_key1',
      name: 'foo',
    };
    const mockDocumentSnapshot1 = {
      exists: true,
      data: jest.fn().mockReturnValue(mockDocument1),
    };
    const mockDocument2 = {
      key: 'test_key2',
      name: 'foo',
    };
    const mockDocumentSnapshot2 = {
      exists: true,
      data: jest.fn().mockImplementation(() => {
        throw new Error('Error');
      }),
    };
    mockCollection.get.mockReturnValue([
      mockDocumentSnapshot1,
      mockDocumentSnapshot2,
    ]);

    const filter = Filter.where('name', '==', 'foo');

    await expect(
      service.queryDocuments(CollectionEnum.MOCK, filter, 'key', 'asc', 2)
    ).rejects.toThrow();

    expect(mockCollection.where).toHaveBeenCalledWith(filter);
    expect(mockCollection.orderBy).toHaveBeenCalledWith('key', 'asc');
    expect(mockCollection.limit).toHaveBeenCalledWith(2);
    expect(mockCollection.get).toHaveBeenCalled();
    expect(mockDocumentSnapshot1.data).toHaveBeenCalled();
  });

  it('should insert a document into a collection', async () => {
    const mockDocument: MockDocument = {
      key: 'test_key',
    };

    await service.insertDocument(
      CollectionEnum.MOCK,
      mockDocument,
      mockDocument.key
    );

    expect(mockCollection.doc).toHaveBeenCalledWith(mockDocument.key);
    expect(mockDocRef.set).toHaveBeenCalledWith(mockDocument);
  });

  it('should insert a document into a collection with transaction', async () => {
    const mockDocument: MockDocument = {
      key: 'test_key',
    };

    await service.insertDocument(
      CollectionEnum.MOCK,
      mockDocument,
      mockDocument.key,
      mockTransaction as unknown as Transaction
    );

    expect(mockCollection.doc).toHaveBeenCalledWith(mockDocument.key);
    expect(mockTransaction.set).toHaveBeenCalledWith(mockDocRef, mockDocument);
  });

  it('should throw if error while inserting a document', async () => {
    const mockDocument: MockDocument = {
      key: 'test_key',
    };
    mockDocRef.set.mockImplementation(() => {
      throw new Error('Error');
    });

    await expect(
      service.insertDocument(
        CollectionEnum.MOCK,
        mockDocument,
        mockDocument.key
      )
    ).rejects.toThrow();
  });

  it('should delete a document from a collection', async () => {
    const key = 'test_key';

    await service.deleteDocument(CollectionEnum.MOCK, key);

    expect(mockCollection.doc).toHaveBeenCalledWith(key);
    expect(mockDocRef.delete).toHaveBeenCalled();
  });

  it('should throw if error while deleting a document', async () => {
    const key = 'test_key';
    mockDocRef.delete.mockImplementation(() => {
      throw new Error('Error');
    });

    await expect(
      service.deleteDocument(CollectionEnum.MOCK, key)
    ).rejects.toThrow();
  });

  it('should update a document into a collection', async () => {
    const mockDocument: MockDocument = {
      key: 'test_key',
    };

    await service.updateDocument(
      CollectionEnum.MOCK,
      mockDocument,
      mockDocument.key
    );

    expect(mockCollection.doc).toHaveBeenCalledWith(mockDocument.key);
    expect(mockDocRef.update).toHaveBeenCalledWith(mockDocument);
  });

  it('should update a document into a collection with tranasction', async () => {
    const mockDocument: MockDocument = {
      key: 'test_key',
    };

    await service.updateDocument(
      CollectionEnum.MOCK,
      mockDocument,
      mockDocument.key,
      mockTransaction as unknown as Transaction
    );

    expect(mockCollection.doc).toHaveBeenCalledWith(mockDocument.key);
    expect(mockTransaction.update).toHaveBeenCalledWith(
      mockDocRef,
      mockDocument
    );
  });

  it('should throw if error while udpating a document', async () => {
    const mockDocument: MockDocument = {
      key: 'test_key',
    };
    mockDocRef.update.mockImplementation(() => {
      throw new Error('Error');
    });

    await expect(
      service.updateDocument(
        CollectionEnum.MOCK,
        mockDocument,
        mockDocument.key
      )
    ).rejects.toThrow();
  });

  it('should runTransaction succesfully', async () => {
    const mockCallback = jest.fn();
    await service.runTransaction(mockCallback);
    expect(mockCallback).toHaveBeenCalledWith(mockTransaction);
  });

  it('should throw if runTransaction fails', async () => {
    const mockCallback = jest.fn().mockImplementationOnce(() => {
      throw new Error('Error');
    });

    await expect(service.runTransaction(mockCallback)).rejects.toThrow();
    expect(mockCallback).toHaveBeenCalledWith(mockTransaction);
  });
});
