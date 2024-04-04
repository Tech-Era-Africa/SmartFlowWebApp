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

  const serviceCharge = 25

  if (!options.type) options.type = 'DOMESTIC'; //defaults to DOMESTIC

  // CONSUMPTION IN CUBIC METRES (1000L) 
  const calculateWaterCharge = (rate: number, consumption: number) => {
    return consumption * rate;
  };

  if (options.type === 'DOMESTIC') {
    const rate = options.consumption <= 5 ? rates[options.type][0] : rates[options.type][1];
    const waterCharge = calculateWaterCharge(rate, options.consumption);
    return {
      waterCharge: waterCharge + (waterCharge * surcharge.fireFighting) + (waterCharge * surcharge.ruralWater),
      firefighting: waterCharge * surcharge.fireFighting,
      ruralWater : waterCharge * surcharge.ruralWater,
      serviceCharge,
      billType : options.type
    };
  }

  if (options.type === 'COMMERCIAL' || options.type === 'INDUSTRIAL') {
    const rate = rates[options.type][0];
    const waterCharge = calculateWaterCharge(rate, options.consumption);
    return {
      waterCharge: waterCharge + (waterCharge * surcharge.fireFighting) + (waterCharge * surcharge.ruralWater),
      firefighting: waterCharge * surcharge.fireFighting,
      ruralWater : waterCharge * surcharge.ruralWater,
      serviceCharge,
      billType : options.type
    }
  }

  return {
    waterCharge: 0,
    firefighting: 0,
    ruralWater : 0,
    serviceCharge,
    billType : options.type
  };
};

export interface IWaterBillAlgoOptions {
  type?: 'DOMESTIC' | 'INDUSTRIAL' | 'COMMERCIAL';
  consumption: number;
}
