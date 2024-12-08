export function convertStringToNumber(input: string): number {
    const result = Number(input);
    if (isNaN(result)) {
        throw new Error('Input is not a valid number');
    }
    return result;
}

export function formatDate(dateString: string) {
    // Split the dateString by the space to ignore the time part
    const datePart = dateString.split(' ')[0];

    // Create a date object from the date part
    const date = new Date(datePart);

    // Extract the day, month, and year components
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // January is 0
    const year = date.getUTCFullYear();

    // Return the formatted string
    return `${day}/${month}/${year}`;
}

export interface DateObject {
    year: number;
    month: number;
    day: number;
}

export function toDate(dateObj: DateObject): Date {
    return new Date(Date.UTC(dateObj.year, dateObj.month - 1, dateObj.day, 0, 0, 0));
}