import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Technologies from "@/components/Technologies";
import AIDemo from "@/components/AIDemo";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Technologies />
        <AIDemo />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}