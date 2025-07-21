import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
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
      return NextResponse.json({ message: "No expired subscriptions found." });
    }

    const starterPlan = await prisma.plan.findFirst({
      where: { name: "Starter" },
    });

    if (!starterPlan) {
      return NextResponse.json({ message: "Starter plan not found." }, { status: 500 });
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

    return NextResponse.json({ message: "Expired subscriptions reset to Starter.", count: expiredSubscriptions.length });
  } catch (error) {
    console.error("Error during subscription check:", error);
    return NextResponse.json({ message: "Internal server error", error: String(error) }, { status: 500 });
  }
}
