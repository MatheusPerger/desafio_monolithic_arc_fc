import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../modules/product-adm/repository/product.model";
import { productRoute } from "./api/routes/product.route";

export const app: Express = express();
app.use(express.json());
// app.use("/client", clientRoute);
app.use("/product", productRoute);
// app.use("/invoice", invoiceRoute);
// app.use("/checkout", checkoutRoute)

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  sequelize.addModels([ProductModel]);
  await sequelize.sync();
}
setupDb();