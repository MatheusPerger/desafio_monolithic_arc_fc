import GenerateInvoiceUseCase from "./generate-invoice.usecase";
import Invoice from "../../domain/invoice.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../../../@shared/domain/value-object/address";
import InvoiceItem from "../../domain/invoice-item.entity";
import InvoiceGateway from "../../gateway/invoice.gateway";

const invoice = new Invoice(
    new Id("1"),
    "Cliente",
    "12345678900",
    new Address("Rua A", "123", "", "Cidade", "UF", "00000-000"),
    [
        new InvoiceItem(new Id("item1"), "Item 1", 100),
        new InvoiceItem(new Id("item2"), "Item 2", 50),
    ]
);

const MockRepository = (): InvoiceGateway => {
  return {
    generate: jest.fn().mockResolvedValue(Promise.resolve(invoice)),
    find: jest.fn(),
  };
};

describe("generate invoice use case unit test", () => {
  it("should generate an invoice", async () => {
    const invoiceRepository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(invoiceRepository);

    const input = {
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

    const result = await usecase.execute(input);

    expect(invoiceRepository.generate).toBeCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.street).toBe(input.street);
    expect(result.number).toBe(input.number);
    expect(result.zipCode).toBe(input.zipCode);
    expect(result.state).toBe(input.state);
    expect(result.city).toBe(input.city);
    expect(result.items.length).toBe(2);
    expect(result.items[0].id).toBe(input.items[0].id);
    expect(result.items[0].name).toBe(input.items[0].name);
    expect(result.items[1].id).toBe(input.items[1].id);
    expect(result.items[1].name).toBe(input.items[1].name);
    expect(result.total).toBe(invoice.total);
  });
});
