'use client';

export function Features() {
  const features = [
    {
      icon: "🌙",
      title: "Anonymous & Secure",
      description: "Your privacy is our priority. Explore safely with complete discretion and advanced security measures."
    },
    {
      icon: "💫",
      title: "Real-Time Connections",
      description: "Connect with like-minded individuals instantly. No waiting, no games – just authentic experiences."
    },
    {
      icon: "🎭",
      title: "Express Yourself",
      description: "Break free from limitations. Share your true desires in a judgment-free environment designed for exploration."
    }
  ];

  return (
    <section id="explore" className="py-24 bg-black/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-5">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 font-serif">
          Discover Your World
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-black/40 backdrop-blur-md p-8 rounded-2xl text-center border-2 border-transparent hover:border-accent transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/20 group"
            >
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 