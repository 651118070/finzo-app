'use server'
import prisma from "@/lib/prisma";
import {subDays, subMonths} from 'date-fns'

export const getBudgetByEmail = async (
  email: string,
  page: number,
  pageSize: number
) => {
  const skip = (page - 1) * pageSize;

  try {
    const [budgets, totalCount] = await Promise.all([
      prisma.budget.findMany({
        where: { user: { email } },
        include: { transactions: true },
        skip,
        take: pageSize,
      }),
      prisma.budget.count({
        where: { user: { email } },
      }),
    ]);

    const plainBudgets = budgets.map((b) => ({
      id: b.id,
      name: b.name,
      amount: b.amount,
      emoji: b.emoji,
      userId: b.userId,
      transactions: b.transactions.map((t) => ({
        id: t.id,
        amount: t.amount,
        description: t.description,
      })),
    }));

    const totalTransactions = budgets.map((b) => ({
      budgetId: b.id,
      count: b.transactions.length,
    }));

    return {
      message: "Budgets retrieved successfully",
      statusCode: 200,
      budgets: plainBudgets,
      totalTransactions,
      pagination: {
        totalItems: totalCount,
        currentPage: page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };
  } catch (error) {
    console.error("Error retrieving budgets:", error);
    return {
      message: "Error retrieving budgets",
      statusCode: 500,
      budgets: [],
      totalTransactions: [],
      pagination: {
        totalItems: 0,
        currentPage: page,
        pageSize,
        totalPages: 0,
      },
    };
  }
};

export const getBudgetFinishedByEmail = async (email: string) => {
    try {
        const budgets = await prisma.budget.findMany({
            where: {
                user: {
                    email: email,
                    
                },
            },
            include: {
                transactions:true
            },
        });
        const finishedBudgets = budgets.filter(budget => {
            const totalSpent = budget.transactions.reduce((acc, tx) => acc + tx.amount, 0);
            return totalSpent >= budget.amount; 
          });
        return {
            message: "Finished budgets retrieved successfully",
            statusCode: 200,
            budgets,
            totalBudgets: budgets.length,
            finishedBudgetsCount: finishedBudgets.length,
        };
    } catch (error) {
        console.error("Error retrieving finished budgets:", error);
        return {
            message: "Error retrieving finished budgets",
            statusCode: 500,
        };
    }
}
export const getBudgetByMailAndPeriod = async (email: string, periode: string,page:number,pageSize:number) => {
    try {
     
      const maintenant = new Date();
      let  dateDepart = subDays(maintenant, 1);  
      switch (periode) {
        case "daily":
          dateDepart = subDays(maintenant, 1);
          break;
        case "monthly":
        dateDepart = subMonths(maintenant, 1);
            break;
        
        default:
          dateDepart = subDays(maintenant, 1);
      }
  
    
      const skip = (page - 1) * pageSize;

      const [budgets, totalCount] = await Promise.all([
        prisma.budget.findMany({
          where: {
            user: { email },
            createdAt: {
              gte: dateDepart,
              lte: new Date(),
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: true,
            transactions: true,
          },
          skip,
          take: pageSize,
        }),
        prisma.budget.count({
          where: {
            user: { email },
            createdAt: {
              gte: dateDepart,
              lte: new Date(),
            },
          },
        }),
      ]);
  
      const totalTransactions = budgets.map((budget) => ({
        budgetId: budget.id,
        transactions: budget.transactions.length,
      }));
  
  
        
      return {
        statusCode: 200,
        message: "Budgets récupérés avec succès",
        budgets,
        totalTransactions,
        currentPage: page,
        totalPages: Math.ceil(totalCount / pageSize),
        totalItems: totalCount,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des transactions :", error);
      return {
        success: false,
        message: "Échec de la récupération des transactions.",
      };
    }
  };
  