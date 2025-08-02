//now here we are just addking the provider options to the next auth options
//that all handler method willt take care of the rest

import NextAuth from "next-auth";
import {authOptions} from "./options";

//handler funciton is a function that weill handle the requests to the next auth
//the provider that we have defined over here is a bit different form the default providers
//we are using the credentials provider to authenticate the user with email and password
//if it were google or facebook then we would have used the google or facebook provider

const handler = NextAuth(authOptions);


//we have to specifiy the GET and POST methods for the handler
//so that the next auth can handle the requests properly
export {handler as GET, handler as POST};

