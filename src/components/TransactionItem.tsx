"use client"
import React from 'react'
import { Transaction } from '../types'
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Badge } from './ui/badge'
import { Button } from './ui/button'


type TransactionItemProps = {
    transaction: Transaction;
    }
export default function TransactionItem({transaction}:TransactionItemProps) {

  return (
    <Card key={transaction.id} className='bg-slate-50 hover:border-2 hover:border-emerald-600 dark:bg-slate-800 font-roboto w-full  ' >
    <CardHeader>
      <CardTitle className="flex justify-between items-center gap-x-2">
      
      <div className='flex gap-x-2'>
      <div className='rounded-full flex justify-center items-center border-slate-200 dark:border-slate-700 dark:bg-slate-300 bg-slate-700 w-7 h-7'>
            
            {transaction.emoji} 
        
        </div>
        
        <div className='pt-2'>
            {transaction.description}
        </div>
      </div>
        <span><Badge className='bg-emerald-600 dark:bg-emerald-400 text-white'>Budget: {transaction.budgetName}</Badge></span>
       

      </CardTitle>
      <CardDescription className='flex flex-col text-gray-600 dark:text-slate-400'>
     
        Montant: {transaction.amount} XAF
      </CardDescription>
    </CardHeader>
    <CardFooter className='flex justify-end hover:cursor-progress'>
       <Button  className="bg-emerald-500 text-white hover:text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 " variant="outline">En savoir plus</Button>
     
    </CardFooter>
 
  </Card>
  )
}
