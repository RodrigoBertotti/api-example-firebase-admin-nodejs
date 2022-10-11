import {Express, Request, Response, IRouterHandler, NextFunction} from "express";
import {verifyValidFirebaseUidTokenInterceptor} from "./verify-valid-firebase-uid-token-interceptor";
import {instantiateCacheInterceptor} from "./instantiate-cache-interceptor";


export const interceptors:Array<(req:Request,res:Response,next:NextFunction) => void> = [
    instantiateCacheInterceptor,
    verifyValidFirebaseUidTokenInterceptor,
];
