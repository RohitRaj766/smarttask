import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "../components/providers";
import { Navbar } from "../components/ui/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartTask - Production Task Management",
  description: "Enterprise Task Management Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProviders>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 w-full">
              {children}
            </main>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
