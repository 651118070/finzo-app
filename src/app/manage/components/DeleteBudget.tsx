"use client"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { deleteBudgetAction } from '../../../../actions/budget/delete';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,

    DialogTrigger,
  } from "@/components/ui/dialog";

import { Budget } from '../../../types';
export default function DeleteBudget({id,budget}:{id:string,budget:Budget | null}) {
      const [open, setOpen] = useState(false);
      const queryClient = useQueryClient();

      const mutation = useMutation({
        mutationFn: (id: string) => deleteBudgetAction(id),
        onSuccess: (response) => {
          queryClient.invalidateQueries({ queryKey: ["budgets"] });
          toast.success(response.message);
          setOpen(false);
        },
        onError: () => {
          toast.error("Une erreur est survenue lors de la suppression du budget.");
        },
      });
      
      const handleDelete = () => {
        if (id) {
          toast.error("Budget ID is missing.");
          return;
        }
        mutation.mutate(id);
      };
      
  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button
        className="bg-red-500 w-[140px] text-white hover:text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 "
        variant="outline"
      >
        Supprimer le budget
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[400px]">
      <DialogHeader>
        <DialogDescription>
          Êtes-vous sûr de vouloir supprimer ce budget <span className='font-bold animate-pulse'>{budget?.name} </span>? Cette action
          est irréversible.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Annuler
          </Button>
        </DialogClose>
        <Button
          onClick={handleDelete}
          disabled={mutation.isPending}
          className="bg-red-500 text-white hover:text-white hover:bg-red-600"
        >
          {mutation.isPending? (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Supprimer le budget"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  )
}
