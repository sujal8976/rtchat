"use client";

import { cn } from "@repo/ui/lib/utils";
import { ModeToggle } from "@repo/ui/components/theme/selectMode";
import { Logo } from "../client utilities/logo";
import { MobileSidebar } from "../client utilities/mobileSidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";
import { UserCircle } from "@repo/ui/icons";
import { signOut, useSession } from "next-auth/react";

export function Navbar() {
  const { data } = useSession();
  return (
    <div
      className={cn(
        "flex border-b dark:border-amber-50 lg:border-b-2 lg:dark:border-b h-[73px] w-full justify-center"
      )}
    >
      <div className="flex items-center justify-between w-[90%] py-4 lg:justify-end">
        <MobileSidebar className="lg:hidden" />
        <Logo className="lg:hidden" />
        <div className="flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="size-10 flex-shrink-0 cursor-pointer">
                <AvatarImage src={data?.user && data.user?.image as string}/>
                <AvatarFallback className="bg-gray-200">
                  <UserCircle className="text-gray-500" size={24} />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className="font-normal">
                Hey, {data?.user?.username}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="font-semibold"
                onClick={() => {
                  signOut();
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
