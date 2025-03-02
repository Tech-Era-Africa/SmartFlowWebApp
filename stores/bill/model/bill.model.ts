import { type IObject } from "~/utils/type/i.object";
import type { IOrganisation } from "~/stores/auth/user/model/organisation.model";
import type { IDeviceGroup } from "~/stores/cluster/model/cluster.model";
import { UserModel, type User } from "~/stores/auth/user/model/user.model";


export class BillModel {
  bill: IBill;

  constructor(bill: IBill) {

    this.bill = bill;
  }


  static fromMap(json: any) {
    const bill: IBill = {

      objectId: json.objectId,
      currency: json.currency,
      amount: json.amount,
      fireCharge: json.fireCharge,
      ruralCharge: json.ruralCharge,
      serviceCharge: json.serviceCharge,
      waterCharge: json.waterCharge,
      status: json.status,
      billType: json.billType,
      createdAt: json.createdAt,
      updatedAt: json.updatedAt,
      cluster: json.cluster,
      organisation: json.organisation,
      createdBy: UserModel.fromMap(json.createdBy),
      totalConsumption: json.totalConsumption

    };

    return bill;
  }
}

export interface IBill {
  amount: number;
  waterCharge: number;
  fireCharge: number;
  ruralCharge: number;
  serviceCharge: number;
  currency: string;
  status: IObject;
  createdAt?: string;
  updatedAt?: string;
  billType: IObject;
  objectId: string;
  createdBy: User;
  organisation: IOrganisation;
  cluster: IDeviceGroup;
  totalConsumption: number;

}

export interface IBillOption {
  bill: {
    amount: number;
    waterCharge: number;
    fireCharge: number;
    ruralCharge: number;
    serviceCharge: number;
    currency: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
    billType: string;
    objectId: string;
    createdBy: string;
    orgId: string;
    clusterId: string;
    totalConsumption: number;
  },
  deviceIds: string[]

}





