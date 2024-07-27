import type { IDevice } from "~/stores/device/model/device.model";

export interface IBillOptionDTO {
    billTitle: string;
    clusterId:string;
    startDate: string;
    endDate: string;
    billTypeId:string;
    totalConsumption: number;
    devices: IDevice[];
}