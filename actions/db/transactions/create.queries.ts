"use server"
import prisma from "@/lib/prisma"
import { Transaction } from "../../../src/types"

export const addTransactionToBudget = async (data: Transaction) => {
  try {
    if (data.budgetId) {
      const budget = await prisma.budget.findUnique({
        where: { id: data.budgetId },
        include: { transactions: true },
      });

      if (!budget) {
        throw new Error("Budget introuvable");
      }

      // Calcul du total déjà dépensé
      const totalSpent = budget.transactions.reduce((sum, tx) => sum + tx.amount, 0);

      // Vérifie si la nouvelle transaction dépasse le budget
      if (totalSpent + data.amount > budget.amount) {
        return {
          message: "La transaction dépasse le montant du budget",
          statusCode: 400,
        };
      }
    }

    // Création de la transaction
    const transaction = await prisma.transaction.create({
      data: {
        amount: data.amount,
        description: data.description,
        emoji: data.emoji,
        ...(data.budgetId && {
          budget: {
            connect: {
              id: data.budgetId,
            },
          },
        }),
      },
    });

    return {
      message: "Transaction ajoutée avec succès",
      statusCode: 201,
      transaction,
    };
  } catch (error) {
    console.error("Erreur lors de l'ajout de la transaction :", error);
    return {
      message: "Erreur lors de l'ajout de la transaction",
      statusCode: 500,
    };
  }
};
