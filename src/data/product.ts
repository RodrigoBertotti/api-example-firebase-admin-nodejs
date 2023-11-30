import {firestore} from "firebase-admin";
import Timestamp = firestore.Timestamp;
import FieldValue = firestore.FieldValue;

export class Product {
    constructor(
        public readonly productId:string | undefined,
        public readonly storeOwnerUid:string,
        public readonly name: string,
        public readonly price: number,

        public readonly stockQuantity: number,
        public readonly internalCode: string,
        public readonly createdAt:Date,
    ) {}

    static empty() {
        return new Product('','','',0,0,'', new Date());
    }
}
