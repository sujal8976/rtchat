"use client";

import { Button } from "@repo/ui/components/ui/button";
import { useToast } from "@repo/ui/hooks/use-toast";

export const CallToast = () => {
  const { toast } = useToast();

  return (
    <Button
      onClick={() => {
        toast({
          description: "Hello from Toaster",
        });
      }}
    >
      Click me!
    </Button>
  );
};
