import Script from "next/script";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export const metadata = {
  title: "Assignment Main",
  description: "Week 3 project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Applies the saved theme before paint, so there is no light flash. */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}`}
        </Script>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}