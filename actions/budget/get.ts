import { getBudgetByEmail,getBudgetFinishedByEmail,getBudgetByMailAndPeriod } from "../db/budget/get.queries";
export const getBudgetAction = async (email: string,page:number,pageSize:number) => {
  try {
    const budgets= await getBudgetByEmail(email,page,pageSize);
    return {
      message: budgets.message,
      statusCode: budgets.statusCode || 200,
      budgets: budgets.budgets || [],
      totalTransactions: budgets.totalTransactions || [],
      pagination:{
        page:page,
        pageSize:pageSize,
        totalPages:budgets.pagination.totalPages
      }
    };
  } catch (error) {
    console.error("Error in getBudgetAction:", error);
    return {
      message: "Error retrieving budgets",
      statusCode: 500,
    };
  }
}
export const getBudgetFinishedAction = async (email: string) => {
  try {
    const budgets = await getBudgetFinishedByEmail(email);
    return {
      message: budgets?.message,
      statusCode: budgets?.statusCode || 200,
      budgets: budgets?.budgets || [],
      finishedBudgetsCount: budgets?.finishedBudgetsCount || 0,
      totalBudgets: budgets?.totalBudgets || 0,
    };
  } catch (error) {
    console.error("Error in getBudgetAction:", error);
    return {
      message: "Error retrieving budgets",
      statusCode: 500,
    };
  }
}
export const getBudgetsPeriodAction = async (email: string,period:string,page:number,pageSize:number) => {
  try {
    const budgets = await getBudgetByMailAndPeriod(email,period,page,pageSize);
    return {
      message: budgets?.message,
      statusCode: budgets?.statusCode || 200,
      budgets: budgets?.budgets || [],
      totalTransactions:budgets.totalTransactions,
      pagination:{
        page:page,
        pageSize:pageSize,
        totalPages:budgets.totalPages
      }
      
    };
  } catch (error) {
    console.error("Error in getBudgetAction:", error);
    return {
      message: "Error retrieving budgets",
      statusCode: 500,
    };
  }
}