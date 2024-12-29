"use client";

import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { signIn } from "next-auth/react";

export function LoginButton({className}: {
    className?: string
}) {
  return (
    <Button onClick={() => signIn()} className={cn("text-base", className)}>
      Login
    </Button>
  );
}
