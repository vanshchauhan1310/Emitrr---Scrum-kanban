"use client"

import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react"
import { SignInButton } from "@clerk/nextjs"
import Link from "next/link"
import Image from "next/image"
import { Button } from "./ui/button"
import { LogInIcon, PlusIcon } from "lucide-react"
import UserMenu from "./user-menu"
import UserLoading from "./user-loading"
import { useEffect, useState } from "react"

const Header = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/check-user');
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <header className="flex items-center justify-between p-4 container mx-auto">
      <nav className="flex items-center py-6 px-4 justify-between w-full">
        <Link href="/">
          <Image src="/logo2.png" alt="logo" width={200} height={100}
          className="object-contain h-10 w-auto" />
        </Link>
            
        <div className="flex items-center gap-4">
        <Link href="/project/create">
        <Button variant="outline" className="rounded-full">
          <PlusIcon className="w-4 h-4" />
           <span>Create Project</span>
        </Button>
        </Link>
          <SignedOut>
          <SignInButton forceRedirectUrl={"/onboarding"} >
            <Button variant="outline" className="rounded-full">
              <LogInIcon className="w-4 h-4" />
               <span>Sign In</span>
            </Button>
          </SignInButton>
        </SignedOut>

         <SignedIn>
          <UserMenu />
        </SignedIn>
      </div>
      </nav>
    {loading ? <UserLoading /> : null}
    </header>
  )
}

export default Header