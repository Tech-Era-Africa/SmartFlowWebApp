import type { IDevice } from "~/server/api/device/model/device.model";

export interface DeviceCardOptionDTO {
    device:IDevice,
    hideUpdateDate?:boolean
}