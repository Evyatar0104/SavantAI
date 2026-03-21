import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "../components/BottomNav";
import { Sidebar } from "../components/Sidebar";
import { Providers } from "../components/Providers";
import { Assistant } from "next/font/google";

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  display: "swap",
  variable: "--font-assistant",
});

export const metadata: Metadata = {
  title: "Savant - Micro-Learning",
  description: "Social micro-learning app designed for 5-minute deep learning sessions.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Savant",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${assistant.variable}`}>
      <body className="antialiased bg-background text-foreground selection:bg-blue-500/30 selection:text-blue-500 min-h-[100dvh]">
        <div className="w-full bg-background min-h-[100dvh] relative flex font-sans transition-colors duration-500 overflow-x-hidden">
          <Providers>
            {/* Ambient background glows for glassmorphism pop */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] rounded-full bg-blue-500/10 dark:bg-blue-500/20 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-[100px] pointer-events-none" />

            {/* Persistent Sidebar for Desktop */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex-1 min-w-0 flex flex-col relative h-[100dvh]">
              <main className="flex-1 overflow-y-auto safe-bottom-padding md:pb-12 no-scrollbar relative z-10 w-full h-full">
                {children}
              </main>
              {/* Bottom Nav for Mobile Only */}
              <div className="md:hidden">
                <BottomNav />
              </div>
            </div>
          </Providers>
        </div>
      </body>
    </html>
  );
}
