'use client';

import Link from 'next/link';

export function Hero() {
  return (
    <section id="home" className="py-24 text-center relative">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-accent/10 to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-5 relative z-10">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold font-serif glow-text bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent">
            AfterDark
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 tracking-wide">
            Real People. Real Fantasies. In Real Time.
          </p>
          
          <p className="text-2xl md:text-3xl text-accent italic font-light">
            Explore your desires – beyond vanilla
          </p>
          
          <div className="pt-8">
            <Link 
              href="#explore"
              className="inline-block bg-gradient-to-r from-accent to-accent-dark text-foreground px-10 py-4 rounded-full text-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent/30 relative overflow-hidden group"
            >
              <span className="relative z-10">Enter the Experience</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600"></div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 