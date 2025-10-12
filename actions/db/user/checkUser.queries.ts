// 'use server';
// import prisma from "@/lib/prisma";

// export const checkUser = async (email: string) => {
//   try {
//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user) {
//       const freePlan = await prisma.plan.findFirst({
//         where: { name: "Starter" }, 
//       });

//       if (!freePlan) {
//         return {
//           message: "Free plan not found",
//           statusCode: 500,
//         };
//       }

//       const newUser = await prisma.user.create({
//         data: {
//           email,
//           Subscription: {
//             create: {
//               planId: freePlan.id,
//               startDate: new Date(),
//               endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 100)),
//               active: true,
//             },
//           },
//         },
//         include: {
//           Subscription: true,
//         },
//       });

//       return {
//         message: "User cree avec sucess",
//         statusCode: 201,
//         user: newUser,
//       };
//     } else {
//       return {
//         message: "Utilisateur existe deja",
//         statusCode: 400,
//       };
//     }
//   } catch (error) {
//     console.error("Error checking user:", error);
//     return {
//       message: "Internal server error",
//       statusCode: 500,
//     };
//   }
// };
'use server';
import prisma from "@/lib/prisma";

export const checkUser = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const freePlan = await prisma.plan.findFirst({
        where: { name: "Starter" },
      });

      if (!freePlan) {
        return {
          message: "Free plan not found",
          statusCode: 500,
        };
      }

      const newUser = await prisma.user.create({
        data: {
          email,
          subscriptions: {
            create: {
              planId: freePlan.id,
              startDate: new Date(),
              endDate: new Date(
                new Date().setFullYear(new Date().getFullYear() + 100)
              ),
              active: true,
            },
          },
        },
        include: {
          subscriptions: true,
        },
      });

      return {
        message: "User créé avec succès",
        statusCode: 201,
        user: newUser,
      };
    } else {
      return {
        message: "Utilisateur existe déjà",
        statusCode: 400,
      };
    }
  } catch (error) {
    console.error("Error checking user:", error);
    return {
      message: "Internal server error",
      statusCode: 500,
    };
  }
};
