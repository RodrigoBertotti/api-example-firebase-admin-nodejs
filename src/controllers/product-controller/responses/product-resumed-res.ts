import {ProductEntity} from "../../../entities/product-entity";


export class ProductResumedRes {
    public readonly id:string;
    public readonly name:string;
    public readonly price:number;

    constructor(data:ProductEntity) {
        this.id = data.productId;
        this.name = data.name;
        this.price = data.price;
    }
}