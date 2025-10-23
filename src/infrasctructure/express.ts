import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../modules/product-adm/repository/product.model";
import { productRoute } from "./api/routes/product.route";
import { clientRoute } from "./api/routes/client.route";
import { ClientModel } from "../modules/client-adm/repository/client.model";
import { invoiceRoute } from "./api/routes/invoice.route";
import { InvoiceModel } from "../modules/invoice/repository/invoice.model";
import { InvoiceItemModel } from "../modules/invoice/repository/invoice-item.model";
import { checkoutRoute } from "./api/routes/checkout.route";
import { OrderModel } from "../modules/checkout/repository/order.model";
import { OrderItemModel } from "../modules/checkout/repository/order-item.model";
import ClientOrderModel from "../modules/checkout/repository/client.model";
import ProductOrderModel from "../modules/checkout/repository/product.model";
import TransactionModel from "../modules/payment/repository/transaction.model";
import ProductStoreModel  from "../modules/store-catalog/repository/product.model";

export const app: Express = express();
app.use(express.json());
app.use("/client", clientRoute);
app.use("/product", productRoute);
app.use("/invoice", invoiceRoute);
app.use("/checkout", checkoutRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  sequelize.addModels([ProductModel, ClientModel, InvoiceModel, InvoiceItemModel, OrderModel, OrderItemModel, ClientOrderModel, ProductOrderModel, TransactionModel, ProductStoreModel]);
  await sequelize.sync();
}
setupDb();