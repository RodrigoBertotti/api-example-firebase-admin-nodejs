import {Product} from "../../../product";
import {firestore} from "firebase-admin";
import FieldValue = firestore.FieldValue;
import Timestamp = firestore.Timestamp;


export class ProductFirestoreModel extends Product {
    static kProductId = "productId";
    static kCreatedAt = "createdAt";
    static kStoreOwnerUid = "storeOwnerUid";
    static kName = "name";
    static kPrice = "price";
    static kStockQuantity = "stockQuantity";
    static kInternalCode = "internalCode";

    static fromEntity(product?: Product): ProductFirestoreModel | null {
        if (product == null) return null;
        return Object.assign(ProductFirestoreModel.empty(), product);
    }

    static empty() {
        return new ProductFirestoreModel('','','',0,0,'', new Date());
    }

    toDocumentData(productId?: string, createdAt?: FirebaseFirestore.Timestamp| FieldValue) {
        return {
            [ProductFirestoreModel.kProductId]: productId ?? this.productId,
            [ProductFirestoreModel.kCreatedAt]: createdAt ?? this.createdAt,
            [ProductFirestoreModel.kStoreOwnerUid]: this.storeOwnerUid,
            [ProductFirestoreModel.kName]: this.name,
            [ProductFirestoreModel.kPrice]: this.price,
            [ProductFirestoreModel.kStockQuantity]: this.stockQuantity,
            [ProductFirestoreModel.kInternalCode]: this.internalCode,
        }
    }

    static fromDocumentData(data: FirebaseFirestore.DocumentData) {
        return new ProductFirestoreModel(
            data[ProductFirestoreModel.kProductId],
            data[ProductFirestoreModel.kStoreOwnerUid],
            data[ProductFirestoreModel.kName],
            data[ProductFirestoreModel.kPrice],
            data[ProductFirestoreModel.kStockQuantity],
            data[ProductFirestoreModel.kInternalCode],
            (data[ProductFirestoreModel.kCreatedAt] as Timestamp).toDate(),
        )
    }
}
