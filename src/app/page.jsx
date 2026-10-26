import { headers } from "next/headers";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MainContent from "@/components/MainContent";
import Footer from "@/components/Footer";

async function getItems() {
  // A server-side fetch needs an absolute URL; reuse the incoming request's host.
  const headerList = await headers();
  const host = headerList.get("host");
  const isLocal = host?.startsWith("localhost") || host?.startsWith("127.0.0.1");
  const protocol = headerList.get("x-forwarded-proto") ?? (isLocal ? "http" : "https");
  const response = await fetch(`${protocol}://${host}/api/items`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`GET /api/items failed with ${response.status}`);
  }

  return response.json();
}

export default async function Home() {
  const items = await getItems();

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <MainContent items={items} />
      <Footer />
    </div>
  );
}
