import { ReactNode } from "react";
import { Navbar } from "../../components/layout/navbar2";
import { Sidebar } from "../../components/layout/sidebar";
import { WebSocketProvider } from "../../providers/websocketProvider";

export default function ({ children }: { children: ReactNode }) {
  return (
    <>
      <WebSocketProvider>
        <div className="flex h-screen flex-1">
          <Sidebar />
          <main className="flex-1 flex flex-col">
            <Navbar />
            {children}
          </main>
        </div>
      </WebSocketProvider>
    </>
  );
}
