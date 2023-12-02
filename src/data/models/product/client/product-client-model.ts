import {Product} from "../../../product";
import {
    validateInternalCode,
    validateProductName,
    validateProductPrice,
    validateStockQuantity
} from "./validators";


export class ProductClientModel extends Product {
    static kProductId = "productId";
    static kStoreOwnerUid = "storeOwnerUid";
    static kName = "name";
    static kPrice = "price";
    static kStockQuantity = "stockQuantity";
    static kInternalCode = "internalCode";
    static kCreatedAtMillisecondsSinceEpoch = "createdAtMillisecondsSinceEpoch";

    static fromEntity (product: Product): ProductClientModel {
        return Object.assign(ProductClientModel.empty(), product);
    }

    static empty() {
        return new ProductClientModel('','','',0,0,'', new Date());
    }

    private static _validate(body: any) {
        validateProductName(body[ProductClientModel.kName]);
        validateProductPrice(body[ProductClientModel.kPrice]);
        validateStockQuantity(body[ProductClientModel.kStockQuantity]);
        validateInternalCode(body[ProductClientModel.kInternalCode]);
    }

    static validate (body: any, storeOwnerUid: string) : ProductClientModel {
        this._validate(body);
        return new ProductClientModel(
            null,
            storeOwnerUid,
            body[ProductClientModel.kName],
            body[ProductClientModel.kPrice],
            body[ProductClientModel.kStockQuantity],
            body[ProductClientModel.kInternalCode],
            null,
        );
    }

    toBodyFullProduct() {
        return {
            ...this.toBodyPublicProduct(),
            [ProductClientModel.kStockQuantity]: this.stockQuantity,
            [ProductClientModel.kInternalCode]: this.internalCode,
            [ProductClientModel.kCreatedAtMillisecondsSinceEpoch]: this.createdAt.getTime(),
        }
    }
    toBodyPublicProduct() {
        return {
            [ProductClientModel.kProductId]: this.productId,
            [ProductClientModel.kStoreOwnerUid]: this.storeOwnerUid,
            [ProductClientModel.kName]: this.name,
            [ProductClientModel.kPrice]: this.price,
        }
    }
}
