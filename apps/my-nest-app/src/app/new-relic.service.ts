import { Injectable, Scope } from "@nestjs/common";
import { LoggingService } from "./logging.service";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { LogEvent, LogInput, LogType, NewRelicLog } from "./new-relic.interface";
import { CloudEvent } from "cloudevents";

@Injectable({ scope: Scope.TRANSIENT })
export class NewRelicService extends LoggingService {
  constructor(@InjectPinoLogger('DefaultContext') logger: PinoLogger) {
    super(logger);
  }

  logEvent(message:string): void {
    super.log(message);
  }
}