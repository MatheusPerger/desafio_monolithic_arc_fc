import Id from "../../@shared/domain/value-object/id.value-object";

export default class InvoiceItem {
  public id: Id;
  public name: string;
  public price: number;

  constructor(id: Id, name: string, price: number) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}
