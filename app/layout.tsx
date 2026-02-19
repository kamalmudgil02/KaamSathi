import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { BookingProvider } from "@/contexts/BookingContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "KaamSaathi - Your Trusted Local Labour Partner",
    description: "Connect with skilled workers in your area for all your home service needs",
};

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AuthProvider>
                        <LanguageProvider>
                            <BookingProvider>
                                {children}
                            </BookingProvider>
                        </LanguageProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
