"use client";

import { ModeToggle } from "@repo/ui/components/theme/selectMode";
import { LoginSignupButton } from "../client utilities/loginSignupButton";
import { cn } from "@repo/ui/lib/utils";
import { Logo } from "../client utilities/logo";
import { useSession } from "next-auth/react";

export function Navbar() {
  const { data } = useSession();

  return (
    <nav
      className={cn(
        "w-full flex justify-center border-b-2 dark:border-b",
        data?.user && data.user?.id && "hidden"
      )}
    >
      <div className="w-[1400px] max-w-[90%] flex justify-between py-4 items-center">
        <Logo />
        <div className="flex gap-6 items-center">
          <LoginSignupButton />
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
