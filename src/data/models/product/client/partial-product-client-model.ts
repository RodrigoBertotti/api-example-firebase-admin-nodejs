import {Product} from "../../../product";
import {
    validateInternalCode,
    validateProductName,
    validateProductPrice,
    validateStockQuantity
} from "./validators";
import {ProductClientModel} from "./product-client-model";


export class PartialProductClientModel {
    private static _validate(body:any) {
        if (body[ProductClientModel.kName]) validateProductName(body[ProductClientModel.kName]);
        if (body[ProductClientModel.kPrice]) validateProductPrice(body[ProductClientModel.kPrice]);
        if (body[ProductClientModel.kStockQuantity]) validateStockQuantity(body[ProductClientModel.kStockQuantity]);
        if (body[ProductClientModel.kInternalCode]) validateInternalCode(body[ProductClientModel.kInternalCode])
    }

    static validate (body:any) : Partial<Record<keyof Product, any>> {
        this._validate(body);
        const res: Partial<Record<keyof Product, any>> = {};
        if (body[ProductClientModel.kName]) res.name = body[ProductClientModel.kName];
        if (body[ProductClientModel.kPrice]) res.price = body[ProductClientModel.kPrice];
        if (body[ProductClientModel.kStockQuantity]) res.stockQuantity = body[ProductClientModel.kStockQuantity];
        if (body[ProductClientModel.kInternalCode]) res.internalCode = body[ProductClientModel.kInternalCode];
        return res;
    }

}
