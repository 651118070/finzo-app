"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import budgets from "./data";
import BudgetItem from "@/components/BudgetItem";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <div className="flex flex-col items-center gap-4 md:mt-10 mt-15 h-screen font-roboto">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
        Bienvenue sur Finzo
      </h1>

      <p className="text-lg text-center text-slate-600 dark:text-slate-400 mb-4">
        Votre gestion financière personnelle, simplifiée et professionnelle — la
        solution SaaS qui vous accompagne au quotidien.
      </p>

      {isLoaded && isSignedIn ? (
        <div className="flex flex-col items-center w-full">
          {/* Dashboard Access Button */}
          <div className="flex justify-center w-full">
            <Button
              className="bg-emerald-500 text-white mb-4 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 md:w-1/3 w-2/3"
              asChild
            >
              <a href="/dashboard">Accéder au tableau de bord</a>
            </Button>
          </div>

          {/* Budget Grid */}
          <div className="grid md:grid-cols-3 gap-4 w-full px-4">
            {budgets.map((budget) => (
              <Link href={`/manage/${budget.id}`} key={budget.id}>
                <BudgetItem budget={budget} />
              </Link>
            ))}
          </div>
          <div className="w-full p-4 flex justify-center">
            <Card className="dark:bg-transparent md:w-1/2  ">
              <CardContent className="p-4 flex flex-col md:flex-row gap-4 justify-center">
                <Link href="/pricing">
                  {" "}
                  <Button className="bg-emerald-500 text-white hover:text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 ">
                    Voir nos packages
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button className=" text-white hover:text-white bg-slate-600 hover:bg-slate-700">
                    Accedez au tableau de bord
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 w-full">
          {/* Buttons */}
          <div className="flex justify-center gap-4">
            <Link href="/sign-in">
              <Button className="bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500">
                Commencer
              </Button>
            </Link>
            <Button
              className="bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
              variant="outline"
            >
              En savoir plus
            </Button>
          </div>

          {/* Budget Grid */}
          <div className="grid md:grid-cols-3 gap-4 w-full px-4">
            {budgets.map((budget) => (
              <Link href={`/manage/${budget.id}`} key={budget.id}>
                <BudgetItem budget={budget} />
              </Link>
            ))}
          </div>
          <div className="w-full p-4 flex justify-center">
            <Card className="dark:bg-transparent bg-slate-50 w-1/2 ">
              <CardContent className="p-4 flex gap-4 justify-center">
                <Link href="/pricing">
                  {" "}
                  <Button className="bg-emerald-500 text-white hover:text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 ">
                    Voir nos packages
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button className=" text-white hover:text-white bg-slate-600">
                    Se connecter
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
