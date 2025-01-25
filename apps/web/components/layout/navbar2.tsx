import { cn } from "@repo/ui/lib/utils";
import { LogoutButton } from "../client utilities/logoutButton";
import { ModeToggle } from "@repo/ui/components/theme/selectMode";
import { Logo } from "../client utilities/logo";
import { MobileSidebar } from "../client utilities/mobileSidebar";

export function Navbar() {
  return (
    <div className={cn("flex border-b border-slate-500 lg:border-amber-50 lg:border-b-2 h-[73px] lg:dark:border-b w-full justify-center")}>
      <div className="flex items-center justify-between w-[90%] py-4 lg:justify-end">
        <MobileSidebar className="lg:hidden" />
        <Logo className="lg:hidden" />
        <div className="flex items-center gap-6">
          <LogoutButton />
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
