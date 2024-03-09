import { Sequelize, DataTypes } from 'sequelize';
import sequelize from "../db/db-connection";

export const Usuario = sequelize.define('Usuario', {
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'usuarios_usuario', 
    timestamps: false 
  });
