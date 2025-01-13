import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { NewRelicService } from './new-relic.service';
import { LogStatus, NewRelicLogError } from './new-relic.interface';
import { RedisService } from '@poc-gcp/common';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly newRelicService: NewRelicService,
    private readonly redisService: RedisService,
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
  @Get('star')
  async getStar() {
    const key = 'star';
    let star = await this.redisService.get(key);
    if (star === null) {
      star = "1";
    } else {
      star = (parseInt(star, 10) + 1).toString();
    }
    await this.redisService.updateKey(key, star,'30m');
    return { star };
  }
}
