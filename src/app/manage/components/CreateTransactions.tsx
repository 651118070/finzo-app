"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import EmojiPicker from 'emoji-picker-react';
import React, { useState } from 'react'
import { createTransactionAction } from '../../../../actions/transactions/create';
import { Transaction } from '../../../types';
import { toast } from 'sonner';

export default function CreateTransactions({id}:{id:string}) {
    const queryClient=useQueryClient()
    
    const [description, setDescription] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);
    const [emoji, setEmoji] = useState<string>("");
    const [emojiPicker, setShowEmojiPicker] = useState<boolean>(false);
 
    const handleEmojiSelected = (emoji: { emoji: string }) => {
        setEmoji(emoji.emoji);
        setShowEmojiPicker(false);
      };
      const mutation = useMutation({
        mutationFn: (newTransactionData: Transaction) => createTransactionAction(newTransactionData),
        onSuccess: (response) => {
          queryClient.invalidateQueries({ queryKey: ["transactions"] });
          queryClient.invalidateQueries({ queryKey: ["budgets"] });
          toast.success(response.message);
          setDescription('')
    
          setEmoji("selectionez une emoji");
          setAmount(0);
        },
        onError: () => {
          toast.error("Une erreur est survenue lors de la création de la transaction.");
        },
      });
      const handleAddTransactions=async()=>{
        mutation.mutate({
            budgetId:id,
            description:description,
            amount:amount,
            emoji:emoji

        })

      }
  return (
    <div className="grid gap-4">
    <div className="grid gap-3">
      <Input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border-input mb-3"
        required
        placeholder="Description de la transaction"
      />
    </div>
    <div className="grid gap-3">
      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="border-input mb-3"
        required
        placeholder="Montant de la transaction"
      />
    </div>
    <Button
      className="bg-emerald-500 text-white hover:text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 "
      variant="outline"
      onClick={() => {
        setShowEmojiPicker(!emojiPicker);
        console.log("Emoji Picker clicked", emojiPicker);
      }}
    >
      {emoji || "Selectionez un emoji"}
    </Button>
    {emojiPicker && <EmojiPicker onEmojiClick={handleEmojiSelected} />}
    <Button
      onClick={handleAddTransactions}
      className="bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500"
      disabled={mutation.isPending}
    >
      {mutation.isPending ? (
        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        "Créer la transaction"
      )}
    </Button>
  </div>
  )
}
