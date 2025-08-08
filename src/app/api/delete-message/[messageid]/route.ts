//suare bracket forlder so it accepts the message id as a parameter
//dynamic route
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import {User} from "next-auth";
import userModel from "@/model/User";

//over here we are making the route for getting all the messages that the current user has got

export async function DELETE(request: Request, {params}: {params: {messageid: string}}) {
    //algo
    // 1. connect to the database
    const messageId = params.messageid;
    await dbConnect();
    // 2. get the session of the user
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    // 3. check if the user is authenticated
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "You are not authenticated"
        }, {status: 401}); // ✅ Fixed syntax
    }
    

    //now we write the logic to delete the message
    try {
       const updatedResult = await userModel.updateOne(
            {_id: user._id},
            {$pull: {messages: {_id: messageId}}}
        );
        if(updatedResult.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Message not found or already deleted"
            }, {status: 404});
        }else {
            return Response.json({
                success: true,
                message: "Message deleted successfully"
            }, {status: 200});
        }
    } catch (error) {
        console.error("Error deleting message:", error);
        return Response.json({
            success: false,
            message: "Internal Server Error"
        }, {status: 500});
    }
   
}
