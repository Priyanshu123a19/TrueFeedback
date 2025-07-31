import mongoose  from "mongoose";

//now from here first we need to create the type for the connection
//typescript needs this for the connection object so made a custom type for the connectionObject
type connectionObject = {
    isConnected?: number;
}

//create a variable to hold the connection
const connection: connectionObject = {};

//making the database connection
//here what the void means is that the function doesnt care what we are trying to return instead it just completes the operation
//in c++ it means it will return nothing
//but here the meaning is a lil bit different as explained above
async function dbConnect(): Promise<void> {
    //here we are trying to check that the connection is already established or not
    //since the nextjs is a edge runtime ...meaning that it will not run on the server side
    //it just calls the fucntion whenever it is needed
    //so in case of database it will try to connect to the database every time any database operation is called.
    //so we always check from this connection object that the connection is already established or not
    if(connection.isConnected){
        console.log("Already connected to the database");
        return;
    }

    //now if the connection is not established then we will try to connect to the database
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})

        //after getting the connection we are trying to set the connection object
        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to the database");

    } catch (error) {
        console.log("Error connecting to the database:", error);
         process.exit(1); // Exit the process with failure
    }
}

export default dbConnect;
