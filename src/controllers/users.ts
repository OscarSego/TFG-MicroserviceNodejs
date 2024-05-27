import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Usuario } from "../models/users";
import { Role } from "../models/roles";
import jwt from "jsonwebtoken";
import { ModelCtor } from 'sequelize/types';

// Controlador para la creación de un nuevo usuario

export const newUser = async (req: Request, res: Response) => {
    // Extraemos el email y la contraseña del cuerpo de la solicitud
    const { email, password } = req.body;

    try {
        // Validamos si el usuario ya existe en la base de datos
        const existingUser = await Usuario.findOne({ where: { email: email } });
        if (existingUser) {
            // Si ya existe un usuario con el mismo email, devolvemos un error 400
            return res.status(400).json({
                msg: `Ya existe un usuario con el email ${email}`
            });
        }

        // Si el usuario no existe, procedemos a crearlo
        // Encriptamos la contraseña proporcionada
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await (Usuario as ModelCtor<any>).create({
            email: email,
            password: hashedPassword,
        });

        // Verificamos si el rol 'usuario' existe en la base de datos
        let userRole = await Role.findOne({ where: { role: 'usuario' } });
        if (!userRole) {
            // Si el rol no existe, lo creamos
            userRole = await Role.create({ role: 'usuario' });
        }

        // Asociamos el usuario recién creado con el rol 'usuario'
        if (userRole) {
            await newUser.addRole(userRole);
        } else {
            // Si el rol no se encuentra o no se pudo crear, lanzamos un error
            throw new Error('El rol de usuario no se encontró en la base de datos.');
        }
        // Respondemos con un mensaje de éxito
        res.json({
            msg: `Usuario ${email} creado con éxito`,
        });
    } catch (error) {
        // En caso de cualquier error, lo capturamos y respondemos con un error 500
        console.error(error);
        res.status(500).json({
            msg: 'Ocurrió un error al crear el usuario',
            error: error
        });
    }
};

// Controlador para el inicio de sesión de un usuario
export const loginUser = async (req: Request, res: Response) => {
    // Extraemos el email y la contraseña del cuerpo de la solicitud

    const {email, password} = req.body;

    // Validamos si el usuario existe en la base de datos

    const usuario: any = await Usuario.findOne({where:{email:email}})

    if(!usuario){
        // Si no existe un usuario con el email proporcionado, devolvemos un error 400
        return res.status(400).json({
            msg: `No existe un usuario con el email ${email} en la bd`
        })
    }

    // Validamos password

    const passwordValid = await bcrypt.compare(password, usuario.password)
    
    if(!passwordValid){
        // Si la contraseña no es válida, devolvemos un error 400
        return res.status(400).json({
            msg: `Password incorrecta`
        })
    }

    // Generar el token

    const token = jwt.sign({
        email: email,
        userId: usuario.id
    },process.env.SECRET_KEY || 'prueba123')

    // Respondemos con el token generado

    res.json({token});

}