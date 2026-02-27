import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Themes from "@/components/sections/Themes";
import Program from "@/components/sections/Program";
import Eligibility from "@/components/sections/Eligibility";
import Timeline from "@/components/sections/Timeline";
import Prizes from "@/components/sections/Prizes";
import Apply from "@/components/sections/Apply";
import Submit from "@/components/sections/Submit";
import Sponsors from "@/components/sections/Sponsors";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Themes />
        <Program />
        <Eligibility />
        <Timeline />
        <Prizes />
        <Apply />
        {/* <Submit /> */}
        <Sponsors />
      </main>
      <Footer />
    </>
  );
}
