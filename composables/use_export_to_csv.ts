import { useCreateCSVTemplate } from "./use_generate_csv_template";

export const useExportToCSV= (option:IExportToCSV) => useCreateCSVTemplate(option.fileName, option.header, option.records)

interface IExportToCSV{
    header : string[];
    records : string[][];
    fileName : string;
}