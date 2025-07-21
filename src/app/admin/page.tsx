import { checkRole } from "@/utils/role";
import { redirect } from "next/navigation";
import React from "react";
import SubscriptionsPage from "./__components/admin";

export default async function Subscription() {
  const isAdmin = await checkRole("admin");
  if (!isAdmin) {
    redirect("/");
  }
  return <SubscriptionsPage />;
}
