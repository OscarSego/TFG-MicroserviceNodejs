import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Middleware para validar el token JWT
const validateToken = (req:Request, res:Response, next:NextFunction) => {
    
    // Obtenemos el token del encabezado 'authorization'
    const headerToken = req.headers['authorization']

    // Verificamos si el token existe y si empieza con 'Bearer '
    if(headerToken != undefined && headerToken.startsWith('Bearer ')){
       // Tiene token

       try {
        // Extraemos el token eliminando la palabra 'Bearer '
        const bearerToken = headerToken.slice(7);
       
        // Verificamos el token con la clave secreta
        jwt.verify(bearerToken, process.env.SECRET_KEY || 'prueba123');
       
        // Si el token es válido, llamamos a next() para pasar al siguiente middleware o ruta
        next()
       } catch (error) {
        // Si ocurre un error al verificar el token, respondemos con un error 401 (no autorizado)
        res.status(401).json({
            msg: 'Token no valido'
        })
       }

    }else{
         // Si no se proporciona el token o no empieza con 'Bearer ', respondemos con un error 400 (solicitud incorrecta)
        res.status(400).json({
            msg: 'Acceso denegado'
        })
    }

}

export default validateToken;