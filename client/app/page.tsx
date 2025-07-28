import CTASection from "./components/CTASection";
import { FeaturesSection } from "./components/FeaturesSection";
import { Footer } from "./components/Footer";
import HeroSection from "./components/HeroSection";
import { Navbar } from "./components/Navbar";


export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
