"use client";

import { useEffect, useState } from "react";
import { getSubscriptionsAction } from "../../../../actions/subscriptions/get";
import { updateSubscriptionAction } from "../../../../actions/subscriptions/update";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Subscription } from "@/types";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [ ,setEditSub] = useState<Subscription | null>(null);
  const [newPlanName, setNewPlanName] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const pageSize = isSmallScreen ? 3 : 5;
  useEffect(() => {
      console.log("isSmallScreen", isSmallScreen);
    }, [isSmallScreen]);
    
  const queryClient=useQueryClient()
   const mutation = useMutation({
      mutationFn: ({
        
            userId,
            plan,
          }: {
            userId: string;
            plan: string;
          }
      ) => updateSubscriptionAction(userId, plan),
  
      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
        toast.success(response.message);
        setOpen(false)
        
      },
  
      onError: () => {
        toast.error("Une erreur est survenue lors de la modification.");
      },
    });
  const handleEdit = async ({
        
    userId,
    plan,
  }: {
    userId: string;
    plan: string;
  }) => {
     
     mutation.mutate({
       userId,
       plan
     });
   };
  const { data } = useQuery({
    queryKey: ["subscriptions"],
      queryFn: () => getSubscriptionsAction(page,pageSize),
      retry:false,
    
  });
  const totalPages=data?.pagination?.totalPages
   useEffect(() => {
      if (!data) return;
  
      if (data.statusCode !== 200) {
        toast.error(
          data.message || "Erreur lors de la récupération des budgets."
        );
      } else {
        setSubscriptions(data.subscription || []);
      }
    }, [data]);



  return (
    <div className="p-6 font-roboto">
      <h1 className="text-2xl font-semibold mb-6">All Subscriptions</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((sub: Subscription) => (
              <TableRow key={sub.id}>
                <TableCell>
                  {sub.user?.id}__{sub.user?.email}
                </TableCell>
                <TableCell>{sub.plan?.name}</TableCell>
                <TableCell>{sub.active ? "✅" : "❌"}</TableCell>
                <TableCell>
                  {new Date(sub.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {sub.endDate
                    ? new Date(sub.endDate).toLocaleDateString()
                    : "No Expiry"}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {/* Edit Dialog */}
                  <Dialog
                    open={open}
                    onOpenChange={setOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditSub(sub);
                          setNewPlanName(sub.plan?.name || "");
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Modifier le pack</DialogTitle>
                        <DialogDescription>
                          Changer le plan <strong>{sub.id}</strong>.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="flex flex-col space-y-1">
                          <label htmlFor="planName" className="font-medium">
                            Nom du pack
                          </label>
                          <Input
                            id="planName"
                            value={newPlanName}
                            onChange={(e) => setNewPlanName(e.target.value)}
                            placeholder="Entrer le nouveau pack"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">
                            Annuler
                          </Button>
                        </DialogClose>
                        <Button
                          className="bg-emerald-500 text-white hover:text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 "
                          variant="outline"
                          onClick={() => {
                            handleEdit({
                              userId: sub.user!.id,
                              plan: newPlanName,
                            });
                          }}
                        >
                          {mutation.isPending ? (
                            <div className="rounded-full w-4 h-4 border-white border-2 border-t-0 animate-spin"></div>
                          ) : (
                            <p>Mettre a jour</p>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                 
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
    </div>
  );
}
