import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import { migrator } from "../../db/config-migrations/migrator";
import { app } from "../../express";
import request from "supertest";
import { AddClientFacadeInputDto } from "../../../modules/client-adm/facade/client-adm.facade.interface";

describe("E2E test for client", () => {
    let sequelize: Sequelize

    let migration: Umzug<any>;
  
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ":memory:",
        logging: false
      });
      
      sequelize.addModels([ClientModel]);
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
        const input: AddClientFacadeInputDto = {
            name: "Client",
            email: "client@example.com",
            document: "12345678901",
            street: "Street",
            number: "123",
            complement: "Complement",
            city: "City",
            state: "State",
            zipCode: "12345-678"
        };

        const response = await request(app)
            .post("/client")
            .send(input);

        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined();
        expect(response.body.name).toBe(input.name);
        expect(response.body.email).toBe(input.email);
        expect(response.body.document).toBe(input.document);
        expect(response.body.street).toBe(input.street);
        expect(response.body.number).toBe(input.number);
        expect(response.body.complement).toBe(input.complement);
        expect(response.body.city).toBe(input.city);
        expect(response.body.state).toBe(input.state);
        expect(response.body.zipCode).toBe(input.zipCode);
    });

    it("should not create a client", async () => {
        const response = await request(app).post("/client").send({
            name: "john",
        });
        expect(response.status).toBe(500);
    });
});