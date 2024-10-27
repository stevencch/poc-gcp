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
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Request, Response } from 'express';
import { PubSubMessage, PubSubReceivedMessage } from './dto/pubsub.interface';
import { AjvValidationError, MissingValidationSchemaError } from './validation/validation.errors';

@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);
  constructor(private readonly paymentService: PaymentService) {}

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
    try {
      const { body } = request;
      message = this.paymentService.extractPubSubMessage(body);
    } catch (error) {
      this.logger.error(`ExtractPubSubMessage failed: ${error.message}`);
      throw error;
    }

    try {
      await this.paymentService.processOrderMessage(message);
      response.status(HttpStatus.OK).send();
    } catch (error) {
      if (
        error instanceof AjvValidationError ||
        error instanceof MissingValidationSchemaError
      ) {
        this.logger.error(`Validation failed: ${error.message}`);
      }
      throw error;
    }
  }

  
}
