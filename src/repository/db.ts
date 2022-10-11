import {firestore} from "firebase-admin";
import * as admin from "firebase-admin";


export function db () : firestore.Firestore {
    return admin.firestore();
}