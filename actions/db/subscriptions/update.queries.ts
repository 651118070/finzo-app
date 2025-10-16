'use server';
import prisma from "@/lib/prisma";

export const updateUserSubscription = async (userId: string, newPlanName: string) => {
    try {
        
        // 1. Find the plan by its name
        const newPlan = await prisma.plan.findFirst({
          where: {
            name:newPlanName
          },
        });

    
        if (!newPlan) {
          return {
            message: `Plan avec le nom'${newPlanName}' introuvable`,
            statusCode: 404,
            subscription: null,
          };
        }
    
        // 2. Find the user's active sStarterubscription
        const activeSub = await prisma.subscription.findFirst({
          where: {
            userId,
            active: true,
          },
        });
    
        if (!activeSub) {
          return {
            message: "Aucune souscription active ",
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
          message: "Souscription mis a jour avec sucess",
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
