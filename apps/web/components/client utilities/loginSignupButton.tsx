"use client";

import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function LoginSignupButton({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <>
      {pathname === "/auth/register" ? (
        <Button onClick={() => signIn()} className={cn("text-base", className)}>
          Login
        </Button>
      ) : (
        <Link href={"/auth/register"}>
          <Button className="text-base">Sign Up</Button>
        </Link>
      )}
    </>
  );
}
