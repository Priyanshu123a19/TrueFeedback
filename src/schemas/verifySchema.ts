import {z} from "zod";


// This schema is used to validate the data received from the user for verification
// the code that u use for the verification is a 6 digit code
//this is to ensure that the code is always 6 characters long
export const verifySchema = z.object({
    code: z.string().length(6, { message: "Verification code must be 6 characters long" }),

});


