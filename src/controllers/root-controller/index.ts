import {Controller, HttpServer} from "../index";
import {RequestHandler} from "express";

let counter:number = 1;

export class RootController implements Controller {

    initialize(httpServer: HttpServer): void {
        httpServer.get('/', this.root.bind(this));
    }

    private readonly root: RequestHandler = async (req, res, next,) => {
        res.send({
            'status': `API is working! Counter: ${(counter++)}`
        });
        next();
    }
}