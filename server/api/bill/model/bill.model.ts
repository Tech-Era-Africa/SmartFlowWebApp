import { IObject } from "~/utils/type/i.object";
import { IDevice } from "../../device/model/device.model";


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
        status : {objectId : ""},
        createdAt : "",
        billType : {objectId : ""}
  
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
    status: IObject;
    createdAt: string;
    updatedAt: string;
    billType:IObject;
    objectId: string;
  
  }

  export interface IBillOption {
    bill : IBill,
    devices: IDevice[]
  
  }



  
  