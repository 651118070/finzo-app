import cron from "node-cron";
import prisma from "../lib/prisma";

// Run every day at midnight (adjust as needed)
cron.schedule("0 0 28 * *", async () => {
  console.log("⏰ Running subscription expiration check...");

  const now = new Date();

  try {
    // 1. Fetch expired subscriptions
    const expiredSubscriptions = await prisma.subscription.findMany({
      where: {
        endDate: {
          lt: now,
        },
        plan: {
          NOT: {
            name: "Starter",
          },
        },
      },
      include: {
        plan: true,
      },
    });

    if (expiredSubscriptions.length === 0) {
      console.log("✅ No expired subscriptions found.");
      return;
    }

    console.log(`🔄 Found ${expiredSubscriptions.length} expired subscriptions. Reverting to Starter...`);

    // 2. Find the "Starter" plan
    const starterPlan = await prisma.plan.findFirst({
      where: { name: "Starter" },
    });

    if (!starterPlan) {
      console.error("❌ Starter plan not found.");
      return;
    }

    // 3. Update each expired subscription
    for (const sub of expiredSubscriptions) {
      await prisma.subscription.update({
        where: { id: sub.id },
        data: {
          planId: starterPlan.id,
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1000))

        },
      });
    }

    console.log("✅ Expired subscriptions reset to Starter.");
  } catch (error) {
    console.error("❌ Error during subscription check:", error);
  }
});
