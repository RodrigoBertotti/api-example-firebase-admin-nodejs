import {DecodedIdToken, UserRecord} from "firebase-admin/lib/auth";

export type CacheOfFunction = typeof _CacheOfFunctionType;

function _CacheOfFunctionType<T, TProducer extends Producer<T>>(cacheId:string, generateCacheIfIsNeeded?: TProducer, oldCache?: 'use-old-cache'|'override-cache'): TProducer {
    throw 'TYPE ONLY (implementation is other file)';
}

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
             * Caches the result of a function based on the `cacheId` param.
             * Helps to avoid perfoming multiple identical queries to the repository on the same request handler
             *  */
            cacheOf: CacheOfFunction,

            /**
             * Invalidate a cache based on the `cacheId` param
             *
             * This will not affect the other requests.
             * */
            invalidateCache: (cacheId:string) => void,
        }
    }
}