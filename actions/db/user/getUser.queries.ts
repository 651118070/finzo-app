'use server';
import prisma from "@/lib/prisma";

export const getUser = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email:email },
      include:{
        Subscription:{
            orderBy:{
                startDate:'desc'
            },
            include:{
                plan:true
            }
        }
      }
    });
    if (!user){
        return{
            message:'utilisateur introuvable',
            statusCode:400
        }
    }
    else{
        return{
            data:user.Subscription[0]
        }
    }
   


  
  } catch (error) {
    console.error("Error checking user:", error);
    return {
      message: "Internal server error",
      statusCode: 500,
    };
  }
};
