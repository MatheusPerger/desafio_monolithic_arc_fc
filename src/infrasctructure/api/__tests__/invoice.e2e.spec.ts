import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { migrator } from "../../db/config-migrations/migrator";
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";
import { InvoiceItemModel } from "../../../modules/invoice/repository/invoice-item.model";
import Address from "../../../modules/@shared/domain/value-object/address";
import Id from "../../../modules/@shared/domain/value-object/id.value-object";
import InvoiceItem from "../../../modules/invoice/domain/invoice-item.entity";
import Invoice from "../../../modules/invoice/domain/invoice.entity";
import InvoiceRepository from "../../../modules/invoice/repository/invoice.repository";
import { app } from "../../express";
import request from "supertest";

describe("E2E test for invoice", () => {
    let sequelize: Sequelize
    
    let migration: Umzug<any>;
    
    beforeEach(async () => {
        sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ":memory:",
        logging: false
        });
        
        sequelize.addModels([InvoiceModel, InvoiceItemModel]);
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

    it("should create a client", async () => {
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

        const response = await request(app).get(`/invoice/${result.id.id}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(result.id.id);
        expect(response.body.name).toBe(result.name);
        expect(response.body.document).toBe(result.document);
        expect(response.body.address.street).toBe(result.address.street);
        expect(response.body.address.number).toBe(result.address.number);
        expect(response.body.address.city).toBe(result.address.city);
        expect(response.body.address.zipCode).toBe(result.address.zipCode);
        expect(response.body.items.length).toBe(2);
        expect(response.body.items[0].id).toBe(result.items[0].id.id);
        expect(response.body.items[0].name).toBe(result.items[0].name);
        expect(response.body.items[0].price).toBe(result.items[0].price);
        expect(response.body.items[1].id).toBe(result.items[1].id.id);
        expect(response.body.items[1].name).toBe(result.items[1].name);
        expect(response.body.items[1].price).toBe(result.items[1].price);
        expect(response.body.total).toBe(150);
    });
});