// pages/api/subscription-check.ts (or /app/api/subscription-check/route.ts for Next.js 13 app dir)
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // Adjust import path as needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const now = new Date();

  try {
    const expiredSubscriptions = await prisma.subscription.findMany({
      where: {
        endDate: { lt: now },
        plan: {
          NOT: { name: "Starter" },
        },
      },
      include: { plan: true },
    });

    if (expiredSubscriptions.length === 0) {
      return res.status(200).json({ message: "No expired subscriptions found." });
    }

    const starterPlan = await prisma.plan.findFirst({
      where: { name: "Starter" },
    });

    if (!starterPlan) {
      return res.status(500).json({ message: "Starter plan not found." });
    }

    for (const sub of expiredSubscriptions) {
      await prisma.subscription.update({
        where: { id: sub.id },
        data: {
          planId: starterPlan.id,
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1000)),
        },
      });
    }

    return res.status(200).json({ message: "Expired subscriptions reset to Starter.", count: expiredSubscriptions.length });
  } catch (error) {
    console.error("Error during subscription check:", error);
    return res.status(500).json({ message: "Internal server error", error: String(error) });
  }
}
