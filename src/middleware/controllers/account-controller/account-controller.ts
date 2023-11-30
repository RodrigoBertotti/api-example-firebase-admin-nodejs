import {Controller, HttpServer} from "../index";
import {RequestHandler} from "express";
import {accountsService} from "../../../services/accounts-service";
import {UserClientModel} from "../../../data/models/user/client/user-client-model";


export class AccountController implements Controller {

    initialize(httpServer: HttpServer): void {
        httpServer.post ('/account', this.createAccount.bind(this));
    }

    private readonly createAccount: RequestHandler = async (req, res, next,) => {
        const input: UserClientModel & { password: string } = UserClientModel.fromBody(req.body);
        const refreshedUser = await accountsService.createAccount(input, input.password);

        res.send({
            "user": UserClientModel.fromEntity(refreshedUser).toBody(),
        });
        next();
    }
}

