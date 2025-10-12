'use server'
import prisma from "@/lib/prisma";
import { Budget } from "../../../src/types";
// export const createBudget = async (data: Budget) => {
//     try {
//         const budget=await prisma.budget.findFirst({
//             where: {
//                 name: data.name}})
//         if (budget) {
//             return {
//                 message: "Budget existe deja",
//                 statusCode: 400,
//             };
//         }
//         else{
//             await prisma.budget.create({
//                 data: {
//                     name: data.name,
//                     amount: data.amount,
//                     user: {
//                     connect: {
//                         email:data.email,
//                     },
//                 },
//                     emoji: data.emoji,
//                 },
//                 });
//         }
        
//         return {
//         message: "Budget cree avec succes",
//         statusCode: 201,
//         budget,
//         };
//     } catch (error) {
//         console.error("Error creating budget:", error);
//         return {
//         message: "Error creating budget",
//         statusCode: 500,
//         };
//     }

// }
export const createBudget = async (data: Budget) => {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: data.email },
        include: {
          subscriptions: {
            where: { active: true },
            orderBy: { endDate: "desc" }, // get the latest active subscription
            take: 1,
            include: { plan: true },
          },
          budgets: true,
        },
      });
  
      if (!user) {
        return {
          message: "Utilisateur introuvable",
          statusCode: 404,
        };
      }
  
      const activeSub = user.subscriptions[0];
      if (!activeSub) {
        return {
          message: "Aucune souscription active trouvée",
          statusCode: 403,
        };
      }
  
      const planName = activeSub.plan.name
      const userBudgetCount = user.budgets.length;
  
      // Check limits based on plan
      if (planName === "Starter" && userBudgetCount >= 5) {
        return {
          message: "Le forfait Starter permet uniquement la creation de cinq budgets",
          statusCode: 403,
        };
      }
  
      if (planName === "Pro" && userBudgetCount >= 10) {
        return {
          message: "Le forfait Pro permet uniquement la creation de dix budgets",
          statusCode: 403,
        };
      }
  
      // premium has unlimited budgets, no need to check
  
      // Check if budget name already exists for this user (optional)
      const existingBudget = await prisma.budget.findFirst({
        where: {
          name: data.name,
          userId: user.id,
        },
      });
  
      if (existingBudget) {
        return {
          message: "Budget existe déjà avec ce nom",
          statusCode: 400,
        };
      }
  
      // Create the budget
      const newBudget = await prisma.budget.create({
        data: {
          name: data.name,
          amount: data.amount,
          emoji: data.emoji,
          user: {
            connect: { id: user.id },
          },
        },
      });
  
      return {
        message: "Budget créé avec succès",
        statusCode: 201,
        budget: newBudget,
      };
    } catch (error) {
      console.error("Error creating budget:", error);
      return {
        message: "Erreur lors de la création du budget",
        statusCode: 500,
      };
    }
  };