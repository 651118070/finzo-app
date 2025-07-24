'use server';
import prisma from '@/lib/prisma';

export const getAllPlans = async () => {
  try {
    const plans = await prisma.plan.findMany();

    return {
      statusCode: 200,
      plans,
    };
  } catch (error) {
    console.error("Error fetching plans:", error);
    return {
      statusCode: 500,
      message: "Plans introuvable",
    };
  }
};
