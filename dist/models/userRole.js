"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
const sequelize_1 = require("sequelize");
const db_connection_1 = __importDefault(require("../db/db-connection"));
const roles_1 = require("./roles");
const users_1 = require("./users");
exports.UserRole = db_connection_1.default.define('userRole', {
    userEmail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'User',
            key: 'email'
        }
    },
    roleId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Role',
            key: 'id'
        }
    }
});
users_1.User.belongsToMany(roles_1.Role, { through: exports.UserRole, foreignKey: 'userEmail' });
roles_1.Role.belongsToMany(users_1.User, { through: exports.UserRole, foreignKey: 'roleId' });
