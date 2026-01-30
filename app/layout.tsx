import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { SiteSchema } from "@/components/seo/site-schema";
import { Inter, Merriweather, Mrs_Saint_Delafield } from "next/font/google";
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

const signature = Mrs_Saint_Delafield({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-signature",
});

export const metadata: Metadata = {
  title: {
    default: 'InstaPact - Freelancer Contracts in 30 Seconds',
    template: '%s | InstaPact'
  },
  description: 'Create, sign, and manage legally binding freelancer agreements instantly. The #1 contract tool for Indian freelancers and agencies.',
  keywords: ["digital agreements", "e-signature", "freelance contracts", "business agreements", "legal tech", "digitally sign documents"],
  authors: [{ name: "Sameer Mathad" }],
  creator: "Sameer Mathad",
  metadataBase: new URL("https://www.instapact.in"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo/logo.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/logo/logo@3x.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.instapact.in",
    siteName: "InstaPact",
    title: 'InstaPact - Freelancer Contracts in 30 Seconds',
    description: 'Stop using Word docs. Create secure legal agreements in clicks.',
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "InstaPact - Freelancer Contracts in 30 Seconds",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: 'InstaPact - Freelancer Contracts in 30 Seconds',
    description: 'Stop using Word docs. Create secure legal agreements in clicks.',
    images: ["/og-image.png"],
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

export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${merriweather.variable} ${signature.variable} font-sans antialiased`}
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
        
        <SiteSchema />
      </body>
    </html>
  );
}
