import { Budget } from "../../src/types";
import { createBudget } from "../db/budget/create.queries";
export const createBudgetAction = async (data: Budget) => {
  try {
    const budget = await createBudget(data);
    return {
      message: budget?.message,
      statusCode: budget?.statusCode || 200,
      budget: budget?.budget || null,
    };
  } catch (error) {
    console.error("Error in createBudgetAction:", error);
    return {
      message: "Error creating budget",
      statusCode: 500,
    };
  }
}