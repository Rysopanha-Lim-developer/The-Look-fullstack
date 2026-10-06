import type { Metadata, Viewport } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/Frontend/hooks/CartContext";
import DemoNotice from "@/Frontend/components/notice/DemoNotice";

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

// Runs before the first paint: applies the saved theme and sidebar choice so the page never flashes the wrong one.
// No saved theme means light (the visitor switches manually; we do not follow the device setting).
const PREFERENCES_SCRIPT = `(function(){var d=document.documentElement;try{d.dataset.theme=localStorage.getItem("theme")==="dark"?"dark":"light";if(localStorage.getItem("category-sidebar")==="closed")d.dataset.sidebar="closed";}catch(e){d.dataset.theme="light";}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the script above changes <html> attributes before React loads, which is expected
    <html
      lang="en"
      suppressHydrationWarning
      className={`${roboto.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREFERENCES_SCRIPT }} />
      </head>
      {/* CartProvider lives here (not in a route-group layout) so the cart survives moving between shop, account and login pages */}
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
        <DemoNotice />
        {/* Empty on screen. The receipt is placed here, and it is the only thing printed (see globals.css) */}
        <div id="print-root" />
      </body>
    </html>
  );
}
