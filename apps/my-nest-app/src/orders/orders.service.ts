import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AddLineItemDto } from './dto/add-line-item.dto';
import { CTCart } from './types/commercetools-cart.type';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import { CreateCustomerCartVariables, StoreKeyVariable } from './types/cart-gql-variables.type';
import { createCustomerCartGql, getActiveCustomerCartGql } from './graphql/create-customer-cart.gql';


@Injectable()
export class OrdersService {
  private readonly CUSTOMER_CART_EXPIRY = 90;
  private readonly  logger=new Logger(OrdersService.name);
  constructor(
    @Inject('COMMERCETOOLS_CLIENT')
    private readonly ctClient: ByProjectKeyRequestBuilder
  ){}
  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async _query<T>(gqlQuery: string, gqlVariables: T, cart: CTCart | null) {
    try {
      const {
        body: { data, errors },
      } = await this.ctClient
        .graphql()
        .post({
          body: {
            query: gqlQuery,
            variables: gqlVariables,
          },
        })
        .execute();

      return { data, errors };
    } catch (err) {
      this.logger.error(err);
    }
  }

  async handleErrors(errors, cart) {
    if (errors) {
      this.logger.log(errors);
    }
  }

  async generateLineItems(lineItems, supplyChannels) {
    const transformedItems = lineItems.map((item) => {
      return {
        sku: item.sku,
        quantity: item.quantity,
        distributionChannel: {
          typeId: 'channel',
          key: "cwr-cw-channel-au",
        },
        supplyChannel: supplyChannels[item.sku]
          ? { typeId: 'channel', key: supplyChannels[item.sku] }
          : undefined,
        custom: item.custom,
      };
    });

    return transformedItems;
  }

  async createCustomerCart(
    customerId: string,
    storeKey: string,
    lineItems: AddLineItemDto[]
  ) {
    this.logger.log('create_customer_cart');

    const marketplaceChannelsBySku={};
    let customerCart;
    const cartUpdateActions = { actions: [] };



      this.logger.log('Active cart not found. Creating new cart.');

      const lineItemsDraft =
        await this.generateLineItems(
          lineItems,
          marketplaceChannelsBySku
        );

      const cartVariables = {
        lineItemsDraft,
        storeKey,
        currency: 'AUD',
        customerId,
        deleteDaysAfterLastModification: this.CUSTOMER_CART_EXPIRY,
      };



      const cart = await this._query<CreateCustomerCartVariables>(
        createCustomerCartGql,
        cartVariables,
        null
      );

      const {
        data: { createCart },
        errors,
      } = cart;


      customerCart = createCart;




    return createCart;
  }
}
