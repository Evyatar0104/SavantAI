import type { Metadata, Viewport } from "next";
import { Assistant as AssistantFont } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "./design-system.css";
import { DesktopNavigation, MobileNavigation } from "@/components/AppNavigation";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { PathCompletionModal } from "@/components/PathCompletionModal";
import { Providers } from "@/components/Providers";
import { ResumeToast } from "@/components/ResumeToast";
import { VaultToast } from "@/components/VaultToast";

const assistant = AssistantFont({
  subsets: ["hebrew", "latin"],
  display: "swap",
  variable: "--font-assistant",
});

export const metadata: Metadata = {
  title: "Savant — לומדים AI, צעד אחר צעד",
  description: "שיעורי AI קצרים, מסלולי למידה ותרגול מעשי בעברית.",
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
    <html lang="he" dir="rtl" translate="no" className={`dark notranslate ${assistant.variable}`}>
      <body className="min-h-[100dvh] bg-background font-sans text-foreground antialiased selection:bg-violet-500/30 selection:text-white">
        <Providers>
          <div dir="rtl" className="app-shell relative flex min-h-[100dvh] w-full overflow-x-hidden">
            <AnimatedBackground />
            <DesktopNavigation />
            <ResumeToast />
            <VaultToast />
            <PathCompletionModal />

            <div className="relative flex h-[100dvh] min-w-0 flex-1 flex-col">
              <main
                id="main-content"
                className="app-main safe-bottom-padding relative z-10 h-full w-full flex-1 overflow-y-auto overflow-x-hidden pt-[env(safe-area-inset-top)]"
              >
                {children}
              </main>
              <MobileNavigation />
            </div>
          </div>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}