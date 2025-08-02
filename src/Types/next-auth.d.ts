import 'next-auth';
import { de, is } from 'zod/locales';

//so here a concept is used
//earlier we werer using the interface to defiine the types
//but not to override some exisiting types in the next-auth module

//! we are first importing the next-auth module
//! then we are using the module augmentation to extend the next-auth module


//overriding the User interface in next-auth module
//according to our need
declare module 'next-auth' {
    interface User {
        _id?: string; //adding the _id field to the User interface
        isVerified?: boolean; //adding the isVerified field to the User interface
        isAcceptingMessages?: boolean; //adding the isAcceptingMessages field to the User interface
        username?: string; //adding the username field to the User interface
    }
    //overriding the Session interface in next-auth module
    interface Session {
        user: {
            _id?: string; //adding the _id field to the User interface
            isVerified?: boolean; //adding the isVerified field to the User interface
            isAcceptingMessages?: boolean; //adding the isAcceptingMessages field to the User interface
            username?: string; //adding the username field to the User interface
        } & DefaultSession['user']; //extending the user interface with the DefaultSession['user'] interface`
    }
}


//similarly we can override the JWT interface in next-auth module
declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string; //adding the _id field to the JWT interface
        isVerified?: boolean; //adding the isVerified field to the JWT interface
        isAcceptingMessages?: boolean; //adding the isAcceptingMessages field to the JWT interface
        username?: string; //adding the username field to the JWT interface
    }
    //overriding the JWT interface in next-auth module
}