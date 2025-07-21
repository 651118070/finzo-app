"use server"
import prisma from "@/lib/prisma";
export const deleteTransaction = async (transactionId: string) => {
    try {
      const transaction = await prisma.transaction.delete({
        where: { id: transactionId },
      });
  
      if (!transaction) {
        return {
          message: "Transaction introuvable",
          statusCode: 404,
        };
      }
  
      return {
        message: "Transaction supprimée avec succès",
        statusCode: 200,
        transaction,
      };
    } catch (error) {
      console.error("Erreur lors de la suppression de la transaction :", error);
      return {
        message: "Erreur lors de la suppression de la transaction",
        statusCode: 500,
      };
    }
  };
  