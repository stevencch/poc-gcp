import { Test } from '@nestjs/testing';
import request from 'supertest';
import { ErrorHandlerController } from './error-handler.controller';
import { ErrorHandlerService } from './error-handler.service';
import { HttpStatus, INestApplication } from '@nestjs/common';

const mockDeadLetterMessageBody = {
  message: {
    attributes: {
      CloudPubSubDeadLetterSourceSubscription: 'test-subscription',
    },
    data: 'VGVzdA==',
    messageId: '11326228644557228',
    message_id: '11326228644557228',
    publishTime: '2024-05-22T00:00:38.082Z',
    publish_time: '2024-05-22T00:00:38.082Z',
  },
  subscription: 'projects/test-project-id/subscriptions/test-dl-subscription',
};
const mockBadDeadLetterMessageBody = {
  message: {
    attributes: {},
    data: 'VGVzdA==',
    messageId: '11326228644557228',
    message_id: '11326228644557228',
    publishTime: '2024-05-22T00:00:38.082Z',
    publish_time: '2024-05-22T00:00:38.082Z',
  },
  subscription: 'projects/test-project-id/subscriptions/test-dl-subscription',
};
const mockProcessMessage = jest.fn();

describe('ErrorHandlerController', () => {
  let app: INestApplication;
  let controller: ErrorHandlerController;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [ErrorHandlerController],
      providers: [
        {
          provide: ErrorHandlerService,
          useValue: { process: mockProcessMessage },
        },
      ],
    }).compile();
    app = module.createNestApplication();
    controller = module.get<ErrorHandlerController>(ErrorHandlerController);
    await app.init();
    jest
      .spyOn(controller['logger'], 'error')
      .mockImplementation(() => undefined);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handle received message', () => {
    it('should return 200 when body is valid and process succeeds', async () => {
      await request(app.getHttpServer())
        .post('')
        .send(mockDeadLetterMessageBody)
        .expect(HttpStatus.OK);
      expect(mockProcessMessage).toHaveBeenCalledWith(
        mockDeadLetterMessageBody.message
      );
    });

    it('should return 400 when body is invalid', async () => {
      await request(app.getHttpServer())
        .post('')
        .send(mockBadDeadLetterMessageBody)
        .expect(HttpStatus.BAD_REQUEST);
      expect(mockProcessMessage).not.toHaveBeenCalled();
    });

    it('should return 500 when processing the message fails', async () => {
      mockProcessMessage.mockImplementationOnce(() => {
        throw new Error('Error');
      });
      await request(app.getHttpServer())
        .post('')
        .send(mockDeadLetterMessageBody)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockProcessMessage).toHaveBeenCalledWith(
        mockDeadLetterMessageBody.message
      );
    });
  });
});
