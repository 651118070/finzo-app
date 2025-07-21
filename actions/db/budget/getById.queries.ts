"use server"
import prisma from "@/lib/prisma";
export const getBudgetById=async(budgetId:string)=>{
  try {
    const budget= await prisma.budget.findUnique({
        where:{
            id:budgetId
        },
        include:{
            transactions:true,
        }
    })
    if(!budget){
        return{
            message:"No budget found with this id",
            statusCode:404
        }
    }
    const totalTransactions= budget.transactions.length;
    const sumTransactions = (budget.transactions ?? []).reduce(
        (acc, bud) => acc + bud.amount,
        0
      )
      
    return{
        message:"Budget Successfully retrieved",
        statusCode:200,
        budget,
        totalTransactions,sumTransactions
    }
  } catch{
    return{
        message:"Error retrieving the budget",
        statusCode:500
    }
    
  }

}