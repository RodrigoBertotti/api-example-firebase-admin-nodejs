import {NextFunction, Request, Response} from "express";
import * as admin from "firebase-admin";
import assert from "node:assert";
import {MyClaims} from "../../index";
import {ErrorResponseBody} from "../../utils/http-response-error";
import {logError} from "../../utils/logger";


const _idToken = (req:Request) => {
    const authorizationHeaderValue:string | undefined = (req.headers['Authorization']?.length ? req.headers['Authorization'] : req.headers['authorization'])?.toString();
    if (!authorizationHeaderValue?.length || authorizationHeaderValue.length <= 16) {
        return null;
    }
    if (authorizationHeaderValue?.toLowerCase()?.startsWith('bearer ')){
        return authorizationHeaderValue.substring('bearer '.length);
    }
    return authorizationHeaderValue;
}

export const verifyValidFirebaseUidTokenInterceptor =  ((req:Request, res:Response, next:NextFunction) => {
    const idToken = _idToken(req);

    if (!idToken?.length) {
        req.authenticated = false;
        req.claims!['authenticated' as MyClaims] = false;
        next();
        return;
    }

    let finished = false;

    const timeout = setTimeout(() => {
        if(!finished) {
            finished = true;
            logError(`Invalid Firebase ID Token on 'Authorization' header (TIMEOUT)`);
            res.status(401).send(new ErrorResponseBody({
                status: 401,
                code: 'UNAUTHORIZED',
                description: "Invalid Firebase ID Token on 'Authorization' header (TIMEOUT)",
            }));
        }
    }, 4000);

    admin.auth().verifyIdToken(idToken, true).then(async (decoded) => {
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
        logError(`Invalid Firebase ID Token on 'Authorization' header: ${reason}`);
        if(!finished){
            finished = true;
            res.status(401).send(new ErrorResponseBody({
                status: 401,
                code: 'UNAUTHORIZED',
                description: "Invalid Firebase ID Token on 'Authorization' header"
            }));
        }
        clearTimeout(timeout);
    });
});
