'use client';

import Link from 'next/link';

export function Footer() {
  const footerLinks = [
    { href: "#privacy", label: "Privacy Policy" },
    { href: "#terms", label: "Terms of Service" },
    { href: "#support", label: "Support" },
    { href: "#safety", label: "Safety Guidelines" }
  ];

  return (
    <footer className="py-10 border-t border-accent/30 bg-black/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-5 text-center">
        <div className="text-gray-300">
          <p>&copy; 2024 AfterDark. All rights reserved.</p>
          
          <div className="mt-6 flex justify-center gap-8 flex-wrap">
            {footerLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-gray-300 hover:text-accent transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
} 