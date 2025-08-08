import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import userModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

// ✅ FIXED: Correct Next.js 15 type signature
export async function DELETE(
  request: Request,
  context: { params: Promise<{ messageid: string }> }
) {
  // ✅ FIXED: Await the params in Next.js 15
  const { messageid } = await context.params;
  
  await dbConnect();
  
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json({
      success: false,
      message: "You are not authenticated"
    }, { status: 401 });
  }

  try {
    const updatedResult = await userModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageid } } }
    );
    
    if (updatedResult.modifiedCount === 0) {
      return Response.json({
        success: false,
        message: "Message not found or already deleted"
      }, { status: 404 });
    } else {
      return Response.json({
        success: true,
        message: "Message deleted successfully"
      }, { status: 200 });
    }
  } catch (error) {
    console.error("Error deleting message:", error);
    return Response.json({
      success: false,
      message: "Internal Server Error"
    }, { status: 500 });
  }
}