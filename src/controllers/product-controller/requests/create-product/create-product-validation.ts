import {CreateProductReqBody} from "./create-product-req-body";
import {HttpResponseError} from "../../../../utils/http-response-error";


export function checkIfIsValidCreateProductReqBody(body:CreateProductReqBody) {
    if(!body?.name.length)
        throw new HttpResponseError(400, 'BAD_REQUEST', 'No "name" defined');

    if(!body?.price || body.price < 0)
        throw new HttpResponseError(400, 'BAD_REQUEST', 'Invalid "price"');

    if(!body?.stockQuantity || body.stockQuantity < 0)
        throw new HttpResponseError(400, 'BAD_REQUEST', 'Invalid "stockQuantity"');

    if(!body?.internalCode?.length)
        throw new HttpResponseError(400, 'BAD_REQUEST', 'Invalid "internalCode"');
}