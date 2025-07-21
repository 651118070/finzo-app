import { Budget } from "../../src/types";
import { updateBudget } from "../db/budget/update.queries";
export const updateBudgetAction = async (budgetId: string, data: Budget) => {
    try {
        const result = await updateBudget(budgetId, data);
        return{
            message: result.message,
            statusCode: result.statusCode,
            budget: result.budget,
        };
    } catch (error) {
        console.error("Error in updateBudgetAction:", error);
        return {
            message: "Error updating budget",
            statusCode: 500,
        };
    }
}