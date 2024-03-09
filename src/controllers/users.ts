import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Usuario } from "../models/users";
import jwt from "jsonwebtoken";

export const newUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Validamos si el usuario ya existe en la base de datos
        const existingUser = await Usuario.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({
                msg: `Ya existe un usuario con el email ${email}`
            });
        }

        // Creamos el usuario
        const hashedPassword = await bcrypt.hash(password, 10);
        await Usuario.create({
            email: email,
            password: hashedPassword,
        });

        console.log(hashedPassword)

        res.json({
            msg: `Usuario ${email} creado con éxito`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ocurrió un error al crear el usuario',
            error: error
        });
    }
};

export const loginUser = async (req: Request, res: Response) => {

    const {email, password} = req.body;

    // Validamos si el usuario existe en la base de datos

    const usuario: any = await Usuario.findOne({where:{email:email}})

    if(!usuario){
        return res.status(400).json({
            msg: `No existe un usuario con el email ${email} en la bd`
        })
    }

    // Validamos password

    const passwordValid = await bcrypt.compare(password, usuario.password)
    
    if(!passwordValid){
        return res.status(400).json({
            msg: `Password incorrecta`
        })
    }

    // Generar el token

    const token = jwt.sign({
        email: email
    },process.env.SECRET_KEY || 'prueba123')

    res.json({token});

}