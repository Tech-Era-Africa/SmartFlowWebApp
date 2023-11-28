

export class DeviceModel {
    device: IDevice;
  
    constructor(device: IDevice) {

      this.device = device;
    }
  
    // Factory constructor
    static default(): DeviceModel {
      const device: IDevice = {
        objectId : "",
        name : "",
        eui : "",
        battery : 0,
        valveIsOpen : false,
        consumption : 0,
        status : "",
        createdAt : "",
  
      };
  
      return new DeviceModel(device);
    }
  
    static fromMap(json:any) {
      const device: IDevice = {
        objectId:json.objectId,
        name:json.name,
        eui :json.eui,
        battery : json.battery,
        valveIsOpen : json.valveIsOpen,
        consumption : json.consumption,
        status : json.status.objectId,
        createdAt : json.createdAt,
  
      };
  
      return new DeviceModel(device);
    }
  }
  
  export interface IDevice {
    objectId:string;
    name:string;
    consumption : number;
    valveIsOpen : boolean;
    battery : number;
    eui : string;
    status : string;
    createdAt:any;
  
  }
  
  