import {ProductResumedRes} from "./product-resumed-res";


export class ProductsListResumedRes {
    constructor(
       public readonly products:ProductResumedRes[]
    ) {}
}