import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Tropical Futures 2026 | Frank Mbanefo Design Competition",
  description:
    "An international architecture competition challenging the next generation of architects to design zero-carbon cultural habitats for tropical climates. Organized by Godfrey Okoye University, Nigeria.",
  keywords: [
    "architecture competition",
    "tropical architecture",
    "zero carbon",
    "Nigeria",
    "Godfrey Okoye University",
    "Frank Mbanefo",
    "sustainable design",
    "2026",
  ],
  openGraph: {
    title: "Tropical Futures 2026 | Frank Mbanefo Design Competition",
    description:
      "Crafting Zero-Carbon Cultural Habitats for the Tropics. Excellence & Innovation Rooted in Indigenous Wisdom.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
