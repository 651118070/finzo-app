"use server"
import prisma from "@/lib/prisma";
import { Budget } from "../../../src/types";
export const updateBudget = async (budgetId: string, data: Budget) => {
    try {
        const existingBudget = await prisma.budget.findUnique({
            where: { id: budgetId },
            include: { transactions: true },
          });
          if (!existingBudget) {
            return {
              message: "Budget introuvable",
              statusCode: 404,
            };
          }
      
          // 3. Calculate total of transactions
          const totalTransactions = existingBudget.transactions.reduce(
            (acc, txn) => acc + txn.amount,
            0
          );
          if (data.amount < totalTransactions) {
            return {
              message: `Impossible de modifier: le montant est inférieur au total des transactions (${totalTransactions} XAF)`,
              statusCode: 400,
            };
          }
        const budget = await prisma.budget.update({
            where: { id: budgetId },
            data: {
                name: data.name,
                emoji: data.emoji,
                amount: data.amount,
            },
        });
        if(!budget) {
            return {
                message: "Budget introuvable",
                statusCode: 404,
            };
        }
        return {
            message: "Budget mis a jour avec success",
            statusCode: 200,
            budget,
        };
    } catch (error) {
        console.error("Error updating budget:", error);
        return {
            message: "Erreur lors de la modification",
            statusCode: 500,
        };
    }
}