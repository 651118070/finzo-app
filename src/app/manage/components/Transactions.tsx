"use client";
import React, { useEffect, useState } from "react";
import { getTransactionsByBudgetsId } from "../../../../actions/transactions/get";
import { Budget, Transaction } from "../../../types";
import { useParams } from "next/navigation";
import BudgetItem from "@/components/BudgetItem";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { transactionBudgetAction } from "../../../../actions/transactions/update";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import EditBudget from "../components/EditBudget";
import DeleteBudget from "../components/DeleteBudget";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import CreateTransactions from "../components/CreateTransactions";
import { deleteTransactionAction } from "../../../../actions/transactions/delete";
import { getBudgetById } from "../../../../actions/db/budget/getById.queries";
import EmojiPicker from "emoji-picker-react";
export default function Transactions() {
  const params = useParams();
  const queryClient = useQueryClient();
  const budgetId = params?.budgetId as string;
  console.log("sa", budgetId);
  const [transaction, setTransaction] = useState<number>(0);
  const [description1, setDescription1] = useState<string>("");
  const [budget, setBudget] = useState<Budget | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgetPrice, setBudgetPrice] = useState<number>(0);
  const [emoji, setEmoji] = useState<string>("");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [deleteTransactionId, setDeleteTransactionId] = useState<string | null>(
    null
  );

  const [emojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const handleEmojiSelected = (emoji: { emoji: string }) => {
    setEmoji(emoji.emoji);
    setShowEmojiPicker(false);
  };
  const [page, setPage] = useState(1);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const pageSize = isSmallScreen ? 3 : 5;
  useEffect(() => {
    console.log("isSmallScreen", isSmallScreen);
  }, [isSmallScreen]);

  const { data } = useQuery({
    queryKey: ["budgets", budgetId],
    queryFn: () => getBudgetById(budgetId),
    enabled: !!budgetId,
    retry: false,
  });

  useEffect(() => {
    if (!data) return;

    if (data.statusCode !== 200) {
      toast.error(
        data.message || "Erreur lors de la récupération des budgets."
      );
    } else {
      const budget = data.budget;

      if (budget && !Array.isArray(budget)) {
        setBudget(budget);
        setBudgetPrice(data.sumTransactions);
      } else {
        setBudget(null); // Or handle array if needed
      }
    }
  }, [data]);
  const { data: transactionData, isLoading } = useQuery({
    queryKey: ["transactions", budgetId, page],
    queryFn: () => getTransactionsByBudgetsId(budgetId, page, pageSize),
    enabled: !!budgetId,
    retry: false,
  });

  useEffect(() => {
    if (!transactionData) return;

    if (transactionData.statusCode !== 200) {
      toast.error(
        transactionData.message ||
          "Erreur lors de la récupération des transactions."
      );
    } else {
      const fetchedTransactions = transactionData.transactions;

      if (Array.isArray(fetchedTransactions)) {
        setTransactions(fetchedTransactions);
      } else {
        setTransactions([]);
      }
    }
  }, [transactionData]);
  const totalPages = transactionData?.pagination?.totalPages;

  const mutation = useMutation({
    mutationFn: (transactionId: string) =>
      deleteTransactionAction(transactionId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success(response.message);
      setDeleteTransactionId(null);
    },
    onError: () => {
      toast.error("Une erreur est survenue lors de la suppression du budget.");
    },
  });

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!transactionId) {
      toast.error("Transaction ID is missing.");
      return;
    }
    mutation.mutate(transactionId);
  };

  // Update mutation
  const mutation1 = useMutation({
    mutationFn: ({
      transactionId,
      data,
    }: {
      transactionId: string;
      data: { description: string; amount: number; emoji: string };
    }) => transactionBudgetAction(transactionId, data),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success(response.message);
      setSelectedTransaction(null);
      setDescription1("");
      setTransaction(0);
      setEmoji("");
    },
  });

  const handleUpdateTransaction = (
    transactionId: string,
    data: { description: string; amount: number; emoji: string }
  ) => {
    if (!transactionId) {
      toast.error("Transaction ID is missing.");
      return;
    }

    mutation1.mutate({ transactionId, data });
  };

  return (
    <div className="grid md:grid-cols-2  m-4 md:m-10">
      <div className="max-w-md flex flex-col gap-y-4">
        <div>{budget && <BudgetItem budget={budget} />}</div>
        <div className="flex gap-4">
          <EditBudget id={budgetId} budget={budget} />
          <DeleteBudget id={budgetId} budget={budget} />
        </div>
        <CreateTransactions id={budgetId} />
      </div>

      {!isLoading && transactions.length === 0 ? (
        <p className="dark:text-slate-50 flex flex-col justify-center items-center space-y-2">
          <ArrowLeftRight size={60} />
          <span>No transactions found</span>
        </p>
      ) : (
        <div className="overflow-x-auto flex-1">
          <Table>
            <TableCaption>
              Une tableau de transactions pour le budget {budget?.name}.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Heure</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.emoji}</TableCell>
                  <TableCell>{tx.description}</TableCell>
                  <TableCell>
                    <Badge className="bg-red-500 text-white">
                      -{tx.amount}
                    </Badge>{" "}
                    XAF
                  </TableCell>
                  <TableCell>
                    {tx.createdAt
                      ? new Date(tx.createdAt).toLocaleDateString("fr-FR")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {tx.createdAt
                      ? new Date(tx.createdAt).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                      : "—"}
                  </TableCell>
                  <TableCell className="flex justify-center space-x-2">
                    {/* EDIT button */}
                    <Pencil
                      className="text-emerald-600 cursor-pointer"
                      size={20}
                      onClick={() => {
                        setSelectedTransaction(tx);
                        setDescription1(tx.description ?? "");
                        setTransaction(tx.amount ?? 0);
                        setEmoji(tx.emoji ?? "");
                      }}
                    />

                    {/* DELETE button and dialog */}
                    <Dialog
                      open={deleteTransactionId === tx.id}
                      onOpenChange={(open) => {
                        if (!open) setDeleteTransactionId(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Trash2
                          className="text-red-600 dark:text-red-400 cursor-pointer"
                          size={20}
                          onClick={() => setDeleteTransactionId(tx.id ?? "")}
                        />
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer la transaction{" "}
                            <span className="font-bold animate-pulse">
                              {tx.description}
                            </span>{" "}
                            ? Cette action est irréversible.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="outline">
                              Annuler
                            </Button>
                          </DialogClose>
                          <Button
                            className="bg-red-600 text-white hover:bg-red-700"
                            onClick={() => handleDeleteTransaction(tx.id ?? "")}
                            disabled={mutation.isPending}
                          >
                            {mutation.isPending ? (
                              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              "Supprimer la transaction"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell className="text-right">{budgetPrice} XAF</TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          {/* ✅ SINGLE EDIT DIALOG - rendered ONCE, outside the table */}
          {selectedTransaction && (
            <Dialog
              open={!!selectedTransaction}
              onOpenChange={(open) => {
                if (!open) setSelectedTransaction(null);
              }}
            >
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogDescription>
                    Modifier la transaction{" "}
                    <span className="font-bold animate-pulse">
                      {selectedTransaction.description}
                    </span>
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                  <Input
                    type="text"
                    placeholder="Description"
                    className="border-input"
                    value={description1}
                    onChange={(e) => setDescription1(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Montant"
                    className="border-input"
                    value={transaction}
                    onChange={(e) => setTransaction(parseFloat(e.target.value))}
                  />
                  <Button
                    className="bg-emerald-500 text-white hover:bg-emerald-600"
                    variant="outline"
                    onClick={() => setShowEmojiPicker(!emojiPicker)}
                  >
                    {emoji ||
                      selectedTransaction.emoji}
                  </Button>
                  {emojiPicker && (
                    <EmojiPicker onEmojiClick={handleEmojiSelected} />
                  )}
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Annuler
                    </Button>
                  </DialogClose>
                  <Button
                    className="bg-emerald-600 text-white"
                    onClick={() =>
                      handleUpdateTransaction(selectedTransaction.id ?? '', {
                        description: description1,
                        amount: transaction,
                        emoji: emoji || selectedTransaction.emoji || "",
                      })
                    }
                    disabled={mutation1.isPending}
                  >
                    {mutation1.isPending ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Modifier la transaction"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className={page === 1 ? "opacity-50 pointer-events-none" : ""}
                />
              </PaginationItem>

              <PaginationItem>
                <span className="px-4 text-sm text-muted-foreground">
                  Page {page} sur {totalPages}
                </span>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPage((p) => Math.min(p + 1, totalPages ?? 0))
                  }
                  className={
                    page === totalPages ? "opacity-50 pointer-events-none" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
