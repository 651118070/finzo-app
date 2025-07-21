"use server"
import prisma from "@/lib/prisma";
export const deleteBudget = async (budgetId: string) => {
    try {
        const budget = await prisma.budget.delete({
            where: { id: budgetId },
        });
        if (!budget) {
            return {
                message: "Budget not found",
                statusCode: 404,
            };
        }
        return {
            message: "Budget deleted successfully",
            statusCode: 200,
            budget,
        };
    } catch (error) {
        console.error("Error deleting budget:", error);
        return {
            message: "Error deleting budget",
            statusCode: 500,
        };
    }
}