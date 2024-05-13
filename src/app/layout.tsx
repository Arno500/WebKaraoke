import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const notoSansJP = Noto_Sans_JP({ preload: false });

export const metadata: Metadata = {
  title: "WebKaraoké",
  description: "Listen and we manage the lyrics and the synchronization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSansJP.className} ${inter.className}`}>{children}</body>
    </html>
  );
}
