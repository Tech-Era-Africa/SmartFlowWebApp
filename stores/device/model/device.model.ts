
export class DeviceModel {
  device: IDevice;

  constructor(device: IDevice) {

    this.device = device;
  }

  // Factory constructor
  static default(): DeviceModel {
    const device: IDevice = {
      objectId: "",
      name: "",
      eui: "",
      deviceId: "",
      battery: 0,
      lastConsumptionChange : 0,
      lastTotalConsumption : 0,
      valveIsOpen: false,
      consumption: 0,
      status: "",
      createdAt: "",
      updatedAt : ""

    };

    return new DeviceModel(device);
  }

  static fromMap(json: any) {
    const device: IDevice = {
      objectId: json.objectId,
      name: json.name,
      eui: json.eui,
      deviceId: json.deviceId,
      battery: json.battery,
      lastConsumptionChange : json.lastConsumptionChange,
      lastTotalConsumption : json.lastTotalConsumption,
      valveIsOpen: json.valveIsOpen,
      consumption: json.consumption,
      status: json.status.objectId,
      createdAt: json.createdAt,
      updatedAt: json.updatedAt

    };

    return device;
  }
}

export interface IDevice {
  objectId: string;
  name: string;
  consumption: number;
  valveIsOpen: boolean;
  battery: number;
  lastConsumptionChange : number;
  lastTotalConsumption : number;
  eui: string;
  deviceId: string;
  status: string;
  createdAt: string;
  updatedAt: string;

}

