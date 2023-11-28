import {Controller, HttpServer} from "../index";
import {ProductResumedRes} from "./responses/product-resumed-res";
import {ProductFullRes} from "./responses/product-full-res";
import {NextFunction, Request, RequestHandler, Response} from "express";
import {ProductEntity} from "../../entities/product-entity";
import {CreateProductReqBody} from "./requests/create-product/create-product-req-body";
import {productsRepository} from "../../repository/products-repository";
import {HttpResponseError} from "../../utils/http-response-error";
import {ProductsListResumedRes} from "./responses/products-list-resumed-res";
import {checkIfIsValidCreateProductReqBody} from "./requests/create-product/create-product-validation";


export class ProductController implements Controller {

    initialize(httpServer: HttpServer,): void {
        httpServer.post('/product', this.createProduct.bind(this), ['storeOwner']);
        httpServer.get ('/all-products-resumed', this.getProductListPublic.bind(this), ['buyer', 'storeOwner']);
        httpServer.get ('/product/:productId', this.getProductByIdPublic.bind(this), ['buyer', 'storeOwner']);
        httpServer.get ('/product/:productId/full-details', this.getProductByIdFull.bind(this), ['storeOwner']);
    }

    private readonly createProduct: RequestHandler = async (req, res, next,) => {
        const reqBody:CreateProductReqBody = Object.assign({}, req.body);

        checkIfIsValidCreateProductReqBody(reqBody);

        const product = await productsRepository.createProductById(
            req.auth!.uid,
            reqBody.name,
            reqBody.price,
            reqBody.stockQuantity,
            reqBody.internalCode,
        );
        res.send(new ProductFullRes(product));
        next();
    }

    private readonly getProductListPublic: RequestHandler = async (req, res, next) => {
        const products = await productsRepository.getProducts();
        const responseList = products.map(prod => new ProductResumedRes(prod));
        res.send(new ProductsListResumedRes(responseList))
        next();
    }

    private readonly getProductByIdPublic: RequestHandler = async (req, res, next,) => {
        return this.handleGetProductById(req,res, next, (data) => new ProductResumedRes(data));
    }

    private readonly getProductByIdFull: RequestHandler = async (req, res, next,) => {
        const getProductByIdCached = req.cacheOf(req.params['productId'], productsRepository.getProductById);
        const product = await getProductByIdCached(req.params['productId']);
        if(product == null){
            throw new HttpResponseError(404, 'NOT_FOUND', 'Product ID '+req.params['productId'] + ' not found');
        }
        if (product.storeOwnerUid != req.auth!.uid) {
            //Even though the client is a storeOwner, he is an owner of another store, so he can't see full details of this product`
            throw new HttpResponseError(403, 'FORBIDDEN', `You aren't the correct storeOwner`);
        }
        return this.handleGetProductById(req,res, next, (data) => new ProductFullRes(data));
    }

    private async handleGetProductById(req:Request, res:Response, next:NextFunction, onSuccess:((product:ProductEntity) => any)) {
        if(!req.params['productId']?.length){
            throw new HttpResponseError(400, 'BAD_REQUEST', 'Please, inform a productId on the route');
        }

        // If there's a cache: it will use the cache, otherwise: it will wait for the getProductById result and cache it
        const getProductByIdCached = req.cacheOf(req.params['productId'], productsRepository.getProductById);
        const product = await getProductByIdCached(req.params['productId']);

        if (product == null) {
            throw new HttpResponseError(404, 'NOT_FOUND', 'Product ID '+req.params['productId'] + ' not found');
        }
        res.send(onSuccess(product));
        next();
    }
}
