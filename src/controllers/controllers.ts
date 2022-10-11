import {RootController} from "./root-controller";
import {ProductController} from "./product-controller/product-controller";
import {AccountController} from "./account-controller/account-controller";
import {Controller} from "./index";


/** TODO: Set yours controllers here: */
export const CONTROLLERS:Array<Controller> = [
    new RootController(),
    new ProductController(),
    new AccountController(),
];