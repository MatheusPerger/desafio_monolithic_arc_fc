import { BelongsTo, Column, ForeignKey, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";
import { OrderModel } from "./order.model";
import ProductModel from "./product.model";
  
@Table({
    tableName: "orders_items",
    timestamps: false,
})
export class OrderItemModel extends Model {

    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @ForeignKey(() => OrderModel)
    @Column({ allowNull: false })
    order_id: string;

    @BelongsTo(() => OrderModel)
    order: OrderModel;
    
    @ForeignKey(() => ProductModel)
    @Column({ allowNull: false})
    product_id: string;

    @BelongsTo(() => ProductModel)
    product: ProductModel;

    @Column({ allowNull: false})
    price: number;
}