import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PubSubMessage, PubSubReceivedMessage } from './dto/pubsub.interface';
import { NotificationEventType, PaymentNotification } from './dto/payment.notification';
import { CommercetoolsService } from '@poc-gcp/commercetools';
import { OrderResult } from './dto/orderResult';

import { CwStore } from './payment.interface';
import { DatabaseService } from 'packages/database/src/lib/database.service';
@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(
    private readonly commerceoolsService: CommercetoolsService,
    private readonly databaseService: DatabaseService
  ) { }
  create(createPaymentDto: CreatePaymentDto) {
    return 'This action adds a new payment';
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }

  async getOrder(orderNumber: string): Promise<OrderResult> {
    try {
      const order = await this.commerceoolsService.getOrderByOrderNumber(orderNumber);
      return {
        order, 
        orderExists: !!order  // true if order exists, false if it's null
      };
    } catch (error) {
      throw new HttpException(error.response?.data || `Error retrieving order details:${error.message}`, error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async selectStoreById(id: string): Promise<CwStore[]> {
    this.logger.debug(`Retrieving selectStores `);

    const sqlStatement = `
    SELECT
        id,
        store_name
    FROM
        store.stores
    WHERE
        id=?
    `;
    return await this.databaseService.select<CwStore>(sqlStatement, [
      id,
    ]);
  }

}
