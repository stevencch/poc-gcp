import { PubSubService, ErrorType } from '@catalogue-ms/common';
import { DeadLetterService } from './dead-letter.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import deadLetterConfig from './dead-letter.config';

describe('DeadLetterService', () => {
  let service: DeadLetterService;

  const mockPublishMessage = jest.fn();
  const mockError = {
    type: ErrorType.EXTRACTION,
    message: 'Payload extraction failed: test error',
  };
  const mockPayload = {
    message: {
      attributes: {
        'Content-Type': 'application/json',
      },
      data: 'CiUKATESATEaBXN0b3JlIAoqFDIwMjEtMDEtMDFUMDA6MDA6MDBa',
      messageId: '2070443601311540',
      message_id: '2070443601311540',
      publishTime: '2021-02-26T19:13:55.749Z',
      publish_time: '2021-02-26T19:13:55.749Z',
    },
    subscription: 'projects/myproject/subscriptions/test-subscription',
  };

  const mockDeadLetterData = Buffer.from(mockPayload.message.data, 'base64');
  const mockDeadLetterAttributes = (type: ErrorType) => ({
    ...mockPayload.message.attributes,
    CloudPubSubDeadLetterSourceSubscription: 'test-subscription',
    errorType: type,
    errorMessage: expect.any(String),
    errorMessageId: expect.any(String),
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeadLetterService,
        {
          provide: PubSubService,
          useValue: {
            publishMessage: mockPublishMessage,
          },
        },
      ],
      imports: [ConfigModule.forFeature(deadLetterConfig)],
    }).compile();

    service = module.get<DeadLetterService>(DeadLetterService);
    jest.spyOn(service['logger'], 'error').mockImplementation();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('publishToDeadLetter', () => {
    it('Should publish to deadletter', async () => {
      await service.publishToDeadLetter(mockError, mockPayload);
      expect(mockPublishMessage).toHaveBeenCalledWith(
        process.env['DEAD_LETTER_TOPIC'],
        mockDeadLetterData,
        mockDeadLetterAttributes(ErrorType.EXTRACTION)
      );
    });
  });
});
