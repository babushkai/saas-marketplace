import { Hero } from "@/components/home/hero";
import { LogoCloud } from "@/components/home/logo-cloud";
import { Features } from "@/components/home/features";
import { HowItWorks } from "@/components/home/how-it-works";
import { Testimonials } from "@/components/home/testimonials";
import { PricingTeaser } from "@/components/home/pricing-teaser";
import { FAQ } from "@/components/home/faq";
import { CTASection } from "@/components/home/cta-section";

export default function Home() {
  return (
    <>
      <Hero />
      <LogoCloud />
      <Features />
      <HowItWorks />
      <Testimonials />
      <PricingTeaser />
      <FAQ />
      <CTASection />
    </>
  );
}
