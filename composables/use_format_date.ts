import { DateTime } from "luxon";

export const useFormatDateHuman = (date: Date) => DateTime.fromISO(date.toISOString()).toFormat('dd LLL yyyy')

export const useRelativeDateHuman = (date: Date) => {
    const dateTime = DateTime.fromJSDate(date);
    const now = DateTime.now();
    const diff = now.diff(dateTime, ['years', 'months', 'weeks', 'days', 'hours', 'minutes']).toObject();

    // Determine the most appropriate time unit
    let relativeTime = '';
    if (diff.years && diff.years > 0) {
        relativeTime = diff.years === 1 ? 'a year ago' : `${Math.floor(diff.years)} years ago`;
    } else if (diff.months && diff.months > 0) {
        relativeTime = diff.months === 1 ? 'a month ago' : `${Math.floor(diff.months)} months ago`;
    } else if (diff.weeks && diff.weeks > 0) {
        relativeTime = diff.weeks === 1 ? 'a week ago' : `${Math.floor(diff.weeks)} weeks ago`;
    } else if (diff.days && diff.days > 0) {
        relativeTime = diff.days === 1 ? 'yesterday' : `${Math.floor(diff.days)} days ago`;
    } else if (diff.hours && diff.hours > 0) {
        relativeTime = diff.hours === 1 ? 'an hour ago' : `${Math.floor(diff.hours)} hours ago`;
    } else if (diff.minutes && diff.minutes > 0) {
        relativeTime = diff.minutes === 1 ? 'a minute ago' : `${Math.floor(diff.minutes)} minutes ago`;
    } else {
        relativeTime = 'just now';
    }

    return `${relativeTime} at ${DateTime.fromISO(date.toISOString()).toFormat('hh:mm a')}`;
}