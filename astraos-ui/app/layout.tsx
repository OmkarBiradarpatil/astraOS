import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AstraOS — AI Vault",
  description: "Your AI-powered Second Brain. Upload knowledge, understand it deeply, connect ideas, and retrieve insights instantly.",
  keywords: ["AI", "knowledge management", "RAG", "second brain", "research", "notes"],
  themeColor: "#07070f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="animated-bg">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        {children}
      </body>
    </html>
  );
}
