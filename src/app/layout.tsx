import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "isabelle stewart",
  description: "under development",
  icons: {
    icon: '/public/favicon.ico',
  },
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
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400&family=Wix+Madefor+Text:wght@400&family=Work+Sans:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
