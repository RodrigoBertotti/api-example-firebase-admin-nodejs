import {firestore} from "firebase-admin";

/** Serializes a value to a valid Firestore Document data, including object and its childs and Array and its items */
export function serializeFS(value) {
    const isDate = (value) => {
        if(value instanceof Date || value instanceof firestore.Timestamp){
            return true;
        }
        try {
            if(value.toDate() instanceof Date){
                return true;
            }
        } catch (e){}

        return false;
    }

    if(value == null){
        return null;
    }
    if(
        typeof value == "boolean" ||
        typeof value == "bigint" ||
        typeof value == "string" ||
        typeof value == "symbol" ||
        typeof value == "number" ||
        isDate(value) ||
        value instanceof firestore.FieldValue
    ) {
        return value;
    }

    if(Array.isArray(value)){
        return (value as Array<any>).map((v) => serializeFS(v));
    }

    const res = {};
    for(const key of Object.keys(value)){
        res[key] = serializeFS(value[key]);
    }
    return res;
}

