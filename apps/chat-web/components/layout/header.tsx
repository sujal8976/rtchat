"use client";

import { Button } from "@repo/ui/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Menu, UserCircle, X } from "@repo/ui/icons";
import { ModeToggle } from "@repo/ui/components/theme/selectMode";
import Link from "next/link";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@repo/ui/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@repo/ui/components/ui/sheet";
import { useState } from "react";
import { SidebarContent } from "./sidebarContent";

export const Header = () => {
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <header className="dark:border-b-slate-600 border-b-2 flex justify-center">
      <div className="flex items-center justify-between min-w-[90%]">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden top-4 left-4 z-50">
            <Button variant="outline" size="icon">
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex-1 lg:hidden flex flex-col">
            <SheetHeader>
              <SheetTitle className="text-3xl text-center font-semibold py-5">
                Logo
              </SheetTitle>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <Link href={"/"} className="flex-grow text-center lg:text-left">
          <div className="text-3xl font-semibold py-3 hidden sm:block ">Logo</div>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarFallback>
                      <UserCircle className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                <DropdownMenuLabel className="font-normal">{session?.data?.user?.username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={()=> signOut()} className="font-medium">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <ModeToggle />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
