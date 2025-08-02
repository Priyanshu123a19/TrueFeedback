
import mongoose, { Schema, Document } from 'mongoose';

//remember we are making all this on typescript so we need to define the types
//here we have made a custom type for the user
//it just like this class now u can make this as a type in the upcoming schemas
export interface Message extends Document {
    content: String;
    createdAt: Date;
}

//see how the message is used in the schema data types inner type
const MessageSchema : Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

export interface User extends Document {
    username: String;
    email: String;
    password: String;
    verifyCode: String;
    verifyCodeExpiry: Date;
    isVerified: Boolean; // Optional field
    isAcceptingMessages: Boolean;
    messages: Message[];

}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Email is invalid'],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "Verification code is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verification code expiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema],
});

//the reason for this newer method is to make sure that if the model already exists, it doesn't throw an error
//and if it doesn't exist, it creates a new one

//the first part checks if the model already exists in mongoose.models then if it does, it uses that model
//if it doesn't, it creates a new model with the name 'user' and the schema UserSchema

//this is because the nextjs serverless function can be called multiple times
//and if the model is created multiple times, it will throw an error


const userModel = (mongoose.models.user as mongoose.Model<User>) || mongoose.model<User>('user', UserSchema);

export default userModel;