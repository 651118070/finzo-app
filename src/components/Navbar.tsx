"use client"
import React, { useEffect } from 'react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet"

import {Menu, Moon, Sun, X } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser,UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { checkUserAction } from '../../actions/user/user'
import Image from 'next/image'

export default function Navbar() {
    const { setTheme } = useTheme()
    const {isLoaded,isSignedIn,user}=useUser()
    useEffect(()=>{
      if(user?.primaryEmailAddress?.emailAddress){
        checkUserAction(user.primaryEmailAddress.emailAddress)
      }
    },[user])
  return (
    <nav className='flex justify-between px-4 bg-white dark:bg-slate-900 py-4 sticky top-0 z-50 shadow-sm '>
    <div>
      <Link href='/'>
      <Image src='/download.png' width={40}  height={40} alt='logo'/>
     
      </Link>
    </div>
    <div className='flex items-center gap-4'>
      {isLoaded && (
        (isSignedIn ? (
     <div>
           <div className='hidden md:flex items-center gap-4 text-slate-900 text-sm md:text-[16px] dark:text-slate-100 font-roboto'>
            <Link href='/budget'  className='hover:text-slate-600 dark:hover:text-slate-100'>
              Mon Budget
            </Link>
            <Link href='/dashboard'  className='hover:text-slate-600 dark:hover:text-slate-100'>
            Tableau de bord
            </Link>
            <Link href='/transactions'  className='hover:text-slate-600 dark:hover:text-slate-100'> 
            Transactions
            </Link>
            <UserButton  />

          </div>
         <div className='md:hidden z-[2000]'>
         <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline"><Menu/></Button>
          </SheetTrigger>
          <SheetContent className='pt-10 px-4'>
          <Link href='/budget' className='hover:text-slate-600 dark:hover:text-slate-900'>
              Mon Budget
            </Link>
            <Link href='/dashboard'  className='hover:text-slate-600 dark:hover:text-slate-900'>
            Tableau de bord
            </Link>
            <Link href='/transactions'  className='hover:text-slate-600 dark:hover:text-slate-900'> 
            Transactions
            </Link>
            <UserButton  />
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline"><X/></Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
         </div>
     </div>
          
          
        ):
      <div className='z-10 '>
        <Link href='/sign-in'>
          <Button className="bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500">Se connecter</Button>
        </Link>
      
      </div>
      )
      )}
   
        <DropdownMenu >
      <DropdownMenuTrigger asChild >
        <Button variant="outline" size="icon" className="z-10 relative">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className='z-10 mt-5 bg-white dark:bg-slate-900'>
        <DropdownMenuItem onClick={() => setTheme("light")} className='dark:hover:bg-slate-600'>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className='dark:hover:bg-slate-600'>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className='dark:hover:bg-slate-600'>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
    </nav>
  )
}
