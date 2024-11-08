import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  Logger,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Request, Response } from 'express';
import { PubSubMessage, PubSubReceivedMessage } from './dto/pubsub.interface';
import {
  AjvValidationError,
  MissingValidationSchemaError,
} from './validation/validation.errors';
import {
  CollectionEnum,
  FirestoreService,
} from 'packages/firestore/src/lib/firestore.service';
import { Filter, Timestamp } from '@google-cloud/firestore';
import { OutboxDocument } from 'packages/firestore/src/models/outbox.model';
import { ProtobufKey, ProtobufService } from '@poc-gcp/common';
import { ProtobufSchemaKey } from 'packages/common/src/lib/interfaces/protobuf.interface';
@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);
  constructor(
    private readonly paymentService: PaymentService,
    private readonly firestoreService: FirestoreService,
    private readonly protobufService: ProtobufService
  ) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }

  @Post('order-handler')
  async processOrder(
    @Req() request: Request<{ Body: PubSubReceivedMessage }>,
    @Res() response: Response
  ): Promise<void> {
    let message: PubSubMessage<unknown>;
    this.logger.log(`PubSubMessage: ${JSON.stringify(request.body)}`);
    const orderResult = await this.paymentService.getOrder(
      '76580dbc-2491-49f5-9a47-c65efa85dbbb'
    );
    this.logger.log(`orderResult: ${JSON.stringify(orderResult)}`);
    response.status(HttpStatus.OK).send();
  }

  @Get('stores/:id')
  async getStoreById(@Param('id') id: string) {
    const store = await this.paymentService.selectStoreById(id);
    return store;
  }

  @Get('firestore/:id')
  async testFireStore(@Param('id') id: string) {
    const created_at_millis = Date.now();
    const data = {
      date: new Date().toISOString(),
    };
    await this.firestoreService.insertDocument(
      CollectionEnum.OUTBOX,
      {
        created: Timestamp.fromMillis(created_at_millis),
        expire_at: Timestamp.fromMillis(created_at_millis + 7 * 86400 * 1000),
        event_body: JSON.stringify(data),
        name: id,
      },
      undefined,
      undefined
    );
    const result = await this.firestoreService.queryDocuments<OutboxDocument>(
      CollectionEnum.OUTBOX,
      Filter.where('name', '==', id)
    );
    return result;
  }

  @Get('getFirestore/:id')
  async getFireStore(@Param('id') id: string) {
    const result = await this.firestoreService.queryDocuments<OutboxDocument>(
      CollectionEnum.OUTBOX,
      Filter.where('name', '==', id)
    );
    return result;
  }

  @Post('handler')
  async outbound(
    @Req() request: Request,
    @Res() response: Response
  ): Promise<void> {
    this.logger.log(`Request: ${JSON.stringify(request.body)}`);
    if (Buffer.isBuffer(request.body)) {
      this.logger.log("The object is a Buffer.");
    } else {
      this.logger.log("The object is not a Buffer.");
    }

    const buffer = Buffer.from(request.body)
    const payload = this.protobufService.decode(
      ProtobufKey.EventRouterMessage,
      buffer
    );
    this.logger.log(`handle: ${payload}`);
    this.logger.log(`handle1: ${JSON.stringify(payload)}`);
    response.status(HttpStatus.OK).send();
  }


}
