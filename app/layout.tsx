import type { Metadata, Viewport } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thelook.rysopanha.com"),
  title: { default: "The Look | Fashion for Men, Women & Kids in Cambodia", template: "%s | The Look" },
  description: "Shop Seiko, Persol, New Balance, J.Crew and more. Clothing, shoes and accessories for men, women and kids.",
  openGraph: { type: "website", siteName: "The Look", images: ["/og.png"] },
};

// viewportFit: "cover" lets the bottom tab bar respect the iPhone home-indicator area
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
