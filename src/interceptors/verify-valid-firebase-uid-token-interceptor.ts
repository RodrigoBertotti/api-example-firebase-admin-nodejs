import {NextFunction, Request, Response} from "express";
import * as admin from "firebase-admin";
import assert from "node:assert";
import {ErrorResponseBody} from "../utils/http-response-error";


export const verifyValidFirebaseUidTokenInterceptor =  ((req:Request, res:Response, next:NextFunction) => {
    const authorizationHeaderValue:string | undefined = (req.headers['Authorization']?.length ? req.headers['Authorization'] : req.headers['authorization'])?.toString();
    if (!authorizationHeaderValue?.length) {
        req.authenticated = false;
        next();
        return;
    }

    let finished = false;

    setTimeout(() => {
        if(!finished) {
            finished = true;
            res.status(401).send(new ErrorResponseBody({
                status: 401,
                code: 'UNAUTHORIZED',
                description: "Invalid 'Authorization' token (timeout)",
            }));
        }
    }, 2500);

    if (authorizationHeaderValue.startsWith("Bearer ")) {
        const firebaseAuthToken:string = authorizationHeaderValue.substring("Bearer ".length);
        admin.auth().verifyIdToken(firebaseAuthToken, true).then(async (decoded) => {
            if(!finished){
                finished = true;

                req.authenticated = true;
                req.auth = (await admin.auth().getUser(decoded.uid));
                req.token = decoded;

                assert(req.auth != null);
                assert(req.token != null);

                next();
            }
        }, (reason) => {
            console.error(`Invalid 'Authorization' token: ${reason}`);
            if(!finished){
                finished = true;
                res.status(401).send(new ErrorResponseBody({
                    status: 401,
                    code: 'UNAUTHORIZED',
                    description: "Invalid 'Authorization' token"
                }));
            }
        });
    } else {
        res.status(400).send(new ErrorResponseBody({
            status: 400,
            code: 'BAD_REQUEST',
            description: "Invalid 'Authorization' header value, should be: 'Bearer <token>'"
        }));
    }
});