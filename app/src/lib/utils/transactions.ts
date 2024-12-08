import type PocketBase from 'pocketbase';

interface Locals {
    pb: PocketBase;
}

export function formatDate(dateString: string): string {
    return new Date(dateString).toISOString().split('T')[0];
}

/**
 * Fetches transaction data for a user, either from cache or by querying the database.
 * @param {Locals} locals - The locals object containing PocketBase and Redis instances.
 * @param {string} userId - The ID of the user to fetch transactions for.
 * @param {string|null} startDate - The start date for filtering transactions (optional).
 * @param {string|null} endDate - The end date for filtering transactions (optional).
 * @returns {Promise<any>} The fetched transaction data.
 */
export async function fetchTransactionData(locals: Locals, userId: string, startDate: string | null, endDate: string | null) {

    let fetchFunction: (locals: Locals, userId: string, startDate: string | null, endDate: string | null) => Promise<any>;

    if (startDate && endDate) {
        fetchFunction = fetchDataByDateRange;
    } else {
        fetchFunction = fetchLastTransactions;
    }

    let data = await fetchFunction(locals, userId, startDate, endDate);

    return data;
}

async function fetchLastTransactions(locals: Locals, userId: string) {
    const transactions = await locals.pb.collection('transactions').getList(1, 25, {
        sort: '-created',
        fields: 'id,title,date,label,type,document,amount,receiptNumber,currency,pdf',
        filter: `userId="${userId}"`,
    });

    return fetchAdditionalData(locals, userId, transactions.items);
}

async function fetchDataByDateRange(locals: Locals, userId: string, startDate: string | null, endDate: string | null) {
    if (!startDate || !endDate) {
        throw new Error('Start date and end date are required for date range filtering');
    }

    const transactions = await locals.pb.collection('transactions').getFullList({
        sort: '-created',
        fields: 'id,title,date,label,type,document,amount,receiptNumber,currency,pdf',
        filter: `userId="${userId}" && date >= "${startDate}" && date <= "${endDate}"`,
    });

    return fetchAdditionalData(locals, userId, transactions);
}

async function fetchAdditionalData(locals: Locals, userId: string, transactions: any[]) {
    const labels = await locals.pb.collection('labels').getFullList({
        sort: 'name',
        filter: `userId="${userId}"`
    });

    const transactionLabels = await locals.pb.collection('transactionLabels').getFullList({
        filter: `userId="${userId}"`
    });

    const formattedTransactions = transactions.map(transaction => ({
        ...transaction,
        date: formatDate(transaction.date)
    }));

    return {
        props: {
            transactions: formattedTransactions,
            labels,
            transactionLabels
        }
    };
}