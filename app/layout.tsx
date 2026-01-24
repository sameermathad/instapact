import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Merriweather } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-merriweather",
});

export const metadata: Metadata = {
  title: {
    default: "InstaPact | Instant Digital Agreements for Freelancers & Agencies",
    template: "%s | InstaPact"
  },
  description: "Create, sign, and manage legally binding agreements in under 30 seconds. Perfect for freelancers, agencies, and small businesses.",
  keywords: ["digital agreements", "e-signature", "freelance contracts", "business agreements", "legal tech", "digitally sign documents"],
  authors: [{ name: "Sameer Mathad" }],
  creator: "Sameer Mathad",
  metadataBase: new URL("https://www.instapact.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.instapact.in",
    siteName: "InstaPact",
    title: "InstaPact | Instant Digital Agreements",
    description: "Sign legally binding agreements in under 30 seconds.",
    images: [
      {
        url: "/logo/logo@3x.png",
        width: 1200,
        height: 630,
        alt: "InstaPact Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InstaPact | Instant Digital Agreements",
    description: "Sign legally binding agreements in under 30 seconds.",
    images: ["/logo/logo@3x.png"],
    creator: "@instapact",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${merriweather.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
        
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-Z51NZKJ974"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-Z51NZKJ974');
          `}
        </Script>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
