import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PubSub } from '@google-cloud/pubsub';
import { PubSubReceivedMessage } from './pubsub.interface';
import { PubSubService } from './pubsub.service'

jest.mock('@google-cloud/pubsub');

describe('PubSubService', () => {
  let service: PubSubService;
  let mockClient: jest.Mocked<PubSub>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PubSubService],
    }).compile();

    service = module.get<PubSubService>(PubSubService);
    mockClient = new PubSub() as jest.Mocked<PubSub>;
    service['client'] = mockClient;
  });

  it('should be defined', () => {
    // Arrange, Act, Assert
    expect(service).toBeDefined();
    expect(service['client']).toBeInstanceOf(PubSub);
  });

  describe('extractPubSubMessage', () => {
    it('should extract message property from Pub/Sub message', () => {
      // Arrange
      const body: PubSubReceivedMessage = {
        message: {
          attributes: {},
          data: 'Hello, World!',
          messageId: '12937123',
          message_id: '12937123',
          publishTime: '2024-07-06T05:53:24.708Z',
          publish_time: '2024-07-06T05:53:24.708Z',
        },
        subscription: 'my-subscription',
      };

      // Act
      const message = service.extractPubSubMessage(body);

      // Assert
      expect(message).toBe(body.message);
    });

    it('should throw error if Pub/Sub message does not contain a message property', () => {
      // Arrange
      const body = {
        subscription: 'my-subscription',
      };

      // Act & Assert
      // @ts-expect-error intentionally providing an invalid body
      expect(() => service.extractPubSubMessage(body)).toThrow(
        new HttpException(`Invalid GCP Pub/Sub body/message format: ${JSON.stringify(body)}`, HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('publishMessage', () => {
    const topicId = 'test-topic';
    const data = Buffer.from('test-data');
    const attributes = { key: 'value' };

    it('should publish a message successfully', async () => {
      // Arrange
      const mockTopic = {
        publishMessage: jest.fn().mockResolvedValue('messageId'),
      };
      mockClient.topic.mockReturnValue(mockTopic as never);

      // Act & Assert
      await expect(service.publishMessage(topicId, data, attributes)).resolves.not.toThrow();
      expect(mockClient.topic).toHaveBeenCalledWith(topicId);
      expect(mockTopic.publishMessage).toHaveBeenCalledWith({
        data,
        attributes,
      });
    });

    it('should log the error if publishing fails', async () => {
      // Arrange
      const loggerSpy = jest.spyOn(service['logger'], 'error');
      const error = new Error('Publishing failed');
      const mockTopic = {
        publishMessage: jest.fn().mockRejectedValue(error),
      };
      mockClient.topic.mockReturnValue(mockTopic as never);

      // Act & Assert
      await expect(service.publishMessage(topicId, data, attributes)).rejects.toThrow(Error);
      expect(loggerSpy).toHaveBeenCalledWith(error);
    });
  });

  describe('constructPublishUrl', () => {
    it('should construct a pubsub url with provided parameters', () => {
      const projectId = 'my-project';
      const topicId = 'my-topic';

      const url = service.constructPublishUrl(projectId, topicId);

      expect(url).toBe(`https://pubsub.googleapis.com/v1/projects/${projectId}/topics/${topicId}:publish`);
    });
  });
});
