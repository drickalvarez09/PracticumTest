"use client";   // add this ONLY if App.jsx used useState/useEffect/onClick

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MainContent from "@/components/MainContent";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <MainContent />
      <Footer />
    </div>
  );
}