import {User} from "../../../user";

export class UserFirestoreModel extends User {
    static kUid = 'uid';
    static kName = 'name';
    static kRole = 'role';
    static kEmail = 'email';
    static kBirthDate = 'birthDate';

    static fromEntity(entity: User): UserFirestoreModel {
        return Object.assign(UserFirestoreModel.empty(), entity);
    }

    static empty() : UserFirestoreModel {
        return new UserFirestoreModel('','','' as any,'', new Date());
    }

    toDocumentData() {
        return {
            [UserFirestoreModel.kUid]: this.uid,
            [UserFirestoreModel.kName]: this.name,
            [UserFirestoreModel.kRole]: this.role,
            [UserFirestoreModel.kEmail]: this.email,
            [UserFirestoreModel.kBirthDate]: this.birthDate,
        };
    }

}
