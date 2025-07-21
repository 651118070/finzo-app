"use client"
import React from 'react'
import { Budget } from '../types'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import { Progress } from "@/components/ui/progress"
import { Badge } from './ui/badge'
import { Button } from './ui/button';
type BudgetItemProps = {
    budget: Budget;
    }
export default function BudgetItem({budget}:BudgetItemProps) {
    const totalTransactions = budget.transactions?.length
    const totalTransactionAmount = budget.transactions ? budget.transactions.reduce((acc, transaction) => acc + transaction.amount, 0) : 0;
    const remainingAmount = budget.amount - totalTransactionAmount;
    const progress=(totalTransactionAmount/budget.amount)*100

  return (
    <Card key={budget.id} className='bg-slate-50 hover:border-2 hover:border-emerald-600 dark:bg-slate-800 font-roboto w-full   ' >
    <CardHeader>
      <CardTitle className="flex justify-between items-center gap-x-2">
       <div className='flex gap-x-2'>
       <div className='rounded-full flex justify-center items-center border-slate-200 dark:border-slate-700 dark:bg-slate-300 bg-slate-700 w-7 h-7'>
            
            {budget.emoji} 
        
        </div>
        
        <div className='pt-2'>
            {budget.name}
        </div>
       </div>
      
        <span><Badge className='bg-emerald-600 dark:bg-emerald-400 text-white'>{totalTransactions} transactions</Badge></span>
      </CardTitle>
      <CardDescription className='flex flex-col text-gray-600 dark:text-slate-400'>
    
        Montant: {budget.amount} XAF
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className='flex flex-col text-sm gap-y-5'>
        <div className='flex gap-x-4 justify-between'>
        <p className='flex flex-col text-gray-600 dark:text-slate-400'>{totalTransactionAmount} XAF <span>depenses</span> </p>
        <p className='flex flex-col text-gray-600 dark:text-slate-400'>{remainingAmount} XAF <span>restantes</span></p>
        </div>
        <Progress value={progress}  />
      </div>
     
    </CardContent>
     <CardFooter className='flex justify-end hover:cursor-progress'>
      <Button  className="bg-emerald-500 text-white hover:text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 " variant="outline">En savoir plus</Button>
         
        </CardFooter>
         </Card>
  )
}
