import type { PageServerLoad } from "./$types.js";


export const load: PageServerLoad = async ({ locals }) => {

    const [revenueList, expenseList, lastTransaction] = await Promise.all([
        locals.pb.collection('transactions').getFullList({
            sort: '-created',
            fields: 'amount',
            filter: 'type = "revenue"',
            requestKey: null 
        }),
        locals.pb.collection('transactions').getFullList({
            sort: '-created',
            fields: 'amount',
            filter: 'type = "expense"',
            requestKey: null
        }),
        locals.pb.collection('transactions').getList(1, 5,{
            sort: '-created',
            fields: 'amount, title, date',
            requestKey: null
        })
    ]);

    const totalRevenue = revenueList.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = expenseList.reduce((sum, item) => sum + item.amount, 0);

    return {
        props: {
            totalRevenue: totalRevenue,
            totalExpense: totalExpense,
            lastTransaction: lastTransaction
        }
    };
};