"use client";
import React, { useState } from "react";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { BanknoteArrowUp, DollarSign, PiggyBank } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

import { useUser } from "@clerk/nextjs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import BudgetItem from "@/components/BudgetItem";
import TransactionItem from "@/components/TransactionItem";
import {
  getTransactionsByBudgetsUser,
  getTransactionsCount,
} from "../../../../actions/transactions/get";
import {
  getBudgetFinishedAction,
  getBudgetsPeriodAction,
} from "../../../../actions/budget/get";
import { getTransactionByMailAndPeriodAction } from "../../../../actions/transactions/getByPeriod";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const user = useUser();
  const email = user?.user?.primaryEmailAddress?.emailAddress || "";
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const pageSize = isSmallScreen ? 3 : 5;

  const [page, setPage] = useState(1);
  const [page1, setPage1] = useState(1);
  const [period] = useState("daily");

  // Total Amount
  const { data: totalAmountData, isLoading: isTotalAmountLoading } = useQuery({
    queryKey: ["totalAmount", email],
    queryFn: () => getTransactionsByBudgetsUser(email),
    enabled: !!email,
  });

  // Total Count of transactions
  const { data: totalCountData, isLoading: isTotalCountLoading } = useQuery({
    queryKey: ["totalCount", email],
    queryFn: () => getTransactionsCount(email),
    enabled: !!email,
  });

  // Budgets finished count and total budgets
  const { data: budgetFinishedData, isLoading: isBudgetFinishedLoading } =
    useQuery({
      queryKey: ["budgetFinished", email],
      queryFn: () => getBudgetFinishedAction(email),
      enabled: !!email,
    });

  // Budgets paginated by period and page
  const { data: budgetsData, isLoading: isBudgetsLoading } = useQuery({
    queryKey: ["budgets", email, period, page, pageSize],
    queryFn: () => getBudgetsPeriodAction(email, period, page, pageSize),
    enabled: !!email && !!period,
    retry: false,
  });

  // Budget Month data for chart
  const { data: budgetMonthData, isLoading: isBudgetMonthLoading } = useQuery({
    queryKey: ["budgetMonth", email, period, page, pageSize],
    queryFn: () => getBudgetsPeriodAction(email, "monthly", page, pageSize),
    enabled: !!email,
  });

  // Transactions by period
  const { data: transactionsData, isLoading: isTransactionsLoading } = useQuery(
    {
      queryKey: ["transactions", email, period],
      queryFn: () =>
        getTransactionByMailAndPeriodAction(email, period, page1, pageSize),
      enabled: !!email && !!period,
    }
  );

  // Handle derived state for UI
  const totalAmount = totalAmountData?.totalAmount ?? 0;
  const totalCount = totalCountData?.totalCount ?? 0;
  const budgetCount = budgetFinishedData?.finishedBudgetsCount ?? 0;
  const totalBudget = budgetFinishedData?.totalBudgets ?? 0;
  const budgets = budgetsData?.budgets ?? [];
  const totalPages = budgetsData?.pagination?.totalPages ?? 0;
  const totalPages1 = transactionsData?.pagination?.totalPages;
  const budgetMonth = budgetMonthData?.budgets ?? [];
  const transactions = transactionsData?.transactions ?? [];

  // Chart data
  const chartData = budgetMonth.map((b) => {
    const spent = b.transactions?.reduce((sum, t) => sum + t.amount, 0) || 0;
    return {
      name: b.name,
      total: b.amount,
      spent: spent,
    };
  });

  // Loading overall (any query loading)
  const loading =
    isTotalAmountLoading ||
    isTotalCountLoading ||
    isBudgetFinishedLoading ||
    isBudgetsLoading ||
    isBudgetMonthLoading ||
    isTransactionsLoading;

  return (
    <div>
      {loading ? (
        <div className="rounded-full w-4 h-4 border-white border-t-0 animate-spin"></div>
      ) : (
        <div>
          <div className="grid md:grid-cols-3 m-6 gap-4">
            <Card className="bg-slate-50 hover:border-2 hover:border-emerald-600 dark:bg-slate-800 font-roboto w-full">
              <CardHeader>
                <CardDescription className="flex justify-between">
                  <div className="flex flex-col gap-y-2 text-lg">
                    <p className="text-slate-900 dark:text-slate-100 font-bold text-lg">
                      Total Transactions
                    </p>
                    <p className="text-slate-900 dark:text-slate-100 ">
                      {totalAmount} XAF
                    </p>
                  </div>
                  <div className="border rounded-full bg-emerald-600 w-10 h-10">
                    <p className="flex justify-center items-center text-white pt-2">
                      <DollarSign size={24} />
                    </p>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-50 hover:border-2 hover:border-emerald-600 dark:bg-slate-800 font-roboto w-full">
              <CardHeader>
                <CardDescription className="flex justify-between">
                  <div className="flex flex-col gap-y-2 text-lg">
                    <p className="text-slate-900 dark:text-slate-100 font-bold text-lg">
                      Nombres de Transactions effectuées
                    </p>
                    <p className="text-slate-900 dark:text-slate-100">
                      {totalCount}
                    </p>
                  </div>
                  <div className="border rounded-full bg-emerald-600 w-10 h-10">
                    <p className="flex justify-center items-center text-white pt-2">
                      <PiggyBank size={24} />
                    </p>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-50 hover:border-2 hover:border-emerald-600 dark:bg-slate-800 font-roboto w-full">
              <CardHeader>
                <CardDescription className="flex justify-between">
                  <div className="flex flex-col gap-y-2 text-lg">
                    <p className="text-slate-900 dark:text-slate-100 font-bold text-lg">
                      Budgets Atteints
                    </p>
                    <p className="text-slate-900 dark:text-slate-100">
                      {budgetCount}/{totalBudget}
                    </p>
                  </div>
                  <div className="border rounded-full bg-emerald-600 w-10 h-10">
                    <p className="flex justify-center items-center text-white pt-2 text-lg">
                      <BanknoteArrowUp size={24} />
                    </p>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mx-4">
            <div className="md:col-span-2 flex flex-col gap-6">
              <p>Statistiques des budgets recents</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} barSize={20} accessibilityLayer>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 6)}
                  />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937", // dark gray (e.g., Tailwind bg-gray-800)
                      color: "#000000", // light text (e.g., Tailwind text-gray-100)
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                    }}
                    itemStyle={{
                      color: "#f9fafb", // text color for tooltip items
                    }}
                    labelStyle={{
                      color: "#f9fafb", // label (top line) text color
                    }}
                  />
                  {/* Default Recharts tooltip */}
                  <Legend />
                  <Bar dataKey="total" fill="#10b981" radius={4} />
                  <Bar dataKey="spent" fill="#dc2626" radius={4} />
                </BarChart>
              </ResponsiveContainer>
              <p>Dernières Transactions</p>
              <div className="grid md:grid-cols-2 gap-4 w-full">
                <div className="flex flex-col gap-4">
                  {transactions.length === 0 ? (
                    <div> Aucune transaction</div>
                  ) : (
                    transactions.map((transaction) => (
                      <Link
                        href={`/manage/${transaction.id}`}
                        key={transaction.id}
                      >
                        <TransactionItem transaction={transaction} />
                      </Link>
                    ))
                  )}
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setPage1((prev) => Math.max(prev - 1, 1))
                          }
                          className={
                            page1 === 1 ? "opacity-50 pointer-events-none" : ""
                          }
                        />
                      </PaginationItem>

                      <PaginationItem>
                        <span className="px-4 text-sm text-muted-foreground">
                          Page {page1} sur {totalPages1}
                        </span>
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setPage1((prev) =>
                              Math.min(prev + 1, totalPages ?? 0)
                            )
                          }
                          className={
                            page1 === totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            </div>

            <div className="flex gap-y-4 flex-col">
              <p>Budgets</p>
              <div className="grid gap-4 w-full">
                {budgets.length === 0 ? (
                  <div>Aucun Budgets</div>
                ) : (
                  budgets.map((budget) => (
                    <Link href={`/manage/${budget.id}`} key={budget.id}>
                      <BudgetItem budget={budget} />
                    </Link>
                  ))
                )}

                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        className={
                          page === 1 ? "opacity-50 pointer-events-none" : ""
                        }
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
                          page === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
