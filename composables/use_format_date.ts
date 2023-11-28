import { DateTime } from "ts-luxon";

export const useFormatDateHuman = (date: Date) => DateTime.fromISO(date.toISOString()).toFormat('dd LLL yyyy')

export const useRelativeDateHuman = (date: Date) => {

    const dateTime = DateTime.fromJSDate(date);

    // Get the human-readable relative calendar string
    const relativeCalendar = dateTime.toRelativeCalendar({
        base: DateTime.now(),
        unit: "days",
    });

    return `${relativeCalendar} at ${DateTime.fromISO(date.toISOString()).toFormat('hh : mm a')}`;
}