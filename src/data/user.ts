import {UserRole} from "../index";


export class User {
    constructor(
        public readonly uid:string,
        public readonly name:string,
        public readonly role:UserRole,
        public readonly email:string,
        public readonly birthDate: Date,
    ) {}

    copyWith(data:Partial<Record<keyof User, any>>) {
        return new User(
            data.uid ?? this.uid,
            data.name ?? this.name,
            data.role ?? this.role,
            data.email ?? this.email,
            data.birthDate ?? this.birthDate,
        );
    }



}
