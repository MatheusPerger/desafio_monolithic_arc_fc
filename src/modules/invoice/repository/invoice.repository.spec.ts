import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";
import { InvoiceItemModel } from "./invoice-item.model";
import Invoice from "../domain/invoice.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItem from "../domain/invoice-item.entity";
import InvoiceRepository from "./invoice.repository";

describe("InvoiceRepository test", () => {
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

    it("should generate an invoice", async () => {
        const invoice = new Invoice(
            new Id("1"),
            "Cliente",
            "12345678900",
            new Address(
                "Rua A",
                "123",
                "",
                "Cidade",
                "UF",
                "00000-000",
            ),
            [
                new InvoiceItem( new Id("item1"), "Item 1", 100 ),
                new InvoiceItem( new Id("item2"), "Item 2", 50 ),
            ]
        );

        const repository = new InvoiceRepository();
        const result = await repository.generate(invoice);

        expect(result.id.id).toBe(invoice.id.id);
        expect(result.name).toBe(invoice.name);
        expect(result.document).toBe(invoice.document);
        expect(result.address.street).toEqual(invoice.address.street);
        expect(result.address.number).toEqual(invoice.address.number);
        expect(result.address.city).toEqual(invoice.address.city);
        expect(result.address.zipCode).toEqual(invoice.address.zipCode);
        expect(result.items.length).toBe(2);
        expect(result.items[0].id.id).toEqual(invoice.items[0].id.id);
        expect(result.items[0].name).toEqual(invoice.items[0].name);
        expect(result.items[0].price).toEqual(invoice.items[0].price);
        expect(result.items[1].id.id).toEqual(invoice.items[1].id.id);
        expect(result.items[1].name).toEqual(invoice.items[1].name);
        expect(result.items[1].price).toEqual(invoice.items[1].price);
    });

    it("should find an invoice", async () => {
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

        const repository = new InvoiceRepository();
        const result = await repository.find("1");

        expect(result.id.id).toBe("1");
        expect(result.name).toBe("Cliente");
        expect(result.document).toBe("12345678900");
        expect(result.address.street).toBe("Rua A");
        expect(result.address.number).toBe("123");
        expect(result.address.complement).toBe("");
        expect(result.address.city).toBe("Floripa");
        expect(result.address.state).toBe("SC");
        expect(result.address.zipCode).toBe("00000-000");
        expect(result.items.length).toBe(2);
        expect(result.items[0].id.id).toBe("item1");
        expect(result.items[0].name).toBe("Item 1");
        expect(result.items[0].price).toBe(100);
        expect(result.items[1].id.id).toBe("item2");
        expect(result.items[1].name).toBe("Item 2");
        expect(result.items[1].price).toBe(50);
    });
});