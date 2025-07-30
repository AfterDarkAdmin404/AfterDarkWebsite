'use client';

import Image from 'next/image';

export function About() {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-background to-background/95 relative">
      <div className="max-w-7xl mx-auto px-5">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-serif">
            About AfterDark
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Empowering communities through meaningful connections and authentic conversations
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Mission & Vision */}
          <div className="space-y-8">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
              <h3 className="text-2xl font-bold text-foreground mb-4 font-serif">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To create a safe, inclusive digital space where people can connect, share, and grow together. 
                We believe in the power of authentic human connection in an increasingly digital world.
              </p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
              <h3 className="text-2xl font-bold text-foreground mb-4 font-serif">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To become the leading platform for meaningful community engagement, where every voice matters 
                and every connection has the potential to change lives for the better.
              </p>
            </div>
          </div>

          {/* App Features Overview */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground mb-6 font-serif">What We Offer</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Community Forums</h4>
                  <p className="text-muted-foreground text-sm">Engage in meaningful discussions with like-minded individuals</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Reaction System</h4>
                  <p className="text-muted-foreground text-sm">Express yourself with our intuitive reaction features</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Secure Environment</h4>
                  <p className="text-muted-foreground text-sm">Your privacy and security are our top priorities</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Information */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-foreground text-center mb-12 font-serif">Meet Our Team</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Team Leader */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 text-center group hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 hover:-translate-y-1">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent/20 to-accent/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-foreground mb-2">Thompson</h4>
              <p className="text-accent font-semibold mb-3">Team Leader</p>
                              <p className="text-muted-foreground text-sm">
                  Leading our vision and strategy to create the best gaming community experience.
                </p>
            </div>

            {/* Developer 1 */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 text-center group hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 hover:-translate-y-1">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent/20 to-accent/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-foreground mb-2">Paul</h4>
              <p className="text-accent font-semibold mb-3">Developer</p>
              <p className="text-muted-foreground text-sm">
                Crafting the backend architecture and ensuring smooth performance.
              </p>
            </div>

            {/* Developer 2 */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 text-center group hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 hover:-translate-y-1">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent/20 to-accent/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-foreground mb-2">Seve</h4>
              <p className="text-accent font-semibold mb-3">Developer</p>
              <p className="text-muted-foreground text-sm">
                Building beautiful and intuitive user interfaces for our community.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy & Community Values */}
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
            <h3 className="text-2xl font-bold text-foreground mb-6 font-serif">Privacy Commitment</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                </div>
                <p className="text-muted-foreground">Your data is encrypted and never shared with third parties</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                </div>
                <p className="text-muted-foreground">Full control over your personal information</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                </div>
                <p className="text-muted-foreground">Transparent privacy policies and practices</p>
              </div>
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
            <h3 className="text-2xl font-bold text-foreground mb-6 font-serif">Community Values</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                </div>
                <p className="text-muted-foreground">Respect and kindness in all interactions</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                </div>
                <p className="text-muted-foreground">Inclusive environment for all backgrounds</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                </div>
                <p className="text-muted-foreground">Constructive dialogue and meaningful discussions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 