import type { IDevice } from "./device.model";

export class DeviceGroupModel{

    constructor(private readonly _deviceGroup: IDeviceGroup) { }

    static fromMap(json: any) {
        const deviceGroup: IDeviceGroup = {
          createdAt : json.createdAt,
          createdBy : json.createdBy,
          devices : json.devices,
          name : json.name,
          objectId : json.objectId,
          devicesCount : json.devicesCount ?? 0
        
        };
    
        return deviceGroup;
      }

}



export interface IDeviceGroup {
    createdBy: ICreatedBy;
    name:      string;
    createdAt: string;
    devices:   IDevice[];
    objectId:  string;
    devicesCount?: number;
}

export interface ICreatedBy {
    __type:    string;
    className: string;
    objectId:  string;
}

