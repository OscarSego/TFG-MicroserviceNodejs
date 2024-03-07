import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/users";
import jwt from "jsonwebtoken";

export const newUser = async (req: Request, res: Response) => {

    const {email, password} = req.body;

    console.log(email);
    console.log(password);

    const hashedPassword = await bcrypt.hash(password, 10);

    // Validamos si el usuario existe en la base de datos

    const user = await User.findOne({where:{email:email}})

    if(user){
       return res.status(400).json({
            msg: `Ya existe un usuario con el email ${email}`
        })
    }

    try {
        // Guardamos usuario en la base de datos
        await User.create({
            email: email,
            password: hashedPassword
        })

        res.json({
            msg: `Usuario ${email} creado con exito`,
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Ocurrio un error', error
        })
    }


}

export const loginUser = async (req: Request, res: Response) => {

    const {email, password} = req.body;

    // Validamos si el usuario existe en la base de datos

    const user: any = await User.findOne({where:{email:email}})

    if(!user){
        return res.status(400).json({
            msg: `No existe un usuario con el email ${email} en la bd`
        })
    }

    // Validamos password

    const passwordValid = await bcrypt.compare(password, user.password)
    
    if(!passwordValid){
        return res.status(400).json({
            msg: 'Password incorrecta'
        })
    }

    // Generar el token

    const token = jwt.sign({
        email: email
    },process.env.SECRET_KEY || 'prueba123')

    res.json({token});

}