import {Express, NextFunction, Request, RequestHandler, Response} from "express";
import {ErrorResponseBody, HttpResponseError} from "../utils/http-response-error";
import {logError, logWarn} from "../utils/logger";
import assert from "node:assert";


export interface Controller {
    initialize(httpServer: HttpServer): void;
}

export class HttpServer {

    constructor(public readonly express:Express,) {}

    get(path: string, requestHandler: RequestHandler, customClaims?:string[]): void {
        this.express.get(path,this._catchErrorHandler(requestHandler, customClaims));
    }

    post(path: string, requestHandler: RequestHandler, customClaims?:string[]): void {
        this.express.post(path,this._catchErrorHandler(requestHandler, customClaims));
    }

    delete(path: string, requestHandler: RequestHandler, customClaims?:string[]): void {
        this.express.delete(path,this._catchErrorHandler(requestHandler, customClaims));
    }

    put(path: string, requestHandler: RequestHandler, customClaims?:string[]): void {
        this.express.put(path,this._catchErrorHandler(requestHandler, customClaims));
    }

    private readonly _catchErrorHandler =  (requestHandler: RequestHandler, customClaims?:string[]) => {
        return async (req:Request, res:Response, next:NextFunction) => {
            const checkCustomClaim = () => {
                if(customClaims?.length) {
                    assert(req.authenticated != null);
                    assert(req.auth != null);

                    if (!req.authenticated) {
                        throw new HttpResponseError(403, 'FORBIDDEN', 'You should be authenticated on a Firebase Auth account that have this/these custom claims: ' + customClaims);
                    }
                    for(let claim of customClaims){
                        if((req.auth!.customClaims ?? {})[claim]){
                            return;
                        }
                    }
                    throw new HttpResponseError(403, 'FORBIDDEN', `Only ${customClaims.toString().replace(/,/g, ', ')} can access`);
                }
            };
            try {
                checkCustomClaim();
                // noinspection ES6RedundantAwait
                await Promise.resolve(requestHandler(req,res,next));
            } catch (e){
                const userInfo = !req.auth?.uid?.length ? '' : ` uid: ${req.auth.uid}`;

                if(e instanceof HttpResponseError){
                    logWarn(`[${req.method.toUpperCase()}] ${req.path}${userInfo} - ${e.internalLog}`);
                    res.statusCode = e.status;
                    res.send(
                        new ErrorResponseBody({
                            status: e.status,
                            code: e.code,
                            description: e.description,
                        })
                    );
                    next();
                    return;
                }

                logError(`[${req.method.toUpperCase()}] ${req.path}${userInfo}`);
                logError(e.stack);
                res.statusCode = 500;
                res.send(
                    new ErrorResponseBody({
                        status: 500,
                        code: 'INTERNAL_ERROR',
                        description: 'An internal error occurred, please contact support',
                    })
                );
                next();
            }
        };
    };
}