import FindInvoiceUseCase from "./find-invoice.usecase";
import Invoice from "../../domain/invoice.entity";
import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
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
    generate: jest.fn(),
    find: jest.fn().mockResolvedValue(invoice),
  };
};

describe("find invoice use case unit test", () => {
    it("should find an invoice", async () => {
        const invoiceRepository = MockRepository();
        const usecase = new FindInvoiceUseCase(invoiceRepository);

        const input = { id: "1" };

        const result = await usecase.execute(input);

        expect(result.id).toBe(invoice.id.id);
        expect(result.name).toBe(invoice.name);
        expect(result.document).toBe(invoice.document);
        expect(result.address.street).toBe(invoice.address.street);
        expect(result.items.length).toBe(2);
        expect(result.items[0].id).toBe(invoice.items[0].id.id);
        expect(result.items[1].id).toBe(invoice.items[1].id.id);
        expect(result.total).toBe(invoice.total);
    });
});
