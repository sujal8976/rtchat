"use client";

import { RecoilRoot } from "@repo/store/recoil";
import { ThemeProvider } from "@repo/ui/components/theme-provider";
import { Toaster } from "@repo/ui/components/ui/toaster";
import { SessionProvider } from "next-auth/react";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <RecoilRoot>
        <SessionProvider>{children}</SessionProvider>
        {/* {children} */}
      </RecoilRoot>
      <Toaster />
    </ThemeProvider>
  );
};
