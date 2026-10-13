import type { Metadata } from "next";
import { Cursor } from "@/components/cursor";
import { SiteHeader } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { FontSwitcher } from "@/components/font-switcher";
import { SmoothScroll } from "@/components/smooth-scroll";
import { DEFAULT_PAIRING, fontVariables } from "@/lib/fonts";
import "./globals.css";


export const metadata: Metadata = {
  title: "Citizen Journalist",
  description: "A newsroom with no newsroom. News filed by the people who were there.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-font={DEFAULT_PAIRING} className={`${fontVariables} antialiased`} suppressHydrationWarning>
      <head>
        <script
          // Apply the saved font pairing before first paint.
          dangerouslySetInnerHTML={{
            __html: `try{var f=localStorage.getItem("cj-font");if(f)document.documentElement.dataset.font=f}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-screen overflow-x-clip">
        <SmoothScroll />
        <Cursor />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <FontSwitcher />
      </body>
    </html>
  );
}
