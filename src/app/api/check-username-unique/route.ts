import {z} from "zod";
import userModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { usernameValidation } from "@/schemas/signUpSchema";


//now the thing about zod is

//1....   first u make up a schema 
//2....  then u validate that the data is valid according to the schema
//3.... the schema only holds the data types and the validation rules 
//4.... over here we are practically validating the username and this username is validating saperately because
//5.... i want to check the username in the unput box only and give the suggestion to the user while he is typing and show him that the username is already taken or not
//6.... so we are douing it saperately
//7.... but when u do it for the whole sign up form then u can use the signUpSchema to validate the whole form
//8.... there whole of the fields will be validated and then the data will be sent to the server in one single schema only


//getting the schema for the username
const userQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: Request) {
    //here we will add an additional chcek to ensure that the req in GET request only 
    // u can add this to every route to ensure that the req is GET request only
    //this is a good practice to ensure that the req is the type of request that u want only
    if (request.method !== "GET") {
        return Response.json({
            success: false,
            message: "Method not allowed",
        }, {status: 405});
    }

    await dbConnect();
    try {
        //now here first we need to get the username from the query params
        //the url contains the username in the query params
        //so we are first extrating the url and then from that url we are extracting the query params
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username'),
        };
        //validate with zod
        //the current username is validated with the schema that we have defined above and if it is not valid then we will return an error
        const result = userQuerySchema.safeParse(queryParam);
        if (!result.success) {
            //this is a way to filter out the errors from the zod schema
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: usernameErrors.join(', '),
            }, {status: 400});
        }

        const {username} = result.data;
        //checking if the username is already taken
        const existingUser = await userModel.findOne({
            username,
            isVerified: true  // 🔑 KEY CHANGE: Only consider verified users
        });
        if (existingUser) {
            return Response.json({
                success: false,
                message: "Username already taken",
            }, {status: 400});
        }

        //returning the response if the username is unique
        return Response.json({
            success: true,
            message: "Username is unique",
        }, {status: 200});
        
    } catch (error) {
        console.error("Error in checking username uniqueness:", error);
        return Response.json({
            success: false,
            message: "Error in checking username uniqueness"
        }, {status: 500});
    }
}
