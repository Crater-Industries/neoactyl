import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "../components/session-wrap";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Neoactyl - Game Server Management",
  description: "Next-generation game server management platform",
  keywords: ["game server", "server management", "hosting", "pterodactyl"],
  authors: [{ name: "Neoactyl Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#111827",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full bg-gray-900`}
      >
        <SessionWrapper>
          <div className="flex flex-col min-h-screen">
            {children}
            <footer className="mt-auto py-6 text-center text-gray-400 text-sm">
              <p>© {new Date().getFullYear()} Neoactyl. All rights reserved.</p>
            </footer>
          </div>
        </SessionWrapper>
      </body>
    </html>
  );
}
