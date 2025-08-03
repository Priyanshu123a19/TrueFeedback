import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import userModel from "@/model/User";
import {User} from "next-auth";
import mongoose from "mongoose";

//over here we are making the route for getting all the messages that the current user has got

export async function GET(req: Request) {
    //algo
    // 1. connect to the database
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
    // 4. get the user id from the session
    //here we have done this to make sure that we are using the correct user id
    //this will help us fight the errors in the future for the aggregation pipelines
    const userId = new mongoose.Types.ObjectId(user._id);

    //now here we are going to interact with the database and get all the messages that the user has got

    try {
        //now here we will be writing the aggregation pipeline to get the messages
        //there are 4 stages of the pipeline 
        //the first stage is to match the user id
        //the second stage is to unwind the messages array
        //the third stage is to sort the messages by createdAt in descending order
        //the fourth stage is to group the messages by user id and push the messages into an array
        //this will give us the messages in the format that we want
        const user = await userModel.aggregate([
            { $match: { _id: userId } },
            {$unwind: "$messages"},
            {$sort: {"messages.createdAt": -1}},
            {$group: {_id: "$_id", messages: {$push: "$messages"}}}
        ])

        if(!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "No messages found"
            }, {status: 404});
        }
        return Response.json({
            success: true,
            //remember that this pipeline will return an array with one object ultimately i couldve had more than one user
            //but in this case we are only fetching the messages of the current user
            //so we are just getting the user at the 0th place
            messages: user[0].messages
        }, {status: 200});
    } catch (error) {
        console.error("Error fetching messages:", error);
        return Response.json({
            success: false,
            message: "Internal server error"
        }, {status: 500});
    }
}
