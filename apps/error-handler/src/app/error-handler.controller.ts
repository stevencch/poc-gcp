import { Controller, HttpStatus, Res, Req, Post, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorHandlerService } from './error-handler.service';
import { Message, DeadLetterAttributes } from '@poc-gcp/common';
import { ErrorObject } from 'ajv';

@Controller()
export class ErrorHandlerController {
  private readonly logger = new Logger(ErrorHandlerController.name);
  constructor(private readonly errorHandlerService: ErrorHandlerService) {}

  @Post()
  async handle(@Req() req: Request, @Res() res: Response) {
    this.logger.log('Received request to process deadletter message');
    const body = req.body as {message:Message<DeadLetterAttributes>};

    try {
      await this.errorHandlerService.process(body.message);
    } catch (error) {
      this.logger.error(`Failed to process message: ${error.message}`);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Failed to process message.');
      return;
    }
    return res.status(HttpStatus.OK).json({ message: 'OK' });
  }
}
