import { Order } from "@commercetools/platform-sdk";

export class OrderResult {
    order: Order | null;
    orderExists: boolean;
}