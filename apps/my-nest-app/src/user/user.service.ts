import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MssqlService } from '@poc-gcp/mssql';
import { PubSubService } from '@poc-gcp/pubsub';
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly mssqlService: MssqlService,
    private readonly pubSubService: PubSubService
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
}
