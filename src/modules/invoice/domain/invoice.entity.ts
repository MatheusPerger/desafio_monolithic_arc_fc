import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItem from "./invoice-item.entity";

export default class Invoice {
  public id: Id;
  public name: string;
  public document: string;
  public address: Address;
  public items: InvoiceItem[];
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    id: Id,
    name: string,
    document: string,
    address: Address,
    items: InvoiceItem[],
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.id = id;
    this.name = name;
    this.document = document;
    this.address = address;
    this.items = items;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
  }

  get total(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }
}
