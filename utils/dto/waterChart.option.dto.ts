export interface IWaterConsumptionChart{
    series : {name : string, data : number[]}[],
    xAxisCategories : string[],
    isLoading: boolean,
    success : boolean,
}