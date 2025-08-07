'use client'
import React from 'react'
import Link from 'next/link'
import { useSession,signOut } from 'next-auth/react'
import {User} from 'next-auth'
import { Button } from './ui/button'
const Navbar = () => {

    //first we will extract the info on the session 
    //i again repeat that we will be needing the info not the session object
    const { data: session } = useSession()
    const user: User = session?.user as User;
  return (
    <nav className='p-4 md:p-6 shadow-md'>
        <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
            <a className='text-xl font-bold mb-4 md:mb-0' href="#">
                Mystry Message
            </a>
            {
                session ? (
                    //this logic is when the user is logged in
                    //so we will show the user info and a sign out button
                    <>
                    <span className='mr-4'>Welcome, {user?.username || user?.email}</span>
                    <Button className='w-full md:w-auto' onClick={() => signOut()}>Sign Out</Button>
                    </>
                ):(
                    //this logic is when the user is not logged in 
                    //so we just show the sign in button
                    //and we will redirect to the sign in page
                    <Link href="/sign-in">
                        <Button className='w-full md-auto'>Sign In</Button>
                    </Link>
                )
            }
        </div>
    </nav>
  )
}

export default Navbar