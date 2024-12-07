"use client";

import { useRouter } from "next/navigation";

export function RedirectComp(redirectPath: string) {
  const router = useRouter();
  router.push(redirectPath);
}
