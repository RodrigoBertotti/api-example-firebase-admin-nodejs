import {DecodedIdToken, UserRecord} from "firebase-admin/lib/auth";
import {MyClaims} from "../index";


declare global {
    namespace Express {
        interface Request {
            /** Indicates whether the user is authenticated on Firebase Authentication */
            authenticated: boolean,

            /** If authenticated: Contains user data of Firebase Authentication.  */
            auth?:UserRecord,

            /** If authenticated: Contains token data of Firebase Authentication. */
            token?: DecodedIdToken,

            /**
             * Refers to the claims from the user that is performing the request,
             * if the user is authenticated with Firebase, this object also includes the claims from `auth.claims` */
            claims?: {
                [MyClaims]: true | undefined,
            }
        }
    }
}
