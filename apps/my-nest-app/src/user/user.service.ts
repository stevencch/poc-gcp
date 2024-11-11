import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MssqlService } from '@poc-gcp/mssql';
import { PubSubService } from '@poc-gcp/pubsub';
import { CsvProcessorService } from '@poc-gcp/csv-processor';
import { StorageService } from '@poc-gcp/storage';
import { CloudTasksService } from '@poc-gcp/cloud-tasks';
import { ConfigType } from '@nestjs/config';
import userConfig from './user.config';
import { CloudEventService, CloudEventTypes, ProtobufKey, ProtobufService } from '@poc-gcp/common';
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly mssqlService: MssqlService,
    private readonly pubSubService: PubSubService,
    private readonly storageService: StorageService,
    private readonly csvProcessorService: CsvProcessorService,
    private readonly cloudTaskService: CloudTasksService,
    private readonly protobufService: ProtobufService,
    @Inject(userConfig.KEY)
    private readonly config: ConfigType<typeof userConfig>
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    const result = await this.mssqlService.getItems(
      'SELECT TOP 5 [UserName] FROM [CMS_User]'
    );
    return result;
  }

  async test1() {
    const data = {
      date: new Date().toISOString(),
    };
    this.logger.log(`publish: ${data.date}`);
    const dataBuffer = Buffer.from(JSON.stringify(data));
    const paymentModifyTopic = process.env.PAYMENT_NOTIFICATION_TOPIC || '';
    await this.pubSubService.publishMessage(paymentModifyTopic, dataBuffer);
    return 'ok';
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async readfile() {
    //await this.storageService.getAllBuckets();
    const inputBucket = process.env['INPUT_BUCKET'];
    const inputFile = process.env['INPUT_FILE'];
    const fileStream = this.storageService.getFileStream(
      inputBucket,
      inputFile
    );

    const publishPromises: Promise<string>[] = [];
    const processor = this.csvProcessorService.readStream(fileStream);

    let itemCount = 0;

    const processLine = (line: string[]) => {
      try {
        this.logger.log(`Finished processing file: "${line}"`);
        itemCount++;
      } catch (e) {
        const message = e instanceof Error ? e.message : e;
        this.logger.error(`Error while processing line: ${message}`);
      }
    };

    processor.on('line', processLine);

    const finalBatchNumber = await new Promise((resolve) => {
      processor.on('finish', async () => {
        this.logger.log(`Finished processing file: "${inputFile}"`);
        resolve(1);
      });
    });
    this.logger.log(
      `Created ${finalBatchNumber} tasks to process ${itemCount} items.`
    );
    return 'ok';
  }

  async testTask() {
    const {
      topicName,
      projectId,
      taskQueueName
    } = this.config;

    const publishUrl = this.pubSubService.constructPublishUrl(
      projectId,
      topicName
    );

    const importPayload={name:new Date().toISOString()}
    const cloudEvent = CloudEventService.createEvent(
      CloudEventTypes.OutboxEvent,
      '/poc-gcp/outbox',
      importPayload
    );

    const dataBuffers: Buffer[] = [];
    const dataBuffer = this.protobufService.encode(
      ProtobufKey.CloudEventMessage,
      cloudEvent
    );
    dataBuffers.push(dataBuffer);

    const name=await this.cloudTaskService.publishTask(
      taskQueueName,
      publishUrl,
      PubSubService.constructPublishBody(dataBuffers)
    );
    return name;
  }
  
}
