import { BillType } from "~/utils/class/billType.class";

export const useWaterBillAlgo = (options: IWaterBillAlgoOptions) => {
  const rates: Record<string, number[]> = {
    DOMESTIC: [3.22, 5.48],
    INDUSTRIAL: [10.8768],
    COMMERCIAL: [9.0298],
  };

  const surcharge = {
    fireFighting: 0.01,
    ruralWater: 0.02,
  };

  const gwServiceCharge = 10
  const fee = 15
  const serviceCharge = gwServiceCharge + fee


  if (!options.type) options.type = BillType.getId('DOMESTIC'); //defaults to DOMESTIC

  // CONSUMPTION IN CUBIC METRES (1000L) 
  const calculateWaterCharge = (rate: number, consumption: number) => {
    return consumption * rate;
  };

  if (options.type === BillType.getId('DOMESTIC')) {
    const billRateType = BillType.getName(BillType.getId('DOMESTIC')!)
    const rate = options.consumption <= 5 ? rates[billRateType][0] : rates[billRateType][1];
    const waterCharge = calculateWaterCharge(rate, options.consumption);
    return {
      waterCharge: waterCharge + (waterCharge * surcharge.fireFighting) + (waterCharge * surcharge.ruralWater),
      firefighting: waterCharge * surcharge.fireFighting,
      ruralWater: waterCharge * surcharge.ruralWater,
      serviceCharge,
      billType: options.type
    };
  }

  if (options.type === BillType.getId('COMMERCIAL')) {
    const billRateType = BillType.getName(BillType.getId('COMMERCIAL')!)
    const rate = rates[billRateType][0];
    const waterCharge = calculateWaterCharge(rate, options.consumption);
    return {
      waterCharge: waterCharge + (waterCharge * surcharge.fireFighting) + (waterCharge * surcharge.ruralWater),
      firefighting: waterCharge * surcharge.fireFighting,
      ruralWater: waterCharge * surcharge.ruralWater,
      serviceCharge,
      billType: options.type
    }
  }

  if (options.type === BillType.getId('INDUSTRIAL')) {
    const billRateType = BillType.getName(BillType.getId('INDUSTRIAL')!)
    const rate = rates[billRateType][0];
    const waterCharge = calculateWaterCharge(rate, options.consumption);
    return {
      waterCharge: waterCharge + (waterCharge * surcharge.fireFighting) + (waterCharge * surcharge.ruralWater),
      firefighting: waterCharge * surcharge.fireFighting,
      ruralWater: waterCharge * surcharge.ruralWater,
      serviceCharge,
      billType: options.type
    }
  }

  return {
    waterCharge: 0,
    firefighting: 0,
    ruralWater: 0,
    serviceCharge,
    billType: options.type
  };
};

export interface IWaterBillAlgoOptions {
  type?: string;
  consumption: number;
}
