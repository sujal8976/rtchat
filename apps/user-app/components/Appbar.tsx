"use client";

import { Button } from "@repo/ui/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

export const Appbar = () => {
    const session = useSession()

  return (
    <div className="flex w-full justify-between items-center">
      <Button
        onClick={() => {
          signIn();
        }}
      >
        Login
      </Button>
      <Button
        onClick={() => {
          signOut();
        }}
      >
        Logout
      </Button>

      {JSON.stringify(session)}
    </div>
  );
};
