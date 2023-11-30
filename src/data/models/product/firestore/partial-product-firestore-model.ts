import {Product} from "../../../product";
import {ProductFirestoreModel} from "./product-firestore-model";


export class PartialProductFirestoreModel extends Product {

    static fromEntity(partialProduct: Partial<Record<keyof Product, any>>) {
        return {
            ...partialProduct,
            toDocumentData () : Partial<Record<keyof Product, any>> {
                const res: Partial<Record<keyof Product, any>> = {};
                if (partialProduct.name) res[ProductFirestoreModel.kName] = partialProduct.name;
                if (partialProduct.price) res[ProductFirestoreModel.kPrice] = partialProduct.price;
                if (partialProduct.stockQuantity) res[ProductFirestoreModel.kStockQuantity] = partialProduct.stockQuantity;
                if (partialProduct.internalCode) res[ProductFirestoreModel.kInternalCode] = partialProduct.internalCode;
                return res;
            }
        }
    }

}
