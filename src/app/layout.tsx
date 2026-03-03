import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import { NextAuthProvider } from '@/components/providers/NextAuthProvider';
import { CartProvider } from '@/components/providers/CartProvider';

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DROPSHIP Elite | Premium Curated Collection",
  description: "Experience world-class dropshipping with premium quality products and lightning-fast delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${outfit.variable} ${inter.variable} font-sans antialiased`}
      >
        <NextAuthProvider>
          <CartProvider>
            <div className="min-h-screen">
              {children}
            </div>
            <Toaster richColors position="top-center" />
          </CartProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
