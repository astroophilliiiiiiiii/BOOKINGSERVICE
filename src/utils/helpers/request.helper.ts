import { AsyncLocalStorage } from "node:async_hooks";

type AsyncLocalStorageType = {
    correlationId : string , 
}

export const asyncLocalStorage = new AsyncLocalStorage<AsyncLocalStorageType>() ; // ek instance bnaadiyaa 

export const getCorrelationId = ()=>{
    const asyncStore = asyncLocalStorage.getStore() ; 
    return asyncStore? asyncStore.correlationId : "unknown-error-while-fetching-correlation-id"
}
