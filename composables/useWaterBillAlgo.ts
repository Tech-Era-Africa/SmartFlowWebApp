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

  // CONSUMPTION IN CUBIC METRES (1000L)
  const calculateWaterCharge = (rate: number, consumption: number) => {
    return consumption * rate;
  };

  if (options.type === 'DOMESTIC') {
    const rate = options.consumption <= 5 ? rates[options.type][0] : rates[options.type][1];
    const waterCharge = calculateWaterCharge(rate, options.consumption);
    return waterCharge + (waterCharge * surcharge.fireFighting) + (waterCharge * surcharge.ruralWater);
  }

  if (options.type === 'COMMERCIAL' || options.type === 'INDUSTRIAL') {
    const rate = rates[options.type][0];
    const waterCharge = calculateWaterCharge(rate, options.consumption);
    return waterCharge + (waterCharge * surcharge.fireFighting) + (waterCharge * surcharge.ruralWater);
  }

  throw new Error('Invalid water bill type');
};

export interface IWaterBillAlgoOptions {
  type: 'DOMESTIC' | 'INDUSTRIAL' | 'COMMERCIAL';
  consumption: number;
}
