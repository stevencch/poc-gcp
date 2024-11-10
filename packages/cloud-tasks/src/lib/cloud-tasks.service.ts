import { CloudTasksClient, protos } from '@google-cloud/tasks';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import cloudTasksConfig from './cloud-tasks.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class CloudTasksService implements OnModuleInit {
  private readonly logger = new Logger(CloudTasksService.name);

  private cloudTasksClient!: CloudTasksClient;

  constructor(
    @Inject(cloudTasksConfig.KEY)
    private readonly config: ConfigType<typeof cloudTasksConfig>
  ) {}

  onModuleInit() {
    this.cloudTasksClient = new CloudTasksClient();
  }

  async publishTask<T>(
    queueName: string,
    httpTarget: string,
    body: T
  ): Promise<string> {
    const { projectId, locationId, serviceAccountEmail } = this.config;
    
    try {
      const data=Buffer.from(JSON.stringify(body)).toString('base64');
      this.logger.log(`config: ${JSON.stringify(this.config)},data:${data}`);
      const parent = this.cloudTasksClient.queuePath(
        projectId,
        locationId,
        queueName
      );
      const task: protos.google.cloud.tasks.v2.ITask = {
        httpRequest: {
          headers: {
            'Content-Type': 'application/json',
          },
          httpMethod: 'POST',
          url: httpTarget,
          body: data,
          oauthToken: {
            serviceAccountEmail: serviceAccountEmail,
          },
        },
      };
      const request = { parent, task };
      const [response] = await this.cloudTasksClient.createTask(request);

      if (!response.name) {
        throw new Error('No name in task response');
      }

      return response.name;
    } catch (error) {
      this.logger.error('Failed to publish task', error);
      throw error;
    }
  }
}
