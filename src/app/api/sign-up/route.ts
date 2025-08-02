import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
//somtimes error occur while importing that is just becauise of the order of import or the typescript needs additional configuration
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";



// so this is the explaination on how this routing works in nextjs
//when i created api then this means that "/" is the endpoint and then the "/api" is the endpoint now
//now i made the "sign-up" folder inside the "api" folder so now the endpoint is "/api/sign-up"
//then i made the "route.ts" file inside the "sign-up" folder so now the endpoint is "/api/sign-up/route"
//so now i just need to write the code for the POST method in this file
//ultimately i dont care about the route handeling then making contrllers etc...nothihng like that
//so see how easy it is to create an API in nextjs

//!so ultimate summary of this talk is that the files names are the endpoints and the folders are the sub-endpoints

//! remember that the database will be req in all the routes as u are making req to database as the edge time server so we have already optimized the
//!database for the connection again and again and handled it there so no harm in making the connection here

export async function POST(request: Request) {
    await dbConnect();

    try {
        const {username, email, password} = await request.json();

        //getting the existing user
        const existingUserVerifiedByUsername = await userModel.findOne(
            {
                username,
                isVerified: true
            }
        )
        //returning the response if the user is already registered
        //but not verified
        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "User already registered with this username"
            }, {status: 400});
        }
        //now according to the business logic if the user is reg with email and not verified then we will send the verification email again
        //else if the user is completely new then we will create a new user
        const existingUserByEmail = await userModel.findOne(
            {
                email
            }
        );

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); //generating a random 6 digit code

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "User already registered with this email"
                }, {status: 400});
            }else{
                //here we will update the existing user with the new verify code and expiry date
                //and here somehow we can update his new password if he wants to
                const hashedPassword = await bcrypt.hash(password, 10); //hashing the password
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); //setting the expiry date to 1 hour from now
                existingUserByEmail.password = hashedPassword; //updating the password

                await existingUserByEmail.save(); //saving the user
                // the verification email will be sent in the very end
            }
        }
        else{
            //here we will create a new user
            const hashedPassword = await bcrypt.hash(password, 10); //hashing the password

            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1); //setting the expiry date to 1 hour from now

            const newUser = new userModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true, //default value
                messages: []
            });

            await newUser.save();  
        }
        //sending the verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );

        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {status: 500});
        }

        return Response.json({
            success: true,
            message: "User registered successfully. Verification email sent."
        }, {status: 201});

    } catch (error) { 
        console.error("Error in regestering the user:", error);
        return Response.json({
            success: false,
            message: "Error in registering the user",
        }, {
            status: 500
        })
    }
}