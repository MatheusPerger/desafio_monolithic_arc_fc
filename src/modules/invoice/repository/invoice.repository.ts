
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceModel } from "./invoice.model";
import { InvoiceItemModel } from "./invoice-item.model";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItem from "../domain/invoice-item.entity";

export default class InvoiceRepository implements InvoiceGateway {
    async generate(invoice: Invoice): Promise<Invoice> {
        await InvoiceModel.create({
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        for (const item of invoice.items) {
            await InvoiceItemModel.create({
                id: item.id.id,
                name: item.name,
                price: item.price,
                invoiceId: invoice.id.id,
            });
        }

        return invoice;
    }

    async find(id: string): Promise<Invoice> {
        const invoiceData = await InvoiceModel.findOne({ where: { id } });
        if (!invoiceData) {
            throw new Error("Invoice not found");
        }

        const itemsData = await InvoiceItemModel.findAll({ where: { invoiceId: id } });
        const items = itemsData.map((item: any) => new InvoiceItem(new Id(item.id), item.name, item.price) );

        const address = new Address(
            invoiceData.street,
            invoiceData.number,
            invoiceData.complement,
            invoiceData.city,
            invoiceData.state,
            invoiceData.zipCode
        );
        return new Invoice(
            new Id(invoiceData.id),
            invoiceData.name,
            invoiceData.document,
            address,
            items,
            invoiceData.createdAt,
            invoiceData.updatedAt
        );
    }
}
