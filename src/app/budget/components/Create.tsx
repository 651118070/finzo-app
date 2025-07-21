"use client"
import { useUser } from "@clerk/nextjs";
import React, {  useState } from "react";
import { Budget } from "../../../types";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BanknoteArrowUpIcon } from "lucide-react";
import { toast } from "sonner";
import { createBudgetAction } from "../../../../actions/budget/create";
import EmojiPicker from "emoji-picker-react";
export default function CreateBudget() {
    const queryClient = useQueryClient();
    const { user } = useUser();
    const [budgetName, setBudgetName] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);
    const [budgetAmount, setBudgetAmount] = useState<number>(0);
    const [budgetEmoji, setBudgetEmoji] = useState<string>("");
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const handleEmojiSelected = (emoji: { emoji: string }) => {
      setBudgetEmoji(emoji.emoji);
      setShowEmojiPicker(false);
    };
   
    const mutation = useMutation({
        mutationFn: (newBudgetData: Budget) => createBudgetAction(newBudgetData),
        onSuccess: (response) => {
          queryClient.invalidateQueries({ queryKey: ["budgets"] });
          toast.success(response.message);
          setBudgetAmount(0);
    
          setOpen(false);
          setBudgetEmoji("selectionez une emoji");
          setBudgetName("");
        },
        onError: () => {
          toast.error("Une erreur est survenue lors de la création du budget.");
        },
      });
    
      const handleBudget = () => {
        mutation.mutate({
          name: budgetName,
          amount: budgetAmount,
          emoji: budgetEmoji,
          email: user?.primaryEmailAddress?.emailAddress || "",
        });
      };
    
  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <form>
      <DialogTrigger asChild>
        <Button
          className="bg-emerald-500 text-white hover:text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 "
          variant="outline"
        >
          Nouveau Budget <BanknoteArrowUpIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-white ">
            Creer un nouveau budget
          </DialogTitle>
          <DialogDescription>
            Entrez les détails de votre budget pour commencer à suivre vos
            dépenses.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Input
              type="text"
              value={budgetName}
              onChange={(e) => setBudgetName(e.target.value)}
              className="border-input mb-3"
              required
              placeholder="Nom du budget"
            />
          </div>
          <div className="grid gap-3">
            <Input
              type="number"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(Number(e.target.value))}
              className="border-input mb-3"
              required
              placeholder="Montant du budget"
            />
          </div>
          <Button
            className="bg-emerald-500 text-white hover:text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 "
            variant="outline"
            onClick={() => {
              setShowEmojiPicker(!showEmojiPicker);
              console.log("Emoji Picker clicked", showEmojiPicker);
            }}
          >
            {budgetEmoji || "Selectionez un emoji"}
          </Button>
          {showEmojiPicker && (
            <EmojiPicker onEmojiClick={handleEmojiSelected} />
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button
            className="bg-emerald-500 text-white hover:text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 "
            variant="outline"
            onClick={handleBudget}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Créer le budget"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </form>
  </Dialog>
  )
}
