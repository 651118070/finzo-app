
import { updateUserSubscription } from "../db/subscriptions/update.queries";
export const updateSubscriptionAction = async (userId: string, newPlanId:string) => {
    try {
        const result = await updateUserSubscription(userId,newPlanId);
        return{
            message: result.message,
            statusCode: result.statusCode,
            data:result.subscription
        };
    } catch (error) {
        console.error("Error in updateSubscriptionAction:", error);
        return {
            message: "Error updating budget",
            statusCode: 500,
        };
    }
}