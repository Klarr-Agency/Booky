import type { PageServerLoad } from "./$types.js";
import type PocketBase from 'pocketbase';

interface Locals {
    pb: PocketBase;
}

interface LabelTotal {
    name: string;
    color: string;
    revenue: number;
    expense: number;
}

interface LabelTotals {
    [key: string]: LabelTotal;
}


export const load: PageServerLoad = async ({ url, locals }: { url: URL, locals: Locals }) => {
    const now = new Date();

    // Checking URL parameters or setting defaults to the current month
    const startDateParam = url.searchParams.get('startDate') || new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endDateParam = url.searchParams.get('endDate') || new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    // Ensure userId is available and of type string
    const userId = locals.pb.authStore.model?.id;
    if (typeof userId !== 'string') {
        throw new Error('User not authenticated');
    }

    const transactions = await locals.pb.collection('transactions').getFullList({
        sort: '-created',
        filter: `userId="${userId}" && date >= "${startDateParam}" && date <= "${endDateParam}"`,
        requestKey: null 
    });

    const labels = await locals.pb.collection('labels').getFullList({
        filter: `userId="${userId}"`,
        requestKey: null
    });

    const transactionLabels = await locals.pb.collection('transactionLabels').getFullList({
        filter: `userId="${userId}"`,
        requestKey: null
    });

    const lastTransactions = await locals.pb.collection('transactions').getList(1, 5, {
        sort: '-created',
        fields: 'amount, title, date',
        filter: `userId="${userId}"`,
        requestKey: null
    });

    const totalRevenue = transactions.filter(t => t.type === 'revenue').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    const labelTotals: LabelTotals = labels.reduce((acc, label) => {
        acc[label.id] = { name: label.name, color: label.color, revenue: 0, expense: 0 };
        return acc;
    }, {} as LabelTotals);

    transactionLabels.forEach(tl => {
        const transaction = transactions.find(t => t.id === tl.transactionId);
        const label = labels.find(l => l.id === tl.labelId);
        
        if (transaction && label) {
            if (transaction.type === 'revenue') {
                labelTotals[label.id].revenue += transaction.amount;
            } else if (transaction.type === 'expense') {
                labelTotals[label.id].expense += transaction.amount;
            }
        }
    });

    const result = {
        props: {
            totalRevenue,
            totalExpense,
            lastTransactions: lastTransactions.items,
            labelTotals,
            startDate: startDateParam,
            endDate: endDateParam
        }
    };

    return result;
};