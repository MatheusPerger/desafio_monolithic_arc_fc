import { DataTypes, Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable('transactions', {
		id: {
			type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
		},
		order_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		amount: {
			type: DataTypes.DECIMAL,
			allowNull: false,
		},
        status: {
			type: DataTypes.DECIMAL,
			allowNull: false,
		},
        createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
        updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	});
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().dropTable('transactions');
};