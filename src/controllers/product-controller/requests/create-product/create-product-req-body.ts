

export type CreateProductReqBody = {
    // public:
    name:string;
    price:number;

    // only store owners have access:
    stockQuantity:number;
    internalCode:string;
}