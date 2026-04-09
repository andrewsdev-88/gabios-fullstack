import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GabiOS",
  description: "Operating system for Gabi Produções",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-prisma-bg text-prisma-fg">{children}</body>
    </html>
  );
}
