import { getAllPlans } from "../db/plan/get.queries";
export const getPlansAction=async()=>{
    try {
        const plans=await getAllPlans()
        return {
          message: plans.message,
          statusCode: plans?.statusCode || 200,
          subscription:plans.plans
          
        };
      } catch (error) {
        console.error("Error in getBudgetAction:", error);
        return {
          message: "Error retrieving plans",
          statusCode: 500,
        };
      }
 
    
}