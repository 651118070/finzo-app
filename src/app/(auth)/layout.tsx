// app/sign-in/layout.tsx
import { Roboto } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sooner";
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});
export const metadata={
    title: "Se connecter - Finzo",
    description: "Connectez-vous à votre compte Finzo pour gérer vos finances personnelles.",
}
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider>
        <body className={`${roboto.variable} antialiased dark:bg-slate-900 bg-white`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <main className="flex justify-center items-center min-h-screen px-4">
              {children}
            </main>
          </ThemeProvider>
          <Toaster />
        </body>
      </ClerkProvider>
    </html>
  );
}
