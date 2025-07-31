import { FloatingParticles, Header, Hero, Features, Footer } from "./components";

export default function Home() {
  return (
    <div className="min-h-screen">
      <FloatingParticles />
      <Header />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
