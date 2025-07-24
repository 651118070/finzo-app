import { getUser } from "../db/user/getUser.queries";
export const getUserAction = async (email: string)=>{
  try {
    const user = await getUser(email);
    return{
        message:user?.message,
        statusCode:user?.statusCode || 200,
        user:user.data
    };
  } catch (error) {
    console.error("Error in checkUserAction:", error);
    return {
      message: "Erreur durant la recuperation de l'utilisateur",
      statusCode: 500,
    };
  }
}