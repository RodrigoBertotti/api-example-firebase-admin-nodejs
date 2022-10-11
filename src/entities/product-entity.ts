import {firestore} from "firebase-admin";
import Timestamp = firestore.Timestamp;
import FieldValue = firestore.FieldValue;

export class ProductEntity {

    constructor(
        public readonly storeOwnerUid:string,
        public readonly productId:string,
        public readonly name: string,
        public readonly price: number,

        public readonly stockQuantity: number,
        public readonly internalCode: string,
        public readonly createdAt:Timestamp,
    ) {}

    static empty() {
        return new ProductEntity('','','',0,0,'', Timestamp.now());
    }
}