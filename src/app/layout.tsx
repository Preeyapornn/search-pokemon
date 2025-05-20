import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const geistSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Search pokemon",
  description: "Search for your favorite pokemon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
