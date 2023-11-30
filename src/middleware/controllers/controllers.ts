import {RootController} from "./root-controller";
import {AccountController} from "./account-controller/account-controller";
import {Controller} from "./index";
import {ProductController} from "./product-controller/product-controller";


export const getControllers = () : Array<Controller> => [
    new RootController(),
    new ProductController(),
    new AccountController(),
];
