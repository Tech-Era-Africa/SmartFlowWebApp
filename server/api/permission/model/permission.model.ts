

export interface IPermissionGroup {
    permissions: IPermission[];
    tag:         IPermissionTag;
}

export interface IPermission {
    objectId : string;
    name: string;
    tag:  IPermissionTag;
}


export interface IPermissionTag {
    createdAt: string;
    name:      string;
    objectId:  string;
}


export class PermissionModel {
    permission: IPermission;
    constructor(permission:IPermission) {
        this.permission = permission;
    }

    static fromMap(json: any) {
        const permission: IPermission = {
            objectId: json.objectId,
            name:json.name,
            tag : PermissionTagModel.fromMap(json.tag)
        };

        return permission;
    }

}

export class PermissionTagModel {
    permissionTag: IPermissionTag;
    constructor(permissionTag:IPermissionTag) {
        this.permissionTag = permissionTag;
    }

    static fromMap(json: any) {
        const permissionTag: IPermissionTag = {
            objectId: json.objectId,
            name:json.name,
            createdAt : json.createdAt
        };

        return permissionTag;
    }

}