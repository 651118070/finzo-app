"use server";

import prisma from "@/lib/prisma";
import { Transaction } from "../../../src/types";

export const updateTransaction = async (
  transactionId: string,
  data: Transaction
) => {
  try {
    // 1. Find the transaction and its associated budget
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { budget: true },
    });

    if (!existingTransaction) {
      return {
        message: "Transaction non trouvée",
        statusCode: 404,
      };
    }

    if (!existingTransaction.budget) {
      return {
        message: "Aucun budget associé à cette transaction",
        statusCode: 400,
      };
    }

    const budgetId = existingTransaction.budgetId;

    // 2. Get all other transactions for the same budget
    const otherTransactions = await prisma.transaction.findMany({
      where: {
        budgetId,
        NOT: { id: transactionId },
      },
    });

    const totalOtherAmounts = otherTransactions.reduce(
      (sum, txn) => sum + txn.amount,
      0
    );

    // 3. Validate the new transaction does not exceed budget
    const newTotal = totalOtherAmounts + data.amount;
    const budgetAmount = existingTransaction.budget.amount;

    if (newTotal > budgetAmount) {
      return {
        message: `Montant trop élevé. Le total des transactions (${newTotal}) dépasse le budget autorisé (${budgetAmount}).`,
        statusCode: 400,
      };
    }

    // 4. Update the transaction
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        amount: data.amount,
        description: data.description,
        emoji:data.emoji
      },
    });

    return {
      message: "Transaction mise à jour avec succès",
      statusCode: 200,
      transaction: updatedTransaction,
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    return {
      message: "Erreur serveur lors de la mise à jour de la transaction",
      statusCode: 500,
    };
  }
};
