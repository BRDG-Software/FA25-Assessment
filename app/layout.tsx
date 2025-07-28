import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import MainLayout from "@/components/organisms/MainLayout";
import MainContextProvider from "@/providers/MainContext";
import { GoogleAnalytic } from "@/components/organisms/GoogleAnalytic";

const helveticaFont = localFont({
  src: "./fonts/HelveticaNowDisplay-Bold.woff",
});

export const metadata: Metadata = {
  title: "Nike Trial Assessment",
  description: "Nike Trial Assessment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${helveticaFont.className}
          antialiased`}
      >
        <MainContextProvider>
          <GoogleAnalytic />

          <MainLayout>{children}</MainLayout>
        </MainContextProvider>
      </body>
    </html>
  );
}
