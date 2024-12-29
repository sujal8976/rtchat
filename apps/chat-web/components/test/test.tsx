"use client"

import { Button } from "@repo/ui/components/ui/button"
import { signOut } from "next-auth/react"

export function Test(){
    return (
        <div>
        <Button onClick={async () => await signOut()}>Logout</Button>
      </div>
    )
}