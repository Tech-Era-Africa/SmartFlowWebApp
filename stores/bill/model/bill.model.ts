import { type IObject } from "~/utils/type/i.object";
import { type IDevice } from "../../device/model/device.model";


export class BillModel {
    bill: IBill;
  
    constructor(bill: IBill) {

      this.bill = bill;
    }
  
    // Factory constructor
    static default(): BillModel {
      const bill: IBill = {
        objectId:"",
        currency : "",
        amount : 0,
        fireCharge : 0,
        ruralCharge : 0,
        serviceCharge : 0,
        updatedAt : "",
        waterCharge : 0,
        status : "",
        createdAt : "",
        billType : "",
        createdBy : "",
        orgId : "",
        clusterId : ""
  
      };
  
      return new BillModel(bill);
    }
  
    static fromMap(json:any) {
      const bill: IBill = {

        objectId:json.objectId,
        currency : json.currency,
        amount : json.amount,
        fireCharge : json.fireCharge,
        ruralCharge : json.ruralCharge,
        serviceCharge : json.serviceCharge,
        waterCharge : json.waterCharge,
        status : json.status,
        billType : json.billType,
        createdAt : json.createdAt,
        updatedAt : json.updatedAt,
        clusterId : json.cluster.objectId,
        orgId : json.organisation.objectId,
        createdBy : json.createdBy.objectId
  
      };
  
      return new BillModel(bill);
    }
  }
  
  export interface IBill {
    amount: number;
    waterCharge: number;
    fireCharge: number;
    ruralCharge: number;
    serviceCharge: number;
    currency: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
    billType:string;
    objectId: string;
    createdBy:string;
    orgId:string;
    clusterId:string;
  
  }

  export interface IBillOption {
    bill : IBill,
    deviceIds: string[]
  
  }




  
  