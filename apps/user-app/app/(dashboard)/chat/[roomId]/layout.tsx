import { ReactNode } from "react";
import { RoomSidebar } from "../../../../components/room/roomSidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <main className="lg:mr-72 xl:mr-80 2xl:mr-96 flex-1">
        {children}
      </main>
      <RoomSidebar />
    </div>
  );
}