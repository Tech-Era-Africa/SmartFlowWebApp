import type { IDevice } from "~/stores/device/model/device.model";

export interface DeviceCardOptionDTO {
    device:IDevice,
    hideUpdateDate?:boolean
}