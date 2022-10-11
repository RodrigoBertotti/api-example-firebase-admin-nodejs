import {ProductEntity} from "../../../entities/product-entity";
import {ProductResumedRes} from "./product-resumed-res";
import {firestore} from "firebase-admin";
import Timestamp = firestore.Timestamp;


export class ProductFullRes extends ProductResumedRes {

    public readonly internalCode:string;
    public readonly stockQuantity:number;
    public readonly createdAtMillis:number;

    constructor(data:ProductEntity) {
        super(data);
        this.internalCode = data.internalCode;
        this.stockQuantity = data.stockQuantity;
        this.createdAtMillis = data.createdAt.toMillis();
    }

}