import { Logo } from "../client utilities/logo";
import { SidebarContent } from "../client utilities/sidebarContent";

export function Sidebar() {
  return (
    <div className="w-[350px] lg:flex justify-center hidden">
      <div className="flex flex-col w-full">
        <div className="flex justify-center border-b-2 dark:border-b">
            <Logo className="py-4" />
        </div>
        <SidebarContent />
      </div>
    </div>
  );
}