// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider";
import { Roboto } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sooner";
import { QueryProvider } from "@/providers/provider";


const roboto = Roboto({
  subsets: ['latin'],
  fallback: ['system-ui', 'Arial'],  // add fallback fonts
  display: 'swap',
  variable: '--font-roboto',
  preload: true,
});
export const metadata = {
  title: "Finzo",
  description: "Finzo is a personal finance app that helps you manage your money, track your expenses, and achieve your financial goals.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  


  return (
    <html lang="en">
      <ClerkProvider>
       <QueryProvider>
          <body className={`${roboto.variable} bg-white dark:bg-slate-900`}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
              </div>
            </ThemeProvider>
            <Toaster />
          </body>
          </QueryProvider>
        
      </ClerkProvider>
    </html>
  );
}
