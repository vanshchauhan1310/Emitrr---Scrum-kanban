"use client"

import { UserButton } from '@clerk/nextjs'
import { Building2Icon } from 'lucide-react'
import React from 'react'

const UserMenu = () => {
  return (
  <UserButton appearance={{
    elements: {
      avatarBox: "h-10 w-10",
    }
  }}>


  <UserButton.MenuItems>
    <UserButton.Link
    href="/onboarding"
    label="My Organization"
    labelIcon={<Building2Icon className="w-4 h-4" />}
    >

    </UserButton.Link>

    <UserButton.Action label="manageAccount"/>
  </UserButton.MenuItems>
    
  </UserButton>
  )
}

export default UserMenu