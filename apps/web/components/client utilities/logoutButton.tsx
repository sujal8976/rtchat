"use client";

import { Button } from "@repo/ui/components/ui/button";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <Button
      onClick={() => {
        signOut();
      }}
      className="text-base"
    >
      Logout
    </Button>
  );
}
