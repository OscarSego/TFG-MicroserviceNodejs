import express from "express";
import routerUser from "../routes/users";
import cors from "cors";
import { Usuario } from "./users";
import { Role } from "./roles";

// Clase Server para configurar y ejecutar el servidor Express
export class Server {

    // Atributos privados de la clase
    private app: express.Application;
    private port: string;

    // Constructor de la clase
    constructor(){
        // Inicializamos la aplicación de Express
        this.app = express();
        // Obtenemos el puerto de las variables de entorno o usamos el puerto 3001 por defecto
        this.port = process.env.PORT || "3001";
        // Llamamos a los métodos de la clase para configurar el servidor
        this.listen();
        this.midleware();
        this.routes();
        this.dbConnect();

    }

    // Método para iniciar el servidor y escuchar en el puerto especificado
    listen(){
        this.app.listen(this.port, () => {
            console.log("aplicacion corriendo en el puerto " + this.port)
        });
    }

    // Método para definir las rutas de la aplicación
    routes(){
        // Definimos la ruta /api/users que utilizará el router importado de ../routes/users
        this.app.use('/api/users', routerUser);
    }
    
    // Método para configurar los middlewares de la aplicación
    midleware(){
        // Middleware para parsear el cuerpo de las solicitudes a formato JSON
        this.app.use(express.json());

        // Middleware para habilitar CORS
        this.app.use(cors());
    }

    // Método para conectar y sincronizar la base de datos
    async dbConnect(){
        try {
            // Sincronizamos el modelo Usuario con la base de datos
            await Usuario.sync();
            // Sincronizamos el modelo Role con la base de datos
            await Role.sync();

            // Establecemos una relación de muchos a muchos entre Usuario y Role
            Usuario.belongsToMany(Role, { through: 'usuarios_usuario_role', foreignKey: 'usuario_id', timestamps: false });
            Role.belongsToMany(Usuario, { through: 'usuarios_usuario_role',foreignKey: 'role_id', timestamps: false });

        } catch (error) {
            // En caso de error, lo registramos en la consola
            console.log('Unable to connect to the database', error);
        }
    }
}