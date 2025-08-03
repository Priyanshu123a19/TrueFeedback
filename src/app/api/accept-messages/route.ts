import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import userModel from "@/model/User";
import {User} from "next-auth";

export async function POST(req: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "You are not authenticated"
        }, {status: 401}); // ✅ Fixed syntax
    }

    const userId = user._id;
    const { acceptMessages } = await req.json();

    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        );

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 }); // ✅ Fixed syntax
        }

        return Response.json({
            success: true,
            message: "Accept messages updated successfully",
            updatedUser
        }, { status: 200 }); // ✅ Fixed syntax
    } catch (error) {
        console.error("Failed to update the accept message for the user", error); // ✅ Fixed typo
        return Response.json({
            success: false,
            message: "Failed to update the accept messages"
        }, { status: 500 }); // ✅ Fixed syntax
    }
}

export async function GET(req: Request) {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "You are not authenticated"
        }, { status: 401 }); // ✅ Fixed syntax
    }
    
    const userId = user._id;

    try {
        const foundUser = await userModel.findById(userId);
    
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 }); // ✅ Fixed syntax
        }
    
        return Response.json({
            success: true,
            message: "User accept messages status fetched successfully",
            isAcceptingMessages: foundUser.isAcceptingMessages
        }, { status: 200 }); // ✅ Fixed syntax
    } catch (error) {
        console.error("Failed to fetch user accept messages status", error);
        return Response.json({
            success: false,
            message: "Failed to fetch user accept messages status"
        }, { status: 500 }); // ✅ Fixed syntax
    }
}