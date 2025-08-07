'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import axios from "axios"
import { ApiResponse } from "@/Types/ApiResponse"
import { Message } from "@/model/User"
import { toast } from "react-toastify"

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
}

//if u dont define the props types then it will throw an error
//now on the upper side we will define the props types
const MessageCard = ({message,onMessageDelete}: MessageCardProps) => {
    const handleDeleteConfirm = async()=>{
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
      //making a toast notification
      if(response.data.success){
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
    }else{
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      onMessageDelete(message._id?.toString() || '');
    }
  return (
   <Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive"><X className="w-5 h-5"/></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
  </CardContent>
</Card>
  )
}

export default MessageCard