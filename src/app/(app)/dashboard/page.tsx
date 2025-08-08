'use client'

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/Types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const page = () => {
  //setting up the dashboard page
  //first we will import the message in the state
  //the an isloading state to show the loading spinner
  //then we will set up the messages state to store the messages
  //also there will be a state to show the loading spinner when the switch is toggled
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  // ✅ MOVED: Session hook to component level
  const {data:session} = useSession();
  
  //using the form for the code consistancy
  //other wise we could have just used states to manage the form data
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  //first of all we need to extract some data fro the form 
  //we will be manipulating this form according to our own custom use
  const { register, watch,setValue}=form;
  
  //now we will watch the acceptMessages field
  //this will give us the value of the acceptMessages field
  //and we will use this value to set the value of the acceptMessages field
  const acceptMessages= watch('acceptMessages');

  //we are just making sure to handle the callback function so that we can set the value of the acceptMessages field there it will tell us wheather the user is accepting the message or not
  const fetchAcceptMessage= useCallback(async ()=> {
    setIsSwitchLoading(true);
    try {
      const response= await axios.get(`/api/accept-messages`);
      //now over here we will be updating the messages
      setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Error fetching accept message', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error('Error fetching accept message:', axiosError.message);
    }finally{
      setIsSwitchLoading(false);
    }
  },[setValue])

  //now over here we will write the route to get the messages for the user
  const fetchMessages = useCallback(async (refresh: boolean=false)=>{ // ✅ ADDED: missing async
    setIsLoading(true);
    setIsSwitchLoading(true);
    try {
      const response =await axios.get<ApiResponse>('/api/get-messages');
      //now we will set the messages to the response data
      setMessages(response.data.messages || []);
      if (refresh) {
        toast.success('Messages refreshed successfully', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Error fetching messages', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error('Error fetching messages:', axiosError.message);
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  },[setIsLoading , setMessages]);
  
  useEffect(() => {
    if(!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  },[session,setValue , fetchMessages, fetchAcceptMessage]);

  //now we will create the necessary functions to handle the messages
  const handleMessageDelete = (messageId: string) => {
    //now this is called the optimistic ui approach what it is actually 
    //now u can literally delete the message from the state
    //and the user will see on the dashboard that the message is deleted
    //but the message is not actually deleted from the database
    //so we will call the api to delete the message from the database
    //in this way we show the immidiate result to the user but take the time which on our side that is safe for the api call to delete the message from the user's database
    setMessages(messages.filter(message => message._id?.toString() !== messageId));
  };

  //now we can handle the value of this acceptMessages field then hereby we can toggle the switch
  const handleSwitchChange = async ()=>{
    try {
      const response =await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages // ✅ FIXED: now accessible since it's at component level
      });
      // ✅ ADDED: Update form value after successful API call
      setValue('acceptMessages', !acceptMessages);
      toast.success('Message acceptance preference updated');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Error updating preference');
    }
  }

  if(!session || !session.user){
    return (
      <div>
        Dashboard
      </div>
    )
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success('Profile link copied to clipboard', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
            key={message._id?.toString() || index}
            message={message}
            onMessageDelete={handleMessageDelete}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default page