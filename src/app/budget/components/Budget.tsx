"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { Budget } from "../../../types";
import { toast } from "sonner";
import { getBudgetAction } from "../../../../actions/budget/get";
import Link from "next/link";
import BudgetItem from "@/components/BudgetItem";
import { useQuery} from "@tanstack/react-query";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import CreateBudget from "./Create";
import { useMediaQuery } from "@/hooks/useMediaQuery";
export default function Budgets() {
  const { user } = useUser();
 const [budgets, setBudgets] = useState<Budget[]>([]);
const [page, setPage] = useState(1);
const isSmallScreen = useMediaQuery("(max-width: 768px)");
const pageSize = isSmallScreen ? 3 : 5;
useEffect(() => {
    console.log("isSmallScreen", isSmallScreen);
  }, [isSmallScreen]);
  
 
  const email = user?.primaryEmailAddress?.emailAddress;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["budgets", email,page],
    queryFn: () => getBudgetAction(email ?? "",page,
      pageSize),
    enabled: !!email,
    retry: false,
  });

  useEffect(() => {
    if (!data) return;

    if (data.statusCode !== 200) {
      toast.error(
        data.message || "Erreur lors de la récupération des budgets."
      );
    } else {
      setBudgets(data.budgets ?? []);
    }
  }, [data]);

  if (isLoading) return <div>Chargement...</div>;
  if (isError) return <div>Erreur lors du chargement.</div>;


  const totalPages = data?.pagination?.totalPages;
  return (
    <div className="pt-4 px-5 font-roboto">
    <CreateBudget/>
      {budgets.length > 0 ? (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Vos Budgets</h2>

          <div className="grid md:grid-cols-3 gap-4 w-full mb-4">
            {budgets.map((budget) => (
              <Link href={`/manage/${budget.id}`} key={budget.id}>
                <BudgetItem budget={budget} />
              </Link>
            ))}
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  
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
                    setPage((prev) => Math.min(prev + 1, totalPages ?? 0))
                  }
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : (
        <p className="mt-6 text-gray-500">Aucun budget créé pour le moment.</p>
      )}
    </div>
  );
}
