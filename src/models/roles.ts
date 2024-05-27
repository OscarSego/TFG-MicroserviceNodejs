import { Sequelize, DataTypes } from 'sequelize';
import sequelize from "../db/db-connection";
import { Usuario } from './users';

export const Role = sequelize.define('Role', {
    role: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    created: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'usuarios_role',
    timestamps: false
});
