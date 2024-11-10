import { Test, TestingModule } from '@nestjs/testing';
import { ErrorHandlerService } from './error-handler.service';
import { FirestoreService } from './firestore/firestore.service';
import { DeadLetterAttributes, Message } from '@cwr-gcp-common/common';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;
  const mockInsertDeadLetterMessage = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ErrorHandlerService,
        {
          provide: FirestoreService,
          useValue: { insertDeadLetterMessage: mockInsertDeadLetterMessage },
        },
      ],
    }).compile();

    service = module.get<ErrorHandlerService>(ErrorHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call insertDeadLetterMessage', async () => {
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
    await service.process(mockMessage);
    expect(mockInsertDeadLetterMessage).toHaveBeenCalledWith(mockMessage);
  });
});
