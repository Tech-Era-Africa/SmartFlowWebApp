import { DateTime } from "ts-luxon";

export const useFormatDateHuman = (date:Date)=> DateTime.fromISO(date.toISOString()).toFormat('dd LLL yyyy')

