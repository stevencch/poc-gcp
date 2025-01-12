import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { NewRelicService } from './new-relic.service';
import { LogStatus, NewRelicLogError } from './new-relic.interface';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly newRelicService: NewRelicService
  ) {}

  @Get()
  getData() {
    this.newRelicService.logEvent('test logger');
    return this.appService.getData();
  }

  //create a Get Endpoint, which retry current datetime but delay 500ms
  @Get('datetime')
  async getCurrentDateTime() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { currentDateTime: new Date().toISOString() };
  }
}
