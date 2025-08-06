//now over here u mustve seen we need the dynamic data of the username so that we can verify the user
//the verifiucation process requires the username to be passed in the URL and then the otp is sent to the email


//! the main code logic is like the full api url of this [username] will be /api/verfiy/[username] so now u see why we made this square brackets
//! this just because the username is dynamic and we need to get it from the URL so its like a param and we cannot make it look like a normal api endpoint
//so we make square bractket to specify that this is a  dynamic route that will just give u the dynamic data of the username

'use client';
import { Button } from '@/components/ui/button';
import { FormControl,FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { verifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import {useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';

const page = () => {
    //using the router so that we can redirec tthe user to any page we want after the verification is done
    const router = useRouter();
    const param = useParams<{ username: string }>();
    //
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: '' // default value will be required to ensure controlled input
        }
      });

      const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        //now using the try catch block we weill be getting the data from the form  and the data and then thhat will help us verify the user
        try {
            const response = await axios.post(`/api/verify-code`, {
                //over here we are sending the data to the backend
                username: param.username,
                code: data.code
            })

            //now after sending this otp sucessfully we will make a toast notification
            toast.success('Verification successful! You can now log in.', {
                position: "top-right",
            });

            //now going to the sign-in page
            router.replace('sign-in');
        } catch (error) {
            //if there is an error we will catch it and then show the error message
            const axiosError = error as AxiosError<any>;
            console.error('Verification error:', axiosError);
            toast.error(axiosError.response?.data?.message || 'Verification failed. Please try again.', {
                position: "top-right",
            });

        }
      }
  return (
    <div className='flex justify-center items-center min-h-screen bg-grey-100'>
        <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
            <div className='text-center'>
                <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
                    Verify your account
                </h1>
                <p className='mb-4'>
                    enter the verification code sent to your email address
                </p>
            </div>
            <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>code</FormLabel>
              <FormControl>
                <Input placeholder="code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
        </div>
    </div>
  )
}

export default page