import type { Metadata } from "next";
import { Anton, Inter, Martian_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/navbar";
import StickyActionBar from "@/components/sticky-action-bar";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const martianMono = Martian_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FurLink — Animal Welfare, Rescue & Adoption Archive",
  description: "A scroll-choreographed catalogue and rescue archive where every animal has a name before a number.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${anton.variable} ${inter.variable} ${martianMono.variable}`}>
        <body className="font-sans bg-[#FAF8FC] text-[#101124] antialiased selection:bg-[#314CB6] selection:text-[#EFBDEB] min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <StickyActionBar />
        </body>
      </html>
    </ClerkProvider>
  );
}
