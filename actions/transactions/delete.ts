import { deleteTransaction } from "../db/transactions/delete.queries";
export const deleteTransactionAction = async(transactionId:string)=>{
    try {
           const result = await deleteTransaction(transactionId);
           return {
               message: result.message,
               statusCode: result.statusCode
           };
       } catch (error) {
           console.error("Error in deleteBudgetAction:", error);
           return {
               message: "Error deleting budget",
               statusCode: 500,
           };
       }
}