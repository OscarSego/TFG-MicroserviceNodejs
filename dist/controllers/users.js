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
exports.loginUser = exports.newUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_1 = require("../models/users");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const newUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Validamos si el usuario ya existe en la base de datos
        const existingUser = yield users_1.Usuario.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({
                msg: `Ya existe un usuario con el email ${email}`
            });
        }
        // Creamos el usuario
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield users_1.Usuario.create({
            email: email,
            password: hashedPassword,
        });
        console.log(hashedPassword);
        res.json({
            msg: `Usuario ${email} creado con éxito`,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ocurrió un error al crear el usuario',
            error: error
        });
    }
});
exports.newUser = newUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Validamos si el usuario existe en la base de datos
    const usuario = yield users_1.Usuario.findOne({ where: { email: email } });
    if (!usuario) {
        return res.status(400).json({
            msg: `No existe un usuario con el email ${email} en la bd`
        });
    }
    // Validamos password
    const passwordValid = yield bcrypt_1.default.compare(password, usuario.password);
    if (!passwordValid) {
        return res.status(400).json({
            msg: `Password incorrecta`
        });
    }
    // Generar el token
    const token = jsonwebtoken_1.default.sign({
        email: email
    }, process.env.SECRET_KEY || 'prueba123');
    res.json({ token });
});
exports.loginUser = loginUser;
