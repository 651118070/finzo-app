
import { deleteBudget } from "../db/budget/delete.queries";
export const deleteBudgetAction = async (budgetId: string) => {
    try {
        const result = await deleteBudget(budgetId);
        return {
            message: result.message,
            statusCode: result.statusCode,
            budget: result.budget,
        };
    } catch (error) {
        console.error("Error in deleteBudgetAction:", error);
        return {
            message: "Error deleting budget",
            statusCode: 500,
        };
    }
   
}