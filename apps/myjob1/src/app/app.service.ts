import { Inject, Injectable, Logger } from '@nestjs/common';
import appConfig from './app.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>
  ){}
  
  async run(): Promise<void> {
    this.logger.log(`Job starting 444...${new Date().toISOString()}`);
  }
}
