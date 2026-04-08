import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "../components/BottomNav";
import { Sidebar } from "../components/Sidebar";
import { Providers } from "../components/Providers";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { ResumeToast } from "../components/ResumeToast";
import { VaultToast } from "../components/VaultToast";
import { PathCompletionModal } from "../components/PathCompletionModal";
import { Assistant as AssistantFont } from "next/font/google";

const assistant = AssistantFont({
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
  icons: {
    icon: "/icon.png",
    apple: "/icons/apple-touch-icon.png",
  },
  other: {
    google: "notranslate",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0d0f1a",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" translate="no" className={`notranslate ${assistant.variable}`}>
      <body className="antialiased text-foreground selection:bg-blue-500/30 selection:text-blue-500 min-h-[100dvh]">
        <div className="w-full min-h-[100dvh] relative flex font-sans transition-colors duration-500 overflow-x-hidden">
          <Providers>
            <AnimatedBackground />

            {/* Persistent Sidebar for Desktop */}
            <Sidebar />
            <ResumeToast />
            <VaultToast />
            <PathCompletionModal />

            {/* Main content area */}
            <div className="flex-1 min-w-0 flex flex-col relative h-[100dvh]">
              <main className="flex-1 overflow-y-auto safe-bottom-padding pt-[env(safe-area-inset-top)] md:pb-12 no-scrollbar relative z-10 w-full h-full">
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

