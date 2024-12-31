import { cn } from "@repo/ui/lib/utils";
import { Berkshire_Swash } from "next/font/google";
import Link from "next/link";

const berkshireSwash = Berkshire_Swash({ subsets: ["latin"], weight: "400" });

export function Logo({ className }: { className?: string }) {
  return (
    <Link href={'/chat'}>
      <div className={cn("text-4xl", berkshireSwash.className, className)}>
        RtChat
      </div>
    </Link>
  );
}
