export const dynamic = 'force-dynamic'

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soukep vCard — Carte de visite digitale",
  description: "Créez votre carte de visite digitale professionnelle et partagez-la en un clic.",
  icons: { icon: '/logo-st.png', apple: '/logo-st.png' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
