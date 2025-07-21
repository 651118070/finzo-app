"use server";
import prisma from "@/lib/prisma";

export const getTransactionsByBudgetId = async (
    budgetId: string,
    page = 1,
    pageSize:number
  ) => {
    try {
      const skip = (page - 1) * pageSize;
  
      const [transactions, totalCount] = await Promise.all([
        prisma.transaction.findMany({
          where: {
            budgetId,
          },
          orderBy: {
            createdAt: "desc",
          },
          skip,
          take: pageSize,
        }),
        prisma.transaction.count({
          where: {
            budgetId,
          },
        }),
      ]);
  
      if (!transactions || transactions.length === 0) {
        return {
          message: "Aucune transaction trouvée pour ce budget",
          statusCode: 404,
          transactions: [],
          totalCount: 0,
        };
      }
  
      return {
        message: "Transactions récupérées avec succès",
        statusCode: 200,
        transactions,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / pageSize),
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des transactions :", error);
      return {
        message: "Erreur lors de la récupération des transactions",
        statusCode: 500,
      };
    }
  };
  
export const getTotalTransactionsByUser=async(email:string)=>{
    try {
        const user=await prisma.user.findUnique({
            where:{
                email
            },
            include:{
                budgets:{
                    include:{
                        transactions:true
                    }
                }
            }
        })
        if(!user){
            return{
                message:"utilisateur introuvable",
                statusCode:404
            }
        }
        const totalAmount = user.budgets.flatMap(budget =>
            budget.transactions.map(transaction => transaction.amount)
          ).reduce((acc, amount) => acc + amount, 0);
        return{
            totalAmount:totalAmount
        }
          
        
    } catch{
        return{
            message:"erreur",
            statusCode:500
        }
        
    }
}
export const getTotalTransactionsLength=async(email:string)=>{
    try {
        const user=await prisma.user.findUnique({
            where:{
                email
            },
            include:{
                budgets:{
                    include:{
                        transactions:true
                    }
                }
            }
        })
        if(!user){
            return{
                message:"utilisateur introuvable",
                statusCode:404
            }
        }
        const totalCount = user.budgets.reduce((acc, budget) => {
            return acc + budget.transactions.length;
          }, 0);
        return{
            totalcount:totalCount
        }
          
        
    } catch{
        return{
            message:"erreur",
            statusCode:500
        }
        
    }
}