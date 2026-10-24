import type { Metadata } from "next";
import { League_Spartan, Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const leagueSpartan = League_Spartan({
  weight: ["700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stickercraft — The Kiss-Cut Sticker Sheet Curriculum",
  description: "An online course whose signature is a physical, mailed kiss-cut sticker sheet curriculum. 8 modules, 9 h 20 m. Peel as you go.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${leagueSpartan.variable} ${poppins.variable}`}>
        <body className="font-body bg-[#f3c9d5] text-[#1A2540] antialiased selection:bg-[#cc2b3f] selection:text-[#f2e9db] min-h-screen flex flex-col">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
