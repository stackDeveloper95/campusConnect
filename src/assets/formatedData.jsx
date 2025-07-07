import { format, isToday, isYesterday, parseISO } from "date-fns";

export const formatLastSeen = (isoDateString) => {
    const date = parseISO(isoDateString); // Convert to JS Date object

    if (isToday(date)) {
        return `Today at ${format(date, "h:mm a")}`;
    }

    if (isYesterday(date)) {
        return `Yesterday at ${format(date, "h:mm a")}`;
    }

    return `${format(date, "dd/MM/yyyy")} at ${format(date, "h:mm a")}`;
};

export const formatforChat = (isoDateString) => {
    const date = parseISO(isoDateString); // Convert to JS Date object

    if (isToday(date)) {
        return `${format(date, "h:mm a")}`;
    }

    if (isYesterday(date)) {
        return `${format(date, "h:mm a")}`;
    }

    return `${format(date, "dd/MM/yyyy")}`;
};

