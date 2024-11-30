"use client";
import { Button } from "@repo/ui/components/ui/button";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@repo/ui/components/ui/sheet";
import { X } from "@repo/ui/icons/X";
import { Menu } from "@repo/ui/icons/menu";
import { SidebarContent } from "./sidebarContent";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
        {/* Mobile Sidebar */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-50">
            <Button variant="outline" size="icon">
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex-1 lg:hidden flex flex-col">
            <SheetHeader>
              <SheetTitle className="text-3xl text-center font-semibold py-5">
                Logo
              </SheetTitle>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
         {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-72 xl:w-80 2xl:w-96 dark:border-slate-600 border-r-2 h-screen left-0">
          <div className="flex justify-center w-full mt-10">
            <SidebarContent />
          </div>
        </div> 
     
    </>
  );
}
