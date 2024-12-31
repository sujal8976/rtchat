"use client";

import { Button } from "@repo/ui/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@repo/ui/components/ui/sheet";
import { Menu } from "@repo/ui/icons";
import { useState } from "react";
import { SidebarContent } from "./sidebarContent";
import { cn } from "@repo/ui/lib/utils";

export function MobileSidebar({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  function setIsOpenHandler(value: boolean) {
    setIsOpen(value);
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className={cn(className)} variant={"ghost"} size={"icon"}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SidebarContent onUpdate={setIsOpenHandler} />
      </SheetContent>
    </Sheet>
  );
}
