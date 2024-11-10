import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CollectionReference } from '@google-cloud/firestore';
import { FirestoreService } from './firestore.service';
import firestoreConfig from './firestore.config';
import { DeadLetterAttributes, Message } from '@cwr-gcp-common/common';

const originalEnv = process.env;

describe('FirestoreService', () => {
  let service: FirestoreService;

  const mockCollection = {
    add: jest.fn(),
  };

  const mockEnv = {
    PROJECT_ID: 'test-project-id',
    DATABASE_ID: 'test-database-id',
    EXPIRY_DURATION_DAYS: '30',
  };

  beforeEach(async () => {
    jest.clearAllMocks();
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
    jest.spyOn(service['logger'], 'error').mockImplementation(() => undefined);
    jest
      .spyOn(service['db'], 'collection')
      .mockReturnValue(mockCollection as unknown as CollectionReference);
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should insert new document to the dead-letters-messages collection', async () => {
    const mockMessage: Message<DeadLetterAttributes> = {
      attributes: {
        CloudPubSubDeadLetterSourceSubscription: 'test-subscription',
      },
      data: 'test',
      messageId: '11326228644557228',
      message_id: '11326228644557228',
      publishTime: '2024-05-22T00:00:38.082Z',
      publish_time: '2024-05-22T00:00:38.082Z',
    };
    const mockDocument = {
      message_id: mockMessage.messageId,
      source_subscription_id:
        mockMessage.attributes.CloudPubSubDeadLetterSourceSubscription,
      message: mockMessage,
      created: expect.any(Object),
      expire_at: expect.any(Object),
    };
    await service.insertDeadLetterMessage(mockMessage);
    expect(mockCollection.add).toHaveBeenCalledWith(mockDocument);
  });

  it('should throw error when failing to create document', async () => {
    const mockMessage: Message<DeadLetterAttributes> = {
      attributes: {
        CloudPubSubDeadLetterSourceSubscription: 'test-subscription',
      },
      data: 'test',
      messageId: '11326228644557228',
      message_id: '11326228644557228',
      publishTime: '2024-05-22T00:00:38.082Z',
      publish_time: '2024-05-22T00:00:38.082Z',
    };
    mockCollection.add.mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    await expect(
      service.insertDeadLetterMessage(mockMessage)
    ).rejects.toThrow();
  });
});
