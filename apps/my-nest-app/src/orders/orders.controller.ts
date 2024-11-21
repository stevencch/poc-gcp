import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ResponseEntity } from './entities/response.entity';
import { CartEntity } from './entities/cart/cart.entity';
import { AddLineItemDto } from './dto/add-line-item.dto';

@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  async findAll() {
    this.logger.log('create_cart_request');
    const cart = await this.ordersService.createCustomerCart(
      "d0ec9916-ceb9-402c-8d50-8801aac849a4",
      "cwr-cw-au",
      [{
        sku:"53030",
        quantity:1
      }]
    );
    return new ResponseEntity({ cart: new CartEntity(cart, 'en') });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
