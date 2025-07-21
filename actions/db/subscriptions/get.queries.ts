'use server';
import prisma from '@/lib/prisma';

export const getAllSubscriptions = async (page:number, pageSize:number) => {
  try {
    const skip = (page - 1) * pageSize;

    const [subscriptions, totalCount] = await Promise.all([
      prisma.subscription.findMany({
        skip,
        take: pageSize,
        include: {
          user: true,
          plan: true,
          Budget: true
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.subscription.count()
    ]);

    return {
      statusCode: 200,
      subscriptions,
      pagination: {
        totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      }
    };
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return {
      statusCode: 500,
      message: "Failed to retrieve subscriptions",
    };
  }
};