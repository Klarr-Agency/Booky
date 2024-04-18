export function convertStringToNumber(input: string): number {
    const result = Number(input);
    if (isNaN(result)) {
        throw new Error('Input is not a valid number');
    }
    return result;
}