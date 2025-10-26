"use server"
import prisma from "@/lib/prisma";
import { subDays, subWeeks, subMonths, subYears } from "date-fns";


export const getTransactionByMailAndPeriod = async (
  email: string,
  periode: string,
  page = 1,
  pageSize = 10
) => {
  try {
    let dateDepart: Date;

    const maintenant = new Date();

    switch (periode) {
      case "daily":
        dateDepart = subDays(maintenant, 1);
        break;
      case "weekly":
        dateDepart = subWeeks(maintenant, 1);
        break;
      case "monthly":
        dateDepart = subMonths(maintenant, 1);
        break;
      case "yearly":
        dateDepart = subYears(maintenant, 1);
        break;
      default:
        dateDepart = subYears(maintenant, 1);
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        budgets: {
          include: {
            // We won't load all transactions here because of pagination,
            // we'll query transactions separately for pagination.
            transactions: false,
          },
        },
      },
    });

    if (!user) {
      return {
        message: "Utilisateur introuvable",
        statusCode: 404,
      };
    }

    // Collect all budget IDs for this user
    const budgetIds = user.budgets.map((b) => b.id);

    if (budgetIds.length === 0) {
      return {
        statusCode: 200,
        message: "Aucune transaction trouvée",
        transactions: [],
        pagination: {
          total: 0,
          page,
          pageSize,
          totalPages: 0,
        },
      };
    }

    // Count total transactions for pagination
    const totalTransactionsCount = await prisma.transaction.count({
      where: {
        budgetId: { in: budgetIds },
        createdAt: {
          gte: dateDepart,
          lte: maintenant,
        },
      },
    });

    const totalPages = Math.ceil(totalTransactionsCount / pageSize);

    // Get paginated transactions with budget info (join budget to get name)
    const transactions = await prisma.transaction.findMany({
      where: {
        budgetId: { in: budgetIds },
        createdAt: {
          gte: dateDepart,
          lte: maintenant,
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        budget: {
          select: {
            name: true,
          },
        },
      },
    });

    // Map transactions to include budgetName
    const transactionsWithBudgetName = transactions.map((transaction) => ({
      ...transaction,
      budgetName: transaction.budget?.name,
    }));

    return {
      statusCode: 200,
      message: "Transactions récupérées avec succès",
      transactions: transactionsWithBudgetName,
      pagination: {
        total: totalTransactionsCount,
        page,
        pageSize,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des transactions :", error);
    return {
      success: false,
      message: "Échec de la récupération des transactions.",
    };
  }
};
export const getTransactionAllTransacions= async (
  email: string,
  periode: string,

) => {
  try {
    let dateDepart: Date;

    const maintenant = new Date();

    switch (periode) {
      case "daily":
        dateDepart = subDays(maintenant, 1);
        break;
      case "weekly":
        dateDepart = subWeeks(maintenant, 1);
        break;
      case "monthly":
        dateDepart = subMonths(maintenant, 1);
        break;
      case "yearly":
        dateDepart = subYears(maintenant, 1);
        break;
      default:
        dateDepart = subYears(maintenant, 1);
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        budgets: {
          include: {
            // We won't load all transactions here because of pagination,
            // we'll query transactions separately for pagination.
            transactions: false,
          },
        },
      },
    });

    if (!user) {
      return {
        message: "Utilisateur introuvable",
        statusCode: 404,
      };
    }

    // Collect all budget IDs for this user
    const budgetIds = user.budgets.map((b) => b.id);

    if (budgetIds.length === 0) {
      return {
        statusCode: 200,
        message: "Aucune transaction trouvée",
        transactions: [],
        pagination: {
          total: 0,
         
          totalPages: 0,
        },
      };
    }

    // Count total transactions for pagination
    const totalTransactionsCount = await prisma.transaction.count({
      where: {
        budgetId: { in: budgetIds },
        createdAt: {
          gte: dateDepart,
          lte: maintenant,
        },
      },
    });

  

    // Get paginated transactions with budget info (join budget to get name)
    const transactions = await prisma.transaction.findMany({
      where: {
        budgetId: { in: budgetIds },
        createdAt: {
          gte: dateDepart,
          lte: maintenant,
        },
      },
      orderBy: { createdAt: "desc" },
     
      include: {
        budget: {
          select: {
            name: true,
          },
        },
      },
    });

    // Map transactions to include budgetName
    const transactionsWithBudgetName = transactions.map((transaction) => ({
      ...transaction,
      budgetName: transaction.budget?.name,
    }));

    return {
      statusCode: 200,
      message: "Transactions récupérées avec succès",
      transactions: transactionsWithBudgetName,
      pagination: {
        total: totalTransactionsCount,
       
      
      },
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des transactions :", error);
    return {
      success: false,
      message: "Échec de la récupération des transactions.",
    };
  }
};