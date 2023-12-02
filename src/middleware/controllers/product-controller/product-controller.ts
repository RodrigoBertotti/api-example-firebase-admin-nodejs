import {Controller, HttpServer} from "../index";
import {NextFunction, Request, RequestHandler, Response} from "express";
import {productsService} from "../../../services/products-service";
import {HttpResponseError} from "../../../utils/http-response-error";
import {Product} from "../../../data/product";
import {ProductClientModel} from "../../../data/models/product/client/product-client-model";
import {PartialProductClientModel} from "../../../data/models/product/client/partial-product-client-model";
import {logInfo} from "../../../utils/logger";


export class ProductController implements Controller {

    initialize(httpServer: HttpServer,): void {
        httpServer.post('/product', this.createProduct.bind(this), ['storeOwner']);

        /** If claims are equal to ['buyer', 'storeOwner'], that means the same as "authenticated" */
        /** But if claims are undefined or [], that means that also unauthenticated users can access */
        httpServer.get ('/all-products-public', this.getProductListPublic.bind(this), ['buyer', 'storeOwner']);
        httpServer.get ('/product/:productId', this.getProductByIdPublic.bind(this), ['authenticated']);

        httpServer.get ('/product/:productId/full-details', this.getProductByIdFull.bind(this), ['storeOwner']);
        httpServer.put ('/product/:productId', this.updateProductById.bind(this), ['storeOwner']);
    }

    private readonly createProduct: RequestHandler = async (req, res, next,) => {
        const productFromInput: Product = ProductClientModel.validate(req.body, req.auth.uid);
        const product = await productsService.createProduct(productFromInput);
        const output = ProductClientModel.fromEntity(product).toBodyFullProduct();
        res.send(output);
        next();
    }

    private readonly getProductListPublic: RequestHandler = async (req, res, next) => {
        const products = await productsService.getProducts();
        const outputList = products.map(product => ProductClientModel.fromEntity(product).toBodyPublicProduct());
        res.send({
            "products": outputList
        })
        next();
    }

    private readonly getProductByIdPublic: RequestHandler = async (req, res, next,) => {
        // No need to check if the user has permission
        return this.handleGetProductById(req,res, next, (product) => ProductClientModel.fromEntity(product).toBodyPublicProduct());
    }

    private readonly getProductByIdFull: RequestHandler = async (req, res, next,) => {
        return this.handleGetProductById(req,res, next, (product) => {
            // Checking if the user has permission
            if (product.storeOwnerUid != req.auth!.uid) {
                //Even though the client is a storeOwner, he is an owner of another store, so he can't see full details of this product
                throw new HttpResponseError(403, 'FORBIDDEN', `You aren't the correct storeOwner`);
            }
            return ProductClientModel.fromEntity(product).toBodyFullProduct();
        });
    }

    private async handleGetProductById(req:Request, res:Response, next:NextFunction, toOutput:((product:Product) => any)) {
        if(!req.params['productId']?.length){
            throw new HttpResponseError(400, 'BAD_REQUEST', 'Please, inform a productId on the route');
        }
        const product = await productsService.getProductById(req.params['productId']);
        if (product == null) {
            throw new HttpResponseError(404, 'NOT_FOUND', 'Product ID '+req.params['productId'] + ' was not found');
        }
        res.send(toOutput(product));
        next();
    }

    private readonly updateProductById: RequestHandler = async (req, res, next,) => {
        if (!req.params['productId']?.length) throw new HttpResponseError(400, 'BAD_REQUEST', 'Please, inform the "productId" as parameter')
        const partialProduct = PartialProductClientModel.validate(req.body);

        const product = await productsService.getProductById(req.params['productId']);
        if(product == null){
            throw new HttpResponseError(404, 'NOT_FOUND', 'Product ID '+req.params['productId'] + ' not found');
        }

        // Checking if the user has permission
        if (product.storeOwnerUid != req.auth!.uid) {
            //Even though the client is a storeOwner, he is an owner of another store, so he can't update this product
            throw new HttpResponseError(403, 'FORBIDDEN', `You aren't the correct storeOwner`);
        }
        await productsService.updateProductById(req.params['productId'], partialProduct);

        // After the product is updated, we can call handleGetProductById
        return this.handleGetProductById(req, res, next, (data) => ProductClientModel.fromEntity(data).toBodyFullProduct());
    }
}
