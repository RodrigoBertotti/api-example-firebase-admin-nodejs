import {Product} from "../data/product";
import {firestore} from "firebase-admin";
import * as admin from "firebase-admin";
import {ProductFirestoreModel} from "../data/models/product/firestore/product-firestore-model";
import FieldValue = firestore.FieldValue;
import {PartialProductFirestoreModel} from "../data/models/product/firestore/partial-product-firestore-model";


export class ProductsService {
    private collection () {
        return admin.firestore().collection("products");
    }
    private doc (productId?:string) {
        if (!productId) return this.collection().doc();
        return this.collection().doc(productId);
    }

    async getProductById(productId:string) : Promise<Product|null> {
        const productRes = await this.doc(productId).get();
        if(!productRes.exists){
            return null;
        }
        return ProductFirestoreModel.fromDocumentData(productRes.data());
    }

    async createProduct(product:Product) : Promise<Product>{
        const productRef = this.doc();
        const data = ProductFirestoreModel.fromEntity(product).toDocumentData(productRef.id, FieldValue.serverTimestamp());
        await productRef.set(data);
        return ProductFirestoreModel.fromDocumentData((await productRef.get()).data());
    }

    async getProducts() : Promise<Product[]> {
        const snapshot = await this.collection().get();
        return snapshot.docs.map((doc) => ProductFirestoreModel.fromDocumentData(doc.data()));
    }

    async updateProductById(productId: string, partialProduct: Partial<Record<keyof Product, any>>): Promise<void> {
        const documentData = PartialProductFirestoreModel.fromPartialEntity(partialProduct).toDocumentData();
        await this.doc(productId).update(documentData);
    }
}

export const productsService = new ProductsService();
