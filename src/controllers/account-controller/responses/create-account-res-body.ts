import {auth} from "firebase-admin";
import UserRecord = auth.UserRecord;


export class CreateAccountResBody {
    public readonly status;
    public readonly uid;

    public readonly tutorial = "Success!!! Next steps: In your client side (Flutter or JavaScript), you should 'signInWithEmailAndPassword'. After, set the header 'auth-token' with the result of the 'getIdToken' function that is on the Firebase Authentication package for client side";

    constructor(
        user:UserRecord
    ) {
        this.uid = user.uid;
        this.status = 'USER_CREATED_SUCCESSFULLY';
    }

}