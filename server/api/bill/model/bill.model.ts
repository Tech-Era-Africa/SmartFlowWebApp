import { DeviceModel, IDevice } from "../../device/model/device.model";


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
        totalBill : 0,
        device : [] as IDevice[],
        status : "",
        createdAt : "",
  
      };
  
      return new BillModel(bill);
    }
  
    static fromMap(json:any) {
      const bill: IBill = {
        objectId:json.objectId,
        currency : json.currency,
        totalBill : json.totalBill,
        device : json.deviceConsumption,
        status : json.status.objectId,
        createdAt : json.createdAt,
  
      };
  
      return new BillModel(bill);
    }
  }
  
  export interface IBill {
    objectId:string;
    device:IDevice[];
    totalBill:number;
    currency : string;
    status : any;
    createdAt:any;
  
  }

  export interface IBillOption {
    deviceIds : string[]
    amount: number,
    waterCharge: number,
    fireCharge: number,
    ruralCharge: number,
    serviceCharge: number,
    currency: string,
  
  }

  export type NewBillParam = Pick<IBill, 'device' | 'totalBill' | 'currency'>;

  
  