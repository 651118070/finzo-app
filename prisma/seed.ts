import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.plan.createMany({
    data: [
      {
        name: "Starter",
        price: 0,
        frequency: "mois",
        features: [
          "5 budgets",
          "Statistiques de base",
          "Support communautaire"
        ],
      },
     
      {
        name: "Premium",
        price: 1500,
        frequency: "mois",
        features: [
          "Tout dans Pro",
          "Budgets illimités",
          "Analyses avancées",
          "Rapports téléchargeables"
        ],
      },
      {
        name: "Pro",
        price: 1000,
        frequency: "mois",
        features: [
          "Jusqu'à 10 budgets",
          "Statistiques améliorées",
          "Support prioritaire"
        ],
        badge: true,
      },
    ],
  });

  console.log("✅ Plans seeded successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
