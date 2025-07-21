import { getBudgetById } from "../db/budget/getById.queries";
export const getBudgetByIdAction=async(budgetId:string)=>{
     try {
       const budgets = await getBudgetById(budgetId);
       return {
         message: budgets?.message,
         statusCode: budgets?.statusCode || 200,
         budgets: budgets?.budget || null,
         totalTransactions: budgets?.totalTransactions,
         sumOfTransactions:budgets.sumTransactions
       };
     } catch (error) {
       console.error("Error in getBudgetByIdAction:", error);
       return {
         message: "Error retrieving budgets",
         statusCode: 500,
       };
     }
}