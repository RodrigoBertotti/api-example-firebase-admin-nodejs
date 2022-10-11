import {ProductEntity} from "../entities/product-entity";
import {db} from "./db";
import {serializeFS} from "../utils/serialize-firestore";
import {firestore} from "firebase-admin";
import FieldValue = firestore.FieldValue;
import Timestamp = firestore.Timestamp;

export class ProductsRepository {
    
    async getProductById(productId:string) : Promise<ProductEntity|null> {
        const productRes = await db().collection('products').doc(productId).get();
        if(!productRes.exists){
            return null;
        }
        return Object.assign(ProductEntity.empty(), productRes.data()!);
    }

    async createProductById(storeOwnerUid: string, name: string, price: number, stockQuantity:number, internalCode:string) : Promise<ProductEntity>{
        const productsCollection = db().collection('products');
        const nextId = (await productsCollection.get()).size + 1 + '';
        const ref = productsCollection.doc(nextId);
        const data = new ProductEntity(storeOwnerUid, nextId, name, price, stockQuantity, internalCode, Timestamp.now());
        await ref.set(serializeFS(data));
        return data;
    }

    async getProducts() : Promise<ProductEntity[]> {
        const snapshot = await db().collection('products').get();
        return snapshot.docs.map((doc) => Object.assign(ProductEntity.empty(), doc.data()));
    }
}

export const productsRepository = new ProductsRepository();