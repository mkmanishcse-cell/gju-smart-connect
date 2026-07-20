import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
import PortalSection from "@/components/landing/PortalSection";
import Stats from "@/components/landing/Stats";
import Features from "@/components/landing/Features";
import About from "@/components/landing/About";
import Contact from "@/components/landing/Contact";
import Footer from "@/components/common/Footer";


export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">

      <Navbar />

      <section id="home">
        <Hero />
      </section>

      <section id="portals">
        <PortalSection />
      </section>

      <section id="features">
        <Features />
      </section>

      <section id="statistics" className="hidden lg:block">
        <Stats />
      </section>

      <section id="about" className="hidden lg:block">
        <About />
      </section>

      <section id="contact">
        <Contact />
      </section>

      <Footer />

    </main>
  );
}