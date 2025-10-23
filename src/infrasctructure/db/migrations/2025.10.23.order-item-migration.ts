import { DataTypes, Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable('orders_items', {
		id: {
			type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
		},
		order_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
        product_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
        price: {
			type: DataTypes.DECIMAL,
			allowNull: false,
		},
	});
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().dropTable('orders_items');
};