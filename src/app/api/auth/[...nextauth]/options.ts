//defining the options for the nextauth
//because the nextauth uses this file to know what providers to use and what callbacks to use
//suppose u are using the google provider then u will have to define the google provider here
//and  then things taht u define here will automatically generate a html form for u in the backend and then that form will contain the provider{ie. the login system of the provider}, also the credential system will be generated automatically that u want the user to give so that we can 
//use custom creduntials to login

import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import bcrypt from "bcryptjs";

//now no need to ruttafy just understand the flow of the code here
//so the crisp explaination of all this is that we are using the credentials provider to authenticate the user
//and we dont want to use a google provider or a facebook provider we want our own custom provider
//se we are using the credentials provider to authenticate the user
//the credentials over hre are email and password and also the username the user ultimately gets his password and email checked then also the isverfied property is checked
//due to this custom logic we are able to authenticate the user
export const authOptions: NextAuthOptions ={
    providers: [
        CredentialsProvider({
            name: "Credentials",
            id: "credentials",
            credentials: {
                email: {label: "Email" , type: "text"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials:any): Promise<any> {
                await dbConnect();
                
                try {
                    //here we are getting the user from the database
                    const user = await userModel.findOne({
                        $or: [
                            {email: credentials.identifier.email},
                            {username: credentials.identifier.username}
                        ]
                    });
                    if(!user) {
                        throw new Error("User not found");
                    }
                    //now here we are checking our custom logic that if the user is not verified then we will throw an error
                    if(!user.isVerified) {
                        throw new Error("User not verified");
                    }
                    //now here we are checking the password of the user
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password.toString());
                    if(isPasswordValid) {
                        return user;
                    }else{
                        throw new Error("Invalid password");
                    }
                } catch (error) {
                    throw new Error("Error in authorizing user");
                }
            }
        })
    ],
    //route defined here is the sign-in route
    pages: {
        signIn: "/sign-in",
    },
    //here the sesscion strategy is set to jwt so that we can use the jwt token to authenticate the user
    //here we are using the jwt token to authenticate and we dont even have to do anything else
    //all is handled by nextauth
    //also this is like a magic like whenver u go for the route of /api/auth/sign-in then it will automatically redirect to the sign-in page
    //and the ui and the functionality is handled by nextauth
    //nothing to do by us
    session: {
        strategy: "jwt",
    },
    //secret is used to sign the JWT token
    secret: process.env.NEXTAUTH_SECRET,
    //now here we are defining the callbacks for the nextauth
    //these are the functions that are called with the nextauth is used for authentication with the credentials provider 
    // here we will be seeign the jwt and the session callbacks
    callbacks: {
        //now here we are using some logic 
        //the token craeted by the next auth is a simple object and only contains few details like the user id and the email
        //but i will add some more custom fields so that when this token is passed int he session then it can again be used and also the size of payload increases
        //but due to this i dont have to make another call to the database to get the user details
        // the key itself contains the details of the user

        async jwt({token,user}){
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            //now the new token is contained and packed with the payload of the user details
            return token;
        },
        async session({session,token}){
            //add4ed the user to the session
            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session;
        }
    }
}
