import {CreateAccountReqBody} from "./create-account-req-body";
import {HttpResponseError} from "../../../../utils/http-response-error";
import {validateEmail} from "../../../../utils/validators";

export function checkIfIsValidCreateAccountReqBody(body:CreateAccountReqBody) {
    if(!body?.name?.length)
        throw new HttpResponseError(400, 'BAD_REQUEST', 'Invalid "name"');

    if(!validateEmail(body?.email))
        throw new HttpResponseError(400, 'BAD_REQUEST', 'Invalid "email"');

    if(!body?.password?.length || body.password.length < 6)
        throw new HttpResponseError(400, 'BAD_REQUEST', 'Invalid "password"');

    if(body?.role != 'storeOwner' && body.role != 'buyer')
        throw new HttpResponseError(400, 'BAD_REQUEST', 'Invalid "role", neither "storeOwner" or "buyer"');
}