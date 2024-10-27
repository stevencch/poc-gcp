import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PubSubMessage, PubSubReceivedMessage } from './dto/pubsub.interface';
import { NotificationEventType, PaymentNotification } from './dto/payment.notification';

@Injectable()
export class PaymentService {
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

  extractPubSubMessage<T extends PubSubReceivedMessage>(body: T): T['message'] {
    if (!body?.message) {
      throw new HttpException(
        `Invalid GCP Pub/Sub body/message format: ${JSON.stringify(body)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return body.message;
  }

  async processOrderMessage(message: PubSubMessage): Promise<void> {
    const paymentNotification = this.getNotification(message);

    if (this.isAuthorization(paymentNotification)) {
      await this.processOrderWithAuthNotification(paymentNotification, 0);
    }
  }
  processOrderWithAuthNotification(paymentNotification: PaymentNotification, arg1: number) {
    return;
  }

  private isAuthorization(notification: PaymentNotification): boolean {
    return notification.notificationEvent == NotificationEventType.Authorisation;
}

  private getNotification(message: PubSubMessage): PaymentNotification {
    const jsonData = atob(message.data);
    const clientNotification = JSON.parse(jsonData);
    const paymentNotification = JSON.parse(
      clientNotification.notification.notificationData
    ) as PaymentNotification;
    return paymentNotification;
  }
}
