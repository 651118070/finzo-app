import { getAllSubscriptions } from "../db/subscriptions/get.queries";
export const getSubscriptionsAction=async(page:number,pageSize:number)=>{
    try {
        const subscriptions=await getAllSubscriptions(page,pageSize)
        return {
          message: subscriptions.message,
          statusCode: subscriptions?.statusCode || 200,
          subscription:subscriptions.subscriptions,
          pagination:{
            page:subscriptions.pagination?.page,
            pageSize:subscriptions.pagination?.pageSize,
            totalPages:subscriptions.pagination?.totalPages
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