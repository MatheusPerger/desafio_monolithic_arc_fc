import { Sequelize } from "sequelize-typescript";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";
import { InvoiceModel } from "../repository/invoice.model";
import { InvoiceItemModel } from "../repository/invoice-item.model";
import { GenerateInvoiceUseCaseInputDto } from "../usecase/generate-invoice/generate-invoice.usecase.dto";
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "../usecase/find-invoice/find-invoice.usecase.dto";

describe("InvoiceFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate invoice", async () => {
    const facade = InvoiceFacadeFactory.create();
    
    const input: GenerateInvoiceUseCaseInputDto = {
      name: "Cliente",
      document: "12345678900",
      street: "Rua A",
      number: "123",
      complement: "",
      city: "Cidade",
      state: "UF",
      zipCode: "00000-000",
      items: [
        { id: "item1", name: "Item 1", price: 100 },
        { id: "item2", name: "Item 2", price: 50 },
      ],
    };

    const output = await facade.generate(input);

    expect(output.id).toBeDefined();
    expect(output.name).toBe(input.name);
    expect(output.document).toBe(input.document);
    expect(output.street).toBe(input.street);
    expect(output.number).toBe(input.number);
    expect(output.complement).toBe(input.complement);
    expect(output.city).toBe(input.city);
    expect(output.state).toBe(input.state);
    expect(output.zipCode).toBe(input.zipCode);
    expect(output.items).toHaveLength(input.items.length);
    expect(output.total).toBe(150);
  });

  it("find invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const invoiceModel = await InvoiceModel.create({
      id: "1",
      name: "Cliente",
      document: "12345678900",
      street: "Rua A",
      number: "123",
      complement: "",
      city: "Floripa",
      state: "SC",
      zipCode: "00000-000",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const items = [
      { id: "item1", name: "Item 1", price: 100 },
      { id: "item2", name: "Item 2", price: 50 },
    ];

    for (const item of items) {
      await InvoiceItemModel.create({
        id: item.id,
        name: item.name,
        price: item.price,
        invoiceId: invoiceModel.id,
      });
    }
    
    const input: FindInvoiceUseCaseInputDTO = {
      id: "1"
    };

    const output: FindInvoiceUseCaseOutputDTO = await facade.find(input);

    expect(output.id).toBe("1");
    expect(output.name).toBe(invoiceModel.name);
    expect(output.document).toBe(invoiceModel.document);
    expect(output.address.street).toBe(invoiceModel.street);
    expect(output.address.number).toBe(invoiceModel.number);
    expect(output.address.complement).toBe(invoiceModel.complement);
    expect(output.address.city).toBe(invoiceModel.city);
    expect(output.address.state).toBe(invoiceModel.state);
    expect(output.address.zipCode).toBe(invoiceModel.zipCode);
    expect(output.items).toHaveLength(2);
    expect(output.items[0].id).toBe("item1");
    expect(output.items[0].name).toBe("Item 1");
    expect(output.items[0].price).toBe(100);
    expect(output.items[1].id).toBe("item2");
    expect(output.items[1].name).toBe("Item 2");
    expect(output.items[1].price).toBe(50);
    expect(output.total).toBe(150);
  });
});
