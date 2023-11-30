import {NextFunction, Request, Response} from "express";
import * as admin from "firebase-admin";
import assert from "node:assert";
import {MyClaims} from "../../index";
import {ErrorResponseBody} from "../../utils/http-response-error";
import {logError} from "../../utils/logger";


export const verifyValidFirebaseUidTokenInterceptor =  ((req:Request, res:Response, next:NextFunction) => {
    const firebaseAuthToken:string | undefined = (req.headers['idToken']?.length ? req.headers['idToken'] : req.headers['idtoken'])?.toString();

    if (!firebaseAuthToken?.length) {
        req.authenticated = false;
        req.claims!['authenticated' as MyClaims] = false;
        next();
        return;
    }

    let finished = false;

    const timeout = setTimeout(() => {
        if(!finished) {
            finished = true;
            res.status(401).send(new ErrorResponseBody({
                status: 401,
                code: 'UNAUTHORIZED',
                description: "Invalid 'idToken' token (timeout)",
            }));
        }
    }, 4000);

    admin.auth().verifyIdToken(firebaseAuthToken, true).then(async (decoded) => {
        if(!finished){
            finished = true;

            req.authenticated = true;
            req.auth = (await admin.auth().getUser(decoded.uid));
            req.token = decoded;
            req.claims = req.auth!.customClaims ?? {}; // same object reference as Firebase
            req.claims['authenticated' as MyClaims] = true;

            assert(req.auth!.customClaims!['authenticated'] == true);
            assert(req.auth != null);
            assert(req.token != null);

            next();
        }
        clearTimeout(timeout);
    }, (reason) => {
        logError(`Invalid 'idToken' token: ${reason}`);
        if(!finished){
            finished = true;
            res.status(401).send(new ErrorResponseBody({
                status: 401,
                code: 'UNAUTHORIZED',
                description: "Invalid 'idToken' token"
            }));
        }
        clearTimeout(timeout);
    });
});
