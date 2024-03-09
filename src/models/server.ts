import express from "express";
import routerUser from "../routes/users";
import cors from "cors";
import { Usuario } from "./users";

export class Server {

    private app: express.Application;
    private port: string;

    constructor(){
        this.app = express();
        this.port = process.env.PORT || "3001";
        this.listen();
        this.midleware();
        this.routes();
        this.dbConnect();

    }

    listen(){
        this.app.listen(this.port, () => {
            console.log("aplicacion corriendo en el puerto " + this.port)
        });
    }

    routes(){
        this.app.use('/api/users', routerUser);
    }
    

    midleware(){
        // Parseo body
        this.app.use(express.json());

        // Cors
        this.app.use(cors());
    }

    async dbConnect(){
        try {
            await Usuario.sync();
        } catch (error) {
            console.log('Unable to connect to the database', error);
        }
    }
}