import type { IDevice } from "~/stores/device/model/device.model";

export interface IBillOptionDTO {
    billTitle: string;
    startDate: string;
    endDate: string;
    totalConsumption: number;
    devices: IDevice[];
}