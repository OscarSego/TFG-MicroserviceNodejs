"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("../routes/users"));
const cors_1 = __importDefault(require("cors"));
const users_2 = require("./users");
const roles_1 = require("./roles");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || "3001";
        this.listen();
        this.midleware();
        this.routes();
        this.dbConnect();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log("aplicacion corriendo en el puerto " + this.port);
        });
    }
    routes() {
        this.app.use('/api/users', users_1.default);
    }
    midleware() {
        // Parseo body
        this.app.use(express_1.default.json());
        // Cors
        this.app.use((0, cors_1.default)());
    }
    dbConnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield users_2.Usuario.sync();
                yield roles_1.Role.sync();
                users_2.Usuario.belongsToMany(roles_1.Role, { through: 'usuarios_usuario_role', foreignKey: 'usuario_id', timestamps: false });
                roles_1.Role.belongsToMany(users_2.Usuario, { through: 'usuarios_usuario_role', foreignKey: 'role_id', timestamps: false });
            }
            catch (error) {
                console.log('Unable to connect to the database', error);
            }
        });
    }
}
exports.Server = Server;
