import { SidebarContent } from "./sidebarContent";

export function Sidebar() {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-72 xl:w-80 2xl:w-96 dark:border-slate-600 border-r-2 max-h-[90vh] left-0 overflow-hidden">
        <div className="flex justify-center w-full mt-10">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}
