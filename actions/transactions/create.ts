
import { Transaction } from "../../src/types";
import { addTransactionToBudget } from "../db/transactions/create.queries";
export const createTransactionAction = async (data: Transaction)=>{
    try {
        const transaction = await addTransactionToBudget(data);
        return {
        message: transaction?.message,
        statusCode: transaction?.statusCode || 200,
        transaction: transaction?.transaction || null,
        };
    } catch (error) {
        console.error("Error in createTransactionAction:", error);
        return {
        message: "Error creating transaction",
        statusCode: 500,
        };
    }
}