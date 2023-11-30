import {User} from "../../../user";
import {
    validateUserBirthDate,
    validateUserEmail,
    validateUserName,
    validateUserPassword,
    validateUserRole
} from "./validators";


export class UserClientModel extends User {
    static kUid = 'uid';
    static kName = 'name';
    static kRole = 'role';
    static kEmail = 'email';
    static kPassword = 'password';
    static kBirthDateMillisecondsSinceEpoch = 'birthDateMillisecondsSinceEpoch';

    static fromEntity(entity: User): UserClientModel {
        return Object.assign(UserClientModel.empty(), entity);
    }

    static empty() : UserClientModel {
        return new UserClientModel('','','' as any,'', new Date());
    }

    toBody() {
        return {
            [UserClientModel.kUid]: this.uid,
            [UserClientModel.kName]: this.name,
            [UserClientModel.kRole]: this.role,
            [UserClientModel.kEmail]: this.email,
            [UserClientModel.kBirthDateMillisecondsSinceEpoch]: this.birthDate.getTime(),
        };
    }

    static fromBody(body: any): UserClientModel & { password: string } {
        validateUserName(body[UserClientModel.kName]);
        validateUserEmail(body[UserClientModel.kEmail]);
        validateUserRole(body[UserClientModel.kRole]);
        validateUserBirthDate(body[UserClientModel.kBirthDateMillisecondsSinceEpoch]);
        validateUserPassword(body[UserClientModel.kPassword]);

        return Object.assign(
            new UserClientModel(
                null,
                body[UserClientModel.kName],
                body[UserClientModel.kRole],
                body[UserClientModel.kEmail],
                new Date(body[UserClientModel.kBirthDateMillisecondsSinceEpoch]),
            ),
            {  password: body[UserClientModel.kPassword], }
        )
    }

}
