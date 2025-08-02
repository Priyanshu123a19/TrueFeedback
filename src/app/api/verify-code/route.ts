import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


//here again we made to valdiate the vierufy user

export async function POST(request: Request) {
    await dbConnect();


    try {
        const {username, code} = await request.json();

        //over here we are first decoding the username for the whole uri that we have got
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({
            username: decodedUsername,
        });

        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 404});
        }
        
        //now here we are checking if the user code mathces the code that we have sent to the user
        const isCodeValid = user.verifyCode === code;
        //also if valid then check that the code is not expired
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        //now here we are checking if the code is valid and not expired
        if(isCodeValid && isCodeNotExpired) {
            //now making the user verified
            user.isVerified = true;
            //saving the user
            await user.save();

            return Response.json({
                success: true,
                message: "User verified successfully"
            }, {status: 200});
        }
        //now we will check the both of then weather it is expired or not
        //or if the code is not valid
        else if(!isCodeValid) {
            return Response.json({
                success: false,
                message: "Invalid verification code"
            }, {status: 400});
        } else {
            return Response.json({
                success: false,
                message: "Verification code has expired"
            }, {status: 400});
        }

    } catch (error) {
        console.error("Error in POST /api/verify-user:", error);
        return Response.json({
            success: false,
            message: "Error in verifying user"
        }, {status: 500});
    }
}