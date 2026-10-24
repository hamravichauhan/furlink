import type { Metadata } from "next";
import { League_Spartan, Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ShelterNavbar from "@/components/pet-shelter/shelter-navbar";
import ShelterFooter from "@/components/pet-shelter/shelter-footer";
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
  title: "FurLink — No-Kill Animal Rescue, Adoption & Medical Sanctuary",
  description: "A material case-file animal welfare initiative where every animal has a name before a number. Track waiting days, sponsor recovery meals, or adopt a rescued companion.",
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
          <ShelterNavbar />
          <main className="flex-1">{children}</main>
          <ShelterFooter />
        </body>
      </html>
    </ClerkProvider>
  );
}
