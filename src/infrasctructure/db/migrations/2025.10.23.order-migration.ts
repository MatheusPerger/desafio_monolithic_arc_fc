import { DataTypes, Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable('orders', {
		id: {
			type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
		},
		client_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
        status: {
			type: DataTypes.STRING,
			allowNull: false,
		},
        createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
		}
	});
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().dropTable('orders');
};