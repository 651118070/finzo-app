import { getTransactionAllTransacions, getTransactionByMailAndPeriod } from "../db/transactions/getTransactionByMail";
export const getTransactionByMailAndPeriodAction = async (email: string, period:string,page:number,pageSize:number) => {
    try {
        const transactions = await getTransactionByMailAndPeriod(email, period,page,pageSize);
        return {
            message: transactions?.message,
            statusCode: transactions?.statusCode || 200,
            transactions: transactions?.transactions || [],
            pagination:{
                page:page,
                pageSize:pageSize,
                totalPages:transactions.pagination?.totalPages
              }

        };
    } catch (error) {
        console.error("Error in getTransactionByMailAndPeriodAction:", error);
        return {
            message: "Error retrieving transactions",
            statusCode: 500,
        };
    }
}
export const getTransactionsAction = async (email: string, period:string) => {
    try {
        const transactions = await getTransactionAllTransacions(email, period);
        return {
            message: transactions?.message,
            statusCode: transactions?.statusCode || 200,
            transactions: transactions?.transactions || [],
           

        };
    } catch (error) {
        console.error("Error in getTransactionByMailAndPeriodAction:", error);
        return {
            message: "Error retrieving transactions",
            statusCode: 500,
        };
    }
}