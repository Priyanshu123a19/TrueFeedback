import {Message} from "@/model/User"
//here we will define the types for the API response
//the acute type of the response will be defined in the API route



//remember that on making a proper inteerface for the response we can use it literally anywhere in the codebase
//for eg if this same response is used in the frontend then we can use this to fetch the messages and display them in the UI
//so this is a good practice to make a proper interface for the response
export interface ApiResponse{
    success: boolean; //indicates if the API call was successful
    message: string; //message to be returned to the user
    isAcceptingMessages?: boolean; //optional field to indicate if the API is accepting messages
    Messages?: Array<Message>; //optional field to return messages if the API is accepting messages
}