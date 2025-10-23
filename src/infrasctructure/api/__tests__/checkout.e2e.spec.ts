import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import request from "supertest";
import { migrator } from "../../db/config-migrations/migrator";
import { app } from "../../express";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import { ProductModel as ProductAdmModel } from "../../../modules/product-adm/repository/product.model";
import TransactionModel from "../../../modules/payment/repository/transaction.model";
import { OrderModel } from "../../../modules/checkout/repository/order.model";
import { OrderItemModel } from "../../../modules/checkout/repository/order-item.model";
import { InvoiceItemModel } from "../../../modules/invoice/repository/invoice-item.model";
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";
import ClientOrderModel from "../../../modules/checkout/repository/client.model";
import ProductOrderModel from "../../../modules/checkout/repository/product.model";
import { default as ProductStoreModel } from '../../../modules/store-catalog/repository/product.model';

describe("E2E test for checkout", () => {
    let sequelize: Sequelize

    let migration: Umzug<any>;
  
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ":memory:",
        logging: false,
        sync: { force: true }
      });
      
      sequelize.addModels([
        ClientModel,
        ProductAdmModel,
        ProductStoreModel,
        TransactionModel,
        OrderModel, OrderItemModel, ClientOrderModel, ProductOrderModel,
        InvoiceModel, InvoiceItemModel
      ]);
      migration = migrator(sequelize);
      await migration.up();
    })

    afterEach(async () => {
        if (!migration || !sequelize) {
          return;
        }

        migration = migrator(sequelize);
        await migration.down();
        await sequelize.close();
    })

    it("should add a order", async () => {

        const responseClient1 = await request(app)
            .post("/client")
            .send({
                name: "Client 1",
                document: "1234",
                email: "client1@email.com",
                street: "Street 1",
                number: "Number 1",
                complement: "Complement 1",
                city: "City 1",
                state: "State 1",
                zipCode: "03940000"
            });
        expect(responseClient1.status).toBe(200);

        const responseProduct1 = await request(app)
            .post("/product")
            .send({
                name: "Product 1",
                description: "Description Product 1",
                purchasePrice: 100,
                stock: 50
            });
        expect(responseProduct1.status).toBe(200);

        const responseProduct2 = await request(app)
            .post("/product")
            .send({
                name: "Product 2",
                description: "Description Product 2",
                purchasePrice: 200,
                stock: 10
            });
        expect(responseProduct2.status).toBe(200);

        await ProductStoreModel.update({
            id: responseProduct1.body.id,
            name: responseProduct1.body.name,
            description: responseProduct1.body.description,
            salesPrice: 150,
        }, {
            where: {
                id: responseProduct1.body.id
            }
        });

        await ProductStoreModel.update({
            id: responseProduct2.body.id,
            name: responseProduct2.body.name,
            description: responseProduct2.body.description,
            salesPrice: 250,
        }, {
            where: {
                id: responseProduct2.body.id
            }
        });

        const response = await request(app)
            .post("/checkout")
            .send({
                clientId: responseClient1.body.id,
                products: 
                [
                    {
                        id: responseProduct1.body.id,
                    },
                    {
                        id: responseProduct2.body.id,
                    },
                ]
            });

        expect(response.status).toBe(200);

        expect(response.body.id).toBeDefined();
        expect(response.body.invoiceId).toBeDefined();
        expect(response.body.status).toBe("approved");
        expect(response.body.total).toBe(400);
        expect(response.body.products.length).toBe(2);

        expect(response.body.products[0].productId).toBe(responseProduct1.body.id);
        expect(response.body.products[1].productId).toBe(responseProduct2.body.id);
    });
});