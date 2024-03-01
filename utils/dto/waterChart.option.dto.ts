export interface IWaterConsumptionChart{
    title:string,
    series : {name : string, data : number[]}[],
    xAxisCategories : string[],
    isLoading: boolean,
    success : boolean,
}