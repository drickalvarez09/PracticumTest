import "./globals.css";

export const metadata = {
  title: "Assignment Main",
  description: "Week 3 project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}