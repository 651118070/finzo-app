'use server';
import prisma from "@/lib/prisma";

export const updateUserSubscription = async (userId: string, newPlanName: string) => {
    try {
        console.log("user",userId)
        console.log("plan",newPlanName)
        // 1. Find the plan by its name
        const newPlan = await prisma.plan.findFirst({
          where: {
            name:newPlanName
          },
        });

    
        if (!newPlan) {
          return {
            message: `Plan with name '${newPlanName}' not found`,
            statusCode: 404,
            subscription: null,
          };
        }
    
        // 2. Find the user's active subscription
        const activeSub = await prisma.subscription.findFirst({
          where: {
            userId,
            active: true,
          },
        });
    
        if (!activeSub) {
          return {
            message: "Active subscription not found for this user",
            statusCode: 404,
            subscription: null,
          };
        }
    
        // 3. Update the subscription to point to the new plan
        const updatedSubscription = await prisma.subscription.update({
          where: { id: activeSub.id },
          data: {
            planId: newPlan.id,
            startDate: new Date(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            active: true,
          },
          include: {
            plan: true, // include updated plan details
          },
        });
    
        return {
          message: "Subscription updated successfully",
          statusCode: 200,
          subscription: updatedSubscription,
        };
      } catch (error) {
        console.error("Error updating subscription:", error);
        return {
          message: "Failed to update subscription",
          statusCode: 500,
          subscription: null,
        };
      }
};
