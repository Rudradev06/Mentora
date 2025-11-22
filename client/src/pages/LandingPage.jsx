import React from "react";
import HeroSection from "../components/HeroSection";
import SocialProofSection from "../components/SocialProofSection";
import CourseShowcase from "../components/CourseShowcase";
import PlatformFeatures from "../components/PlatformFeatures";
import TestimonialsSection from "../components/TestimonialsSection";
import WhomFor from "../components/WhomFor";
import ImprovedSections from "../components/ImprovedSections";
import NewsletterSignup from "../components/NewsletterSignup";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <SocialProofSection />
      <CourseShowcase />
      <PlatformFeatures />
      <TestimonialsSection />
      <WhomFor />
      <ImprovedSections />
      <NewsletterSignup />
    </div>
  );
}
