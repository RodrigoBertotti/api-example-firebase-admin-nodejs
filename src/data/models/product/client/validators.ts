import {HttpResponseError} from "../../../../utils/http-response-error";


export function validateProductName(name) {
    if (!name?.length) {
        throw new HttpResponseError(400, 'BAD_REQUEST', 'No "name" defined');
    }
}
export function validateProductPrice(price) {
    if (!price || price < 0) {
        throw new HttpResponseError(400, 'BAD_REQUEST', 'Invalid "price"');
    }
}
export function validateStockQuantity(stockQuantity) {
    if (!stockQuantity || stockQuantity < 0) {
        throw new HttpResponseError(400, 'BAD_REQUEST', 'Invalid "stockQuantity"');
    }
    if (typeof stockQuantity != "number") {
        throw new HttpResponseError(400, 'BAD_REQUEST', '"stockQuantity" should be an integer');
    }
}
export function validateInternalCode(internalCode) {
    if(!internalCode?.length) {
        throw new HttpResponseError(400, 'BAD_REQUEST', 'Invalid "internalCode"');
    }
}
