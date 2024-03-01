import { IPermission } from "../../../permission/model/permission.model";


export interface IRole {
    name:        string;
    createdAt:   string;
    description: string;
    permissions: IPermission[];
    objectId:    string;
}


export class RoleModel{
    role: IRole;
    constructor(role: IRole) {
        this.role = role;
    }

    static fromMap(json: any) {
        const role: IRole = {
            objectId: json.objectId,
            name : json.name,
            description : json.description,
            permissions : json.permissions,
            createdAt : json.createdAt

        };

        return role;
    }
}