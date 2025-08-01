import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/Types/ApiResponse";
//here we are sending a verification email to the user

export async function sendVerificationEmail(
    //here we are setting up the parameters for the function
    //the email to which we are sending the verification email
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail({
                username,
                otp: verifyCode,
            }),
        });
        return {
            success: true,
            message: "Verification email sent successfully",
        };
    } catch (error) {
        console.error("Error sending verification email:", error);
        return {
            success: false,
            message: "Failed to send verification email",
        };
    }
}
