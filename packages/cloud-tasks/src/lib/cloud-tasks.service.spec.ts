import { Test, TestingModule } from '@nestjs/testing';
import { CloudTasksService } from './cloud-tasks.service';
import { ConfigModule } from '@nestjs/config';
import cloudTasksConfig from './cloud-tasks.config';

const originalEnv = process.env;

describe('CloudTasksService', () => {
  let service: CloudTasksService;

  const mockEnv = {
    PROJECT_ID: 'mockProject',
    LOCATION_ID: 'mockLocation',
    SERVICE_ACCOUNT_EMAIL: 'mockServiceAccountEmail',
  };

  beforeEach(async () => {
    process.env = {
      ...originalEnv,
      ...mockEnv,
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudTasksService],
      imports: [ConfigModule.forFeature(cloudTasksConfig)],
    }).compile();

    service = module.get<CloudTasksService>(CloudTasksService);
    service.onModuleInit();

    jest.spyOn(service['logger'], 'error').mockImplementation(() => undefined);
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should correctly call the CloudTasksClient methods', async () => {
    const mockQueueName = 'task-queue';
    const mockTarget = 'http://example.com';
    const mockBody = { test: 'test' };
    const mockQueuePath =
      'projects/mockProject/locations/mockLocation/queues/task-queue';
    const mockTaskName =
      'projects/projectId/locations/location/queues/task-queue/tasks/task-name';

    const queuePathSpy = jest
      .spyOn(service['cloudTasksClient'], 'queuePath')
      .mockReturnValue(mockQueuePath);
    const createTaskSpy = jest
      .spyOn(service['cloudTasksClient'], 'createTask')
      .mockImplementation(async () => {
        return [{ name: mockTaskName }];
      });

    const task = await service.publishTask(mockQueueName, mockTarget, mockBody);

    expect(queuePathSpy).toHaveBeenCalledWith(
      mockEnv.PROJECT_ID,
      mockEnv.LOCATION_ID,
      mockQueueName
    );
    expect(createTaskSpy.mock.calls[0][0]).toHaveProperty(
      'task.httpRequest.url',
      mockTarget
    );
    expect(createTaskSpy.mock.calls[0][0]).toHaveProperty(
      'task.httpRequest.oauthToken.serviceAccountEmail',
      mockEnv.SERVICE_ACCOUNT_EMAIL
    );
    expect(createTaskSpy.mock.calls[0][0]).toHaveProperty(
      'task.httpRequest.body',
      Buffer.from(JSON.stringify(mockBody)).toString('base64')
    );
    expect(createTaskSpy.mock.calls[0][0]).toHaveProperty(
      'parent',
      mockQueuePath
    );
    expect(task).toEqual(mockTaskName);
  });

  it('should throw an error when the task response does not contain a name', async () => {
    jest.spyOn(service['cloudTasksClient'], 'queuePath').mockReturnValue('');
    jest
      .spyOn(service['cloudTasksClient'], 'createTask')
      .mockImplementation(async () => {
        return [{ name: undefined }];
      });

    await expect(service.publishTask('', '', {})).rejects.toThrow(
      'No name in task response'
    );
  });

  it('should throw an error when the task creation fails', async () => {
    jest.spyOn(service['cloudTasksClient'], 'queuePath').mockReturnValue('');
    jest
      .spyOn(service['cloudTasksClient'], 'createTask')
      .mockImplementation(() =>
        Promise.reject(new Error('Task creation failed'))
      );

    await expect(service.publishTask('', '', {})).rejects.toThrow(
      'Task creation failed'
    );
  });
});
