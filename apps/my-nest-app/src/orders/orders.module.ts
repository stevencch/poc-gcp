import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { CtModule } from '@poc-gcp/ct';

@Module({
  imports: [CtModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
