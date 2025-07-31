'use client';

export function FloatingParticles() {
  const particles = [
    { symbol: "♠", top: "10%", left: "10%", size: "text-xl", delay: "0s" },
    { symbol: "♥", top: "20%", right: "15%", size: "text-lg", delay: "-2s" },
    { symbol: "♦", top: "60%", left: "5%", size: "text-2xl", delay: "-4s" },
    { symbol: "♣", top: "80%", right: "10%", size: "text-lg", delay: "-6s" }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map((particle, index) => (
        <div
          key={index}
          className={`absolute text-accent opacity-10 floating-particle ${particle.size}`}
          style={{
            top: particle.top,
            left: particle.left,
            right: particle.right,
            animationDelay: particle.delay
          }}
        >
          {particle.symbol}
        </div>
      ))}
    </div>
  );
} 