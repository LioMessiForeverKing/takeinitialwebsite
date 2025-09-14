import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from 'next/font/google';
import "./globals.css";
import AuthUrlHandler from "./components/AuthUrlHandler";

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: "Take With Me - Real Friends, Real Connections",
    template: "%s | Take With Me"
  },
  description: "We believe the internet should help you know your friends. Not the random people you follow on Instagram or TikTok. We're building a tiny daily ritual to make deeper, everyday closeness with your actual people real.",
  keywords: [
    "social media",
    "friends",
    "real connections",
    "authentic relationships",
    "daily ritual",
    "social networking",
    "close friends",
    "meaningful connections",
    "social app",
    "friendship",
    "community",
    "authentic social"
  ],
  authors: [{ name: "Take With Me Team" }],
  creator: "Take With Me",
  publisher: "Take With Me",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://takewithme.social'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://takewithme.social',
    siteName: 'Take With Me',
    title: 'Take With Me - Real Friends, Real Connections',
    description: 'We believe the internet should help you know your friends. Not the random people you follow on Instagram or TikTok. We\'re building a tiny daily ritual to make deeper, everyday closeness with your actual people real.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Take With Me - Real Friends, Real Connections',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Take With Me - Real Friends, Real Connections',
    description: 'We believe the internet should help you know your friends. Not the random people you follow on Instagram or TikTok. We\'re building a tiny daily ritual to make deeper, everyday closeness with your actual people real.',
    images: ['/twitter-image.png'],
    creator: '@takewithme',
    site: '@takewithme',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'social networking',
  classification: 'Social Media Application',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Take With Me',
    'application-name': 'Take With Me',
    'msapplication-TileColor': '#ffffff',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#ffffff',
  },
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
