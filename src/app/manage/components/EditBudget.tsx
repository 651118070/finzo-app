"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmojiPicker from "emoji-picker-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateBudgetAction } from "../../../../actions/budget/update";
import { Budget } from "../../../types";
export default function EditBudget({id,budget}:{id:string,budget:Budget | null}) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [budgetName, setBudgetName] = useState("");
  const [budgetAmount, setBudgetAmount] = useState<number>(0);
  const [budgetEmoji, setBudgetEmoji] = useState("");
  const [emojiPicker1, setShowEmojiPicker1] = useState<boolean>(false);
  useEffect(() => {
    if (budget) {
      setBudgetName(budget.name);
      setBudgetAmount(budget.amount);
      setBudgetEmoji(budget.emoji ?? ""); // optional
    }
  }, [budget]);
  const handleBudgetEmojiSelected = (emoji: { emoji: string }) => {
    setBudgetEmoji(emoji.emoji);
    setShowEmojiPicker1(false);
  };
  const mutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name: string; emoji: string; amount: number };
    }) => updateBudgetAction(id, data),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success(response.message);
      setOpen(false);
    },

    onError: () => {
      toast.error("Une erreur est survenue lors de la création du budget.");
    },
  });

  const handleUpdate = async () => {
    if (!budget) {
      toast.error("Aucun budget sélectionné pour la mise à jour.");
      return;
    }
    mutation.mutate({
      id,
      data: {
        name: budgetName,
        emoji: budgetEmoji,
        amount: budgetAmount,
      },
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-emerald-500 w-[140px] text-white hover:text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 "
          variant="outline"
        >
          Modifier le budget
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogDescription>
            Modifier le budget{" "}
            <span className="font-semibold animate-pulse">{budget?.name}</span>
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
              placeholder={budget?.name || "Nom du budget"}
            />
          </div>
          <div className="grid gap-3">
            <Input
              type="number"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(Number(e.target.value))}
              className="border-input mb-3"
              required
              placeholder={String(budget?.amount) || "Montant du budget"}
            />
          </div>
          <Button
            className="bg-emerald-500 text-white hover:text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 "
            variant="outline"
            onClick={() => {
              setShowEmojiPicker1(!emojiPicker1);
            }}
          >
            {budgetEmoji  || budget?.emoji }
          </Button>
          {emojiPicker1 && (
            <EmojiPicker onEmojiClick={handleBudgetEmojiSelected} />
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Annuler
            </Button>
          </DialogClose>
          <Button
            onClick={handleUpdate}
            disabled={mutation.isPending}
            className="bg-emerald-500 text-white hover:text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 "
          >
            {mutation.isPending ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Modifier le budget"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
