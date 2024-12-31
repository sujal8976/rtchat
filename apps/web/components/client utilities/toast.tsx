"use client";

import { useToast } from "@repo/ui/hooks/use-toast";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClientToastComponent({
  title,
  description,
  variant,
}: {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | null | undefined;
}) {
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (title || description) {
      toast({
        title,
        description,
        variant,
      });
    }

    return router.push("/auth/login");
  }, [title, description]);

  return null;
}
