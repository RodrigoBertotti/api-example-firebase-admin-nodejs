import {NextFunction, Request, Response} from "express";
import * as admin from "firebase-admin";
import {HttpResponseError} from "../utils/http-response-error";
import assert from "node:assert";


export const verifyValidFirebaseUidTokenInterceptor =  ((req:Request, res:Response, next:NextFunction) => {
    return new Promise<void>((resolve, reject) => {
        const firebaseAuthToken = req.headers['auth-token'] as string;
        if(!firebaseAuthToken?.length){
            req.authenticated = false;
            next();
            resolve();
            return;
        }

        let finished = false;

        setTimeout(() => {
            if(!finished) {
                req.authenticated = false;
                finished = true;
                reject(new HttpResponseError(401, 'UNAUTHORIZED', `admin.auth().verifyIdToken(..) took more than 2 seconds without a response`));
            }
        }, 2500);

        admin.auth().verifyIdToken(firebaseAuthToken, true).then(async (decoded) => {
            if(!finished){
                finished = true;

                req.authenticated = true;
                req.auth = (await admin.auth().getUser(decoded.uid));
                req.token = decoded;

                assert(req.auth != null);
                assert(req.token != null);

                next();
                resolve();
            }
        }, (reason) => {
            if(!finished){
                finished = true;
                reject(new HttpResponseError(401, 'UNAUTHORIZED', `admin.auth().verifyIdToken(..) failed: ${reason}`));
            }
        });
    });
});