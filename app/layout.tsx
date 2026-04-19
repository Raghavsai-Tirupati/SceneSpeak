import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Iris — Visual Assistant",
  description:
    "Real-time conversational AI guide for blind and visually impaired users",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
        {children}
      </body>
    </html>
  );
}
