import { ReactNode } from "react";
import { Sidebar } from "../../components/layout/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="lg:ml-72 xl:ml-80 2xl:ml-96 flex-1">
        {children}
      </main>
    </div>
  );
}