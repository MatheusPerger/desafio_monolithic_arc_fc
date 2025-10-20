import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutRepository from "./checkout.repository";
import { ClientModel as ClientAdmModel } from "../../client-adm/repository/client.model";
import ClientModel from "../repository/client.model";
import { OrderItemModel } from "./order-item.model";
import { OrderModel } from "./order.model";
import ProductModel from "./product.model";

describe("CheckoutRepository test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        });
        
        sequelize.addModels([OrderModel, OrderItemModel, 
            ClientAdmModel, ClientModel, ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should add a order", async () => {
        
        const repository = new CheckoutRepository();

        const client = await ClientAdmModel.create({
            id: "1",
            name: "Client 1",
            email: "teste@teste.com",
            document: "123456789",
            street: "Address 1",
            number: "1",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipcode: "ZipCode 1",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const product1 = await ProductModel.create({
            id: "1",
            name: "Product 1",
            description: "Description 1",
            salesPrice: 20
        });

        const product2 = await ProductModel.create({
            id: "2",
            name: "Product 2",
            description: "Description 2",
            salesPrice: 30
        });

        const order = new Order({
            id: new Id("1"),
            client: new Client({
                id: new Id(client.id),
                name: client.name,
                email: client.email,
                street: client.street,
                number: client.number,
                complement: client.complement,
                city: client.city,
                state: client.state,
                zipCode: client.zipcode,
            }),
            products: [
                new Product({
                    id: new Id(product1.id),
                    name: product1.name,
                    description: product1.description,
                    salesPrice: product1.salesPrice,
                }),
                new Product({
                    id: new Id(product2.id),
                    name: product2.name,
                    description: product2.description,
                    salesPrice: product2.salesPrice,
                }),
            ],
            status: "approved",
        });

        await repository.addOrder(order);

        const result = await OrderModel.findOne({
            where: { id: "1" },
            include: [{ model: OrderItemModel, include: [{ model: ProductModel }] }, 
                      { model: ClientModel }],
        });

        expect(result).toBeDefined();
        expect(result.id.toString()).toBe(order.id.id.toString());
        expect(result.status).toBe(order.status);
        expect(result.client.id.toString()).toEqual(order.client.id.id.toString());
        expect(result.client.name).toBe(order.client.name);
        expect(result.client.email).toBe(order.client.email);
        expect(result.client.street).toBe(order.client.street);
        expect(result.client.number).toBe(order.client.number);
        expect(result.client.zipcode).toBe(order.client.zipCode);
        expect(result.items[0].product_id.toString()).toBe(order.products[0].id.id.toString());
        expect(result.items[0].product.name).toBe(order.products[0].name);
        expect(result.items[0].product.description).toBe(order.products[0].description);
        expect(result.items[0].product.salesPrice).toBe(order.products[0].salesPrice);
        expect(result.items[1].product_id.toString()).toBe(order.products[1].id.id.toString());
        expect(result.items[1].product.name).toBe(order.products[1].name);
        expect(result.items[1].product.description).toBe(order.products[1].description);
        expect(result.items[1].product.salesPrice).toBe(order.products[1].salesPrice);
    });

    it("should find an order", async () => {

        const repository = new CheckoutRepository();

        const client = await ClientAdmModel.create({
            id: "1",
            name: "Client 1",
            email: "teste@teste.com",
            document: "123456789",
            street: "Address 1",
            number: "1",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipcode: "ZipCode 1",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const product1 = await ProductModel.create({
            id: "1",
            name: "Product 1",
            description: "Description 1",
            salesPrice: 20
        });

        const product2 = await ProductModel.create({
            id: "2",
            name: "Product 2",
            description: "Description 2",
            salesPrice: 30
        });

        const order = new Order({
            id: new Id("1"),
            client: new Client({
                id: new Id(client.id),
                name: client.name,
                email: client.email,
                street: client.street,
                number: client.number,
                complement: client.complement,
                city: client.city,
                state: client.state,
                zipCode: client.zipcode,
            }),
            products: [
                new Product({
                    id: new Id(product1.id),
                    name: product1.name,
                    description: product1.description,
                    salesPrice: product1.salesPrice,
                }),
                new Product({
                    id: new Id(product2.id),
                    name: product2.name,
                    description: product2.description,
                    salesPrice: product2.salesPrice,
                }),
            ],
            status: "approved",
        });

        await repository.addOrder(order);

        const result = await repository.findOrder(order.id.id);

        expect(result).toBeDefined();
        expect(result.id.id.toString()).toBe(order.id.id.toString());
        expect(result.status).toBe(order.status);
        expect(result.client.id.id.toString()).toEqual(order.client.id.id.toString());
        expect(result.client.name).toBe(order.client.name);
        expect(result.client.email).toBe(order.client.email);
        expect(result.client.street).toBe(order.client.street);
        expect(result.client.complement).toBe(order.client.complement);
        expect(result.client.city).toBe(order.client.city);
        expect(result.client.state).toBe(order.client.state);
        expect(result.client.zipCode).toBe(order.client.zipCode);
        expect(result.products[0].id.id.toString()).toBe(order.products[0].id.id.toString());
        expect(result.products[0].name).toBe(order.products[0].name);
        expect(result.products[0].description).toBe(order.products[0].description);
        expect(result.products[0].salesPrice).toBe(order.products[0].salesPrice);
        expect(result.products[1].id.id.toString()).toBe(order.products[1].id.id.toString());
        expect(result.products[1].name).toBe(order.products[1].name);
        expect(result.products[1].description).toBe(order.products[1].description);
        expect(result.products[1].salesPrice).toBe(order.products[1].salesPrice);
    });

});