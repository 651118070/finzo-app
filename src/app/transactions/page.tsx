"use client";
import React, { useEffect, useState } from "react";
import { getTransactionByMailAndPeriodAction } from "../../../actions/transactions/getByPeriod";
import { useUser } from "@clerk/nextjs";
import TransactionItem from "@/components/TransactionItem";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { fr } from "date-fns/locale"
import jsPDF from "jspdf"
import autoTable from 'jspdf-autotable';
import { Calendar } from "@/components/ui/calendar"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getUserAction } from "../../../actions/user/get";
import { Plan } from "@/types";

 
export default function Transactions() {
  const user = useUser();
  const email = user?.user?.primaryEmailAddress?.emailAddress || "";
  const[selectedPeriod,setSelectedPeriod]=useState<string>('')
    const [page2, setPage2] = useState(1);
    const [period] = useState("daily");
    const [userPlan,setUserPlan]=useState<Plan | null>(null)
  const [loading, setLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const pageSize = isSmallScreen ? 3 : 5;

  const [open,setOpen]=useState<boolean>(false)
  function getBase64FromUrl(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // Important if image is hosted remotely
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Could not get canvas context");
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = (err) => reject(err);
      img.src = url;
    });
  }
  const handlePeriodChange = (newPeriod: string) => {
    setSelectedPeriod(newPeriod);
    setPage2(1);
    // react-query auto refetches due to dependency change
  };
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await getUserAction(email);
        console.log('res', res);
  
        if (res.user) {
          const plans = res.user.plan;
          console.log('plans:', plans);
          setUserPlan(plans);
        } else {
          console.warn('No user found in response');
          setUserPlan(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUserPlan(null);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, [email]); // Only depend on values that are required
  
  
  const handleGeneratePDF = async() => {
    setLoading(true)
    if (!startDate || !endDate) return;

    const filtered = transactions.filter(tx => {
      const txDate = new Date(tx.createdAt ?? "");
      return txDate >= startDate && txDate <= endDate;
    });
  
    const doc = new jsPDF();
  
    // Add Logo (top-left, 40x15)
    const imgData = await getBase64FromUrl("/globe.svg");
    doc.addImage(imgData, "SVG", 10, 10, 40, 15);
  
    // Add User Email top-right
    doc.setFontSize(10);
    doc.text(`Email: ${email}`, 150, 15);
  
    // Title
    doc.setFontSize(14);
    doc.text(
      `Transactions du ${startDate.toLocaleDateString("fr-FR")} au ${endDate.toLocaleDateString("fr-FR")}`,
      10,
      35
    );
  
    // Table columns
    const tableColumn = ["#", "Transaction", "Montant (FCFA)", "Date"];
  
    // Table rows
    const tableRows = filtered.map((tx, index) => [
      index + 1,
      tx.description,
      tx.amount.toLocaleString(),
      new Date(tx.createdAt ?? "").toLocaleDateString("fr-FR"),
    ]);
  
    // Calculate total
    const totalAmount = filtered.reduce((acc, tx) => acc + tx.amount, 0);
  
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows.map(row => row.map(cell => cell ?? "")),
      startY: 45,
      theme: "striped",
      headStyles: { fillColor: [22, 160, 133] },
      footStyles: { fillColor: [22, 160, 133] },
      didDrawPage: (data) => {
        if (data.cursor) {
          const finalY = data.cursor.y + 10;
          doc.setFontSize(12);
          doc.text(`Total: ${totalAmount.toLocaleString()} FCFA`, 10, finalY);
        }
      },
    });
    
  
    doc.save("transactions.pdf");
  
    toast("creation du PDF des transactions")
    setOpen(false)
    setLoading(false)
  }
  const {
    data: transactionsData,
  } = useQuery({
    queryKey: ["transactions", email, period],
    queryFn: () => getTransactionByMailAndPeriodAction(email, period,page2,pageSize),
    enabled: !!email && !!period,
  });

  // Handle derived state for UI
 
  const totalPages2=transactionsData?.pagination?.totalPages

  const transactions = transactionsData?.transactions ?? [];

  return (
    <div className="m-4">
      {!loading && transactions.length > 0 ? (
        <div className="mt-6">
         <div className="flex justify-between md:flex-row flex-col">
         <div className="flex  justify-between gap-x-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Vos Transactions</h2>
            <select
              value={selectedPeriod}
        onChange={(e) => {
          setSelectedPeriod(e.target.value);     // update UI
          handlePeriodChange(e.target.value);     // fetch new data
        }}
              className="rounded-full bg-slate-900 dark:bg-slate-50 text-white dark:text-black px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
         
              <option value="daily">Dernier jour</option>
              <option value="weekly">Derniers semaines</option>
              <option value="monthly">Derniers mois</option>
              <option value="yearly">Dernière année</option>
            
            </select>
          </div>
          <div>
            {
              userPlan?.name === 'Premium' ?   <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
              
                <Button variant="outline">Exporter les Transactions en PDF</Button>
              </DialogTrigger>
        
              <DialogContent className="sm:max-w-[425px]">
                <div className="flex flex-col gap-4">
                  <h2 className="text-lg font-bold">Exporter les transactions</h2>
        
                  <div>
                    <p>De :</p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          data-empty={!startDate}
                          className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP",{locale:fr}) : <span>Choisir une date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => setStartDate(date ?? undefined)}
                        
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
        
                  <div>
                    <p>À :</p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          data-empty={!endDate}
                          className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP",{locale:fr}) : <span>Choisir une date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={(date) => setEndDate(date ?? undefined)}
                        
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
        
                  <Button  className="bg-emerald-500 text-white hover:text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 " variant="outline" onClick={handleGeneratePDF} disabled={!startDate || !endDate}>
                    {loading? <div className="rounded-full border-white border-2 border-t-0 animate-spin"></div>: <p>Générer le PDF</p>}
                  </Button>
                </div>
              </DialogContent>
            </Dialog> : null
            }
        
          </div>
          
          </div> 
       <div className="flex flex-col">
       <div className="grid md:grid-cols-3 gap-4 w-full mt-4">
            {transactions.map((transaction) => (
            
                <Link
                href={`/manage/${transaction.budgetId}`}
                key={transaction.id}
              >
                <TransactionItem transaction={transaction} />
              </Link>
               
          
            ))}
          
          </div>
          <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage2((prev) => Math.max(prev - 1, 1))}
                      className={page2 === 1 ? "opacity-50 pointer-events-none" : ""}
                    />
                  </PaginationItem>

                  <PaginationItem>
                    <span className="px-4 text-sm text-muted-foreground">
                      Page {page2} sur {totalPages2}
                    </span>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPage2((prev) => Math.min(prev + 1, totalPages2 ?? 0))
                      }
                      className={page2 === totalPages2 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
       </div>
        </div>
      ) : (
        <div className="text-gray-500 flex justify-between">
          Aucune transaction trouvée pour cette période.
          <select
            
              value={selectedPeriod}
        onChange={(e) => {
          setSelectedPeriod(e.target.value);     // update UI
          handlePeriodChange(e.target.value);     // fetch new data
        }}
              className="rounded-full bg-slate-900  dark:bg-slate-50 text-white dark:text-black px-4 py-2 text-sm transition duration-200 mb-4"
            >
              
              <option value="daily">Dernier jour</option>
              <option value="weekly">Derniers semaines</option>
              <option value="monthly"> mois Derniers</option>
              <option value="yearly">année Dernière </option>
              
            </select>
        </div>
      )}
    </div>
  );
}
