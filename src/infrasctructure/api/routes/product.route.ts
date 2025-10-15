import express, { Request, Response } from 'express';
import ProductAdmFacadeFactory from '../../../modules/product-adm/factory/facade.factory';

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
  const productFacadeAdm = ProductAdmFacadeFactory.create();

  try {
      const productDto = {
        name: req.body.name,
        description: req.body.description,
        stock: req.body.stock,
        purchasePrice: req.body.purchasePrice
      };
      const output = await productFacadeAdm.addProduct(productDto)
      res.send(output);
  }catch (err) {
    if (err instanceof Error) {
        res.status(400).send(err.message);
    }else{
        res.status(500).send(err);
    }
  }
});