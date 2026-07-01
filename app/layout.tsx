import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Aliança Catalana Platja d'Aro",
    template: "%s | Aliança Catalana Platja d'Aro"
  },
  description: "Secció municipal d'Aliança Catalana a Platja d'Aro, Castell-Platja d'Aro i S'Agaró. Treballem per la seguretat, la identitat i el futur de la nostra gent.",
  metadataBase: new URL("https://platjadaro.aliancacatalana.cat"),
  openGraph: {
    title: "Aliança Catalana Platja d'Aro",
    description: "Secció municipal d'Aliança Catalana a Platja d'Aro. Salvem Platja d'Aro.",
    siteName: "Aliança Catalana Platja d'Aro",
    locale: "ca",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aliança Catalana Platja d'Aro",
    description: "Secció municipal d'Aliança Catalana a Platja d'Aro.",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0E4B81",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ca"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        {children}
      </body>
    </html>
  );
}
