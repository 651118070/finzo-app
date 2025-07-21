import { checkUser } from "../db/user/checkUser.queries";
export const checkUserAction = async (email: string)=>{
  try {
    const user = await checkUser(email);
    return{
        message:user?.message,
        statusCode:user?.statusCode || 200
    };
  } catch (error) {
    console.error("Error in checkUserAction:", error);
    return {
      message: "Error checking user",
      statusCode: 500,
    };
  }
}