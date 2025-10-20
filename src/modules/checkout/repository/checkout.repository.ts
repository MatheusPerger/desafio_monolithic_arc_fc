import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import ClientModel from "./client.model";
import { OrderItemModel } from "./order-item.model";
import { OrderModel } from "./order.model";
import ProductModel from "./product.model";

export default class CheckoutRepository implements CheckoutGateway {
    
    async addOrder(entity: Order): Promise<void> {
        
        await OrderModel.create(
            {
                id: entity.id.id,
                client_id: entity.client.id.id,
                items: entity.products.map((item) => ({
                    id: new Id().id,
                    order_id: entity.id.id,
                    product_id: item.id.id,
                    name: item.name,
                    description: item.description,
                    price: item.salesPrice 
                })),
                status: entity.status,
                createdAt: entity.createdAt,
                updatedAt: entity.updatedAt,
            },
            {
                include: [{model: OrderItemModel}]
            }
        );

    }
    
    async findOrder(id: string): Promise<Order> {
        
        return OrderModel.findOne({
            where: {
                id,
            },
            include: [{ model: OrderItemModel, include: [{ model: ProductModel }] }, { model: ClientModel }],
        }).then((order: OrderModel) => {
            return new Order({
                id: new Id(order.id),
                client: new Client({
                    id: new Id(order.client.id),
                    name: order.client.name,
                    email: order.client.email,
                    street: order.client.street,
                    number: order.client.number,
                    complement: order.client.complement,
                    city: order.client.city,
                    state: order.client.state,
                    zipCode: order.client.zipcode,
                }),
                products: order.items.map((item: OrderItemModel) => 
                    new Product({
                        id: new Id(item.product_id),
                        name: item.product.name,
                        description: item.product.description,
                        salesPrice: item.price,
                    })
                ),
                status: order.status
            });
        });

    }
    
}