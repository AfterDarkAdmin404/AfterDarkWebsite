import { FloatingParticles, Header, Hero, Features, About, Contact, Footer } from "./components";

export default function Home() {
  return (
    <div className="min-h-screen">
      <FloatingParticles />
      <Header />
      <main>
        <Hero />
        <Features />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
