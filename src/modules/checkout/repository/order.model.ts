import { BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import ClientModel from "./client.model";
import { OrderItemModel } from "./order-item.model";
  
@Table({
    tableName: "orders",
    timestamps: false,
})
export class OrderModel extends Model {

    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @ForeignKey(() => ClientModel)
    @Column({ allowNull: false})
    client_id: string;

    @BelongsTo(() => ClientModel)
    client: ClientModel;

    @HasMany(() => OrderItemModel)
    items: OrderItemModel[];

    @Column({ allowNull: false })
    status: string;

    @Column({ allowNull: false })
    createdAt: Date;

    @Column({ allowNull: false })
    updatedAt: Date;

}