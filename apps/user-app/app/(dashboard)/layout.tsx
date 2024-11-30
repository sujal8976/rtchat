import { ReactNode } from "react";
import { Sidebar } from "../../components/layout/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex ">
      <Sidebar />
      <div className="">
        {children}
      </div>
    </div>
  );
}