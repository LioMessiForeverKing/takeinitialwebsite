import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from 'next/font/google';
import "./globals.css";
import AuthUrlHandler from "./components/AuthUrlHandler";

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "Take With Me",
  description: "We believe the internet should help you know your friends. Not the random people you follow on Instagram or TikTok.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${inter.variable}`}>
        <AuthUrlHandler />
        {children}
      </body>
    </html>
  );
}
