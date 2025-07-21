import { Transaction } from "../../src/types";
import { updateTransaction } from "../db/transactions/update.queries";
export const transactionBudgetAction = async (transactionId: string, data: Transaction) => {
    try {
        const result = await updateTransaction(transactionId, data);
        return{
            message: result.message,
            statusCode: result.statusCode,
            budget: result.transaction,
        };
    } catch (error) {
        console.error("Error in updateTransactionAction:", error);
        return {
            message: "Error updating transaction",
            statusCode: 500,
        };
    }
}