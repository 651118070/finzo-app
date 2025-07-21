
import { getTransactionsByBudgetId,getTotalTransactionsByUser, getTotalTransactionsLength } from "../db/transactions/get.queries";
export const getTransactionsByBudgetsId=async(budgetId:string,page:number,pageSize:number)=>{
    
        try {
        const transactions = await getTransactionsByBudgetId(budgetId,page,pageSize);
        return {
            message: transactions?.message,
            statusCode: transactions?.statusCode || 200,
            transactions: transactions?.transactions || [],
            totalTransactions: transactions.transactions,
            pagination:{
                page:page,
                pageSize:pageSize,
                totalPages:transactions.totalPages
              }
        };
        } catch (error) {
        console.error("Error in getTransactionsByBudgetsId:", error);
        return {
            message: "Error retrieving transactions",
            statusCode: 500,
        };
        }
    
}
export const getTransactionsByBudgetsUser=async(email:string)=>{
    
    try {
    const transactions = await getTotalTransactionsByUser(email);
    return {
        message: transactions?.message,
        statusCode: transactions?.statusCode || 200,
        totalAmount:transactions.totalAmount
    };
    } catch (error) {
    console.error("Error in getTransactionsByBudgetsId:", error);
    return {
        message: "Error retrieving transactions",
        statusCode: 500,
    };
    }

}
export const getTransactionsCount=async(email:string)=>{
    
    try {
    const transactions = await getTotalTransactionsLength(email);
    return {
        message: transactions?.message,
        statusCode: transactions?.statusCode || 200,
        totalCount:transactions.totalcount
    };
    } catch (error) {
    console.error("Error in getTransactionsByBudgetsId:", error);
    return {
        message: "Error retrieving transactions",
        statusCode: 500,
    };
    }

}