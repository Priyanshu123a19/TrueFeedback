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

const MessageCard = ({message, onMessageDelete}: MessageCardProps) => {
  const handleDeleteConfirm = async() => {
    try {
      console.log('Deleting message with ID:', message._id); // ✅ Debug log
    const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
    
    console.log('Delete response:', response.data); // ✅ Debug log
      
      if(response.data.success){
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        onMessageDelete(message._id?.toString() || '');
      } else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error('Failed to delete message', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          {/* ✅ FIXED: Use static title since Message interface doesn't have title */}
          <CardTitle className="text-lg">
            Anonymous Message
          </CardTitle>
          
          {/* Delete button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <X className="w-4 h-4"/>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        {/* ✅ FIXED: Display formatted received date */}
        <CardDescription className="text-sm text-muted-foreground">
          {message.createdAt 
            ? new Date(message.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            : 'Date not available'
          }
        </CardDescription>
      </CardHeader>
      
      {/* ✅ FIXED: Display actual message content */}
      <CardContent>
        <p className="text-sm leading-relaxed">
          {message.content || 'No content available'}
        </p>
      </CardContent>
      
      {/* Optional footer for additional actions */}
      <CardFooter className="pt-0">
        <div className="text-xs text-muted-foreground">
          ID: {message._id?.toString().slice(-6) || 'Unknown'}
        </div>
      </CardFooter>
    </Card>
  )
}

export default MessageCard