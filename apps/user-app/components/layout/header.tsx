"use client";

import { Button } from "@repo/ui/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { UserCircle } from "@repo/ui/icons/userCircle";
import { ModeToggle } from "@repo/ui/components/theme/selectMode";
import Link from "next/link";

export const Header = () => {
  const session = useSession();

  return (
    <header className="dark:border-b border-b-2 flex justify-center">
      <div className="flex items-center justify-between min-w-[90%]">
        <Link href={"/"}>
          <div className="text-3xl font-semibold py-3">Logo</div>
        </Link>
        <div className="flex items-center space-x-4">
          {!session?.data?.user && (
            <div className="flex items-center space-x-4 py-4">
              <Button
                onClick={() => {
                  signIn();
                }}
              >
                Login
              </Button>
              <Link href={"/auth/register"}>
                <Button>Register</Button>
              </Link>
              <ModeToggle />
            </div>
          )}

          {session?.data?.user && (
            <div className="flex items-center space-x-4 py-4">
              <Avatar>
                <AvatarFallback>
                  <UserCircle className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <Button onClick={() => signOut()}>Logout</Button>
              <ModeToggle />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
