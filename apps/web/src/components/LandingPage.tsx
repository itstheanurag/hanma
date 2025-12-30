import { Hero } from "./hero";
import Philosophy from "./Philosophy";
import Features from "./Features";
import SupportedFrameworks from "./SupportedFrameworks";
import { TerminalSection } from "./terminal";
import FAQ from "./FAQ";
import Community from "./Community";
// import { Stats } from "./Stats";

const LandingPage = () => {
  return (
    <>
      <Hero />
      <div className="w-full h-px bg-border" />
      {/* <Stats />
      <div className="w-full h-px bg-border" /> */}
      <Philosophy />
      <TerminalSection />
      <div className="w-full h-px bg-border" />
      <Features />
      <div className="w-full h-px bg-border" />
      <SupportedFrameworks />
      <div className="w-full h-px bg-border" />
      <Community />
      <div className="w-full h-px bg-border" />
      <FAQ />
    </>
  );
};

export default LandingPage;
