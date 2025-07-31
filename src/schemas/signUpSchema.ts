import {z} from "zod";

//now how actually we are going to validate the data that we are getting from the user
//we take the data from the user and then we validate it using this schema
//the z form the zod over here just makes sure that before we send the data to the database we get to see that the data is valid


//over here the username is just a property of the user
//so just write z. and the the property name that you want to validate
//and then you can chain the validation methods on it
export const usernameValidation = z
    .string()
    .min(2, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must not exceed 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/,"Username must only contain letters, numbers, and underscores")


//now we can use this usernameValidation in the signUpSchema
//over here we are just doing the same thing but for the full signUpSchema
//we are just using the usernameValidation that we created above
//and then we are adding the email and password validation
//u can also make saperate validation schemas for email and password
//and then use them here as well
//but right now we are just doing it inline
export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" })
});