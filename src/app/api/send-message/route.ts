import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { Message } from "@/model/User";
export async function POST(req: Request) {
    await dbConnect();
    try {
        const { username, content } = await req.json(); // ✅ Fixed typo

        // ✅ Add input validation
        if (!username || !content) {
            return Response.json({
                success: false,
                message: "Username and content are required"
            }, { status: 400 });
        }

        // Find the user by username
        const user = await userModel.findOne({ username });

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        // ✅ Check if user is accepting messages
        if (!user.isAcceptingMessages) {
            return Response.json({
                success: false,
                message: "User is not accepting messages"
            }, { status: 403 });
        }

        // ✅ Create message object without _id (let Mongoose handle it)
        const newMessage = {
            content,
            createdAt: new Date()
        };

        // Push the message and save
        //over here we need to specify the type of the message
        //this is because we are using the Message interface from the User model
        user.messages.push(newMessage as Message);
        await user.save(); // ✅ Added missing save operation

        // ✅ Added success response
        return Response.json({
            success: true,
            message: "Message sent successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("Error sending message:", error);
        return Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}