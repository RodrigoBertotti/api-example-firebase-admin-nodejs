import {NextFunction, Request, Response} from "express";
import {randomString} from "../utils/random";
import {logDebug} from "../utils/logger";

type Producer<T> = (...args: any[]) => Promise<T>;

const noDataFlag = 'no_data_internal_flag_'+randomString(10);

export const instantiateCacheInterceptor = ((req:Request, res:Response, next:NextFunction) => {
    const _reqCacheKey = '_internal_cache_of_functions';
    req[_reqCacheKey] = {};

    req.cacheOf = <T, TProducer extends Producer<T>>(cacheId:string, generateCacheIfIsNeeded?: TProducer): TProducer => {
        /** Modified from https://stackoverflow.com/a/60666008/4508758 */
        const wrapper = (...args: Parameters<TProducer>): Promise<T> => {
            if (!req[_reqCacheKey][cacheId]) {
                if(generateCacheIfIsNeeded == null){
                    throw Error("There's no cache for cacheId '" + cacheId + "' and 'generateCacheIfIsNeeded' is null");
                }
                req[_reqCacheKey][cacheId] = (generateCacheIfIsNeeded(...args)) ?? noDataFlag;
                logDebug('Obtained a new cache');
            } else {
                logDebug('Didn\'t obtained a new cache');
            }
            const res = req[_reqCacheKey][cacheId];
            if (res == noDataFlag) {
                return Promise.resolve(null as any);
            }
            return res;
        };
        return wrapper as TProducer;
    };
    req.invalidateCache = (cacheId:string) => {
        delete req[_reqCacheKey][cacheId];
    };
    next();
});