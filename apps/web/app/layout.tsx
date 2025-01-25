import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@repo/ui/globals.css";
import { Providers } from "../providers/provider";
import { Navbar } from "../components/layout/navbar1";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "RtChat",
  description: "Spit out ideas. Don’t hold back.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <main>
            <Navbar />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
