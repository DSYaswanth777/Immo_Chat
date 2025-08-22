import type React from "react";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/session-provider";
import { ClientToaster } from "@/components/ui/client-toaster";
import { SessionStatus } from "@/components/session-status";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Immochat - Valuta Casa su WhatsApp",
  description:
    "Piattaforma per agenti immobiliari per valutazioni proprietà via WhatsApp",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className={openSans.className}>
        <Providers>
          {children}
          <ClientToaster position="top-right" />
          <SessionStatus />
        </Providers>
      </body>
    </html>
  );
}
