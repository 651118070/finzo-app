export type Budget = {
    id?: string;
  name: string;
  amount: number;
  email?:string;
  emoji: string | null;
  budgets?:string[]
  totalTransactions?: number;
  sumOfTransactions?:number;
  transactions?:Transaction[];
  createdAt?:Date

};
export type User = {
  id: string;
  email: string;
  // add other user fields you need here
};



export type Subscription = {
  id: string;
  userId?: string;
  user?: User;
  planId: string;
  plan?: Plan;

  startDate: Date;
  endDate?: Date | null;  // optional or nullable to allow no expiry
  active: boolean;

  createdAt?: Date;

  budgetId?: string | null;
  budget?: Budget | null;
};
export type Transaction={
    id?:string;
    description:string;
    amount:number;
    emoji?:string | null;
    budgetId?:string | null ;
    budgetName?:string | null;
    createdAt?:Date;
}
export type Plan = {
  id: string;
  name: string
  price: number; // in your currency unit
  frequency: string;
  features: string[];

  createdAt?: Date;
};
