import { cn } from "@repo/ui/lib/utils";
import { Berkshire_Swash } from "next/font/google";

const berkshireSwash = Berkshire_Swash({ subsets: ["latin"], weight: "400" });

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("text-4xl", berkshireSwash.className, className)}>
      RtChat
    </div>
  );
}
