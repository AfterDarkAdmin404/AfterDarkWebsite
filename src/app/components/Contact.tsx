'use client';

import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

// Form validation constants
const LIMITS = {
  name: { min: 2, max: 50 },
  email: { max: 50 },
  message: { min: 10, max: 200 }
};

// Input sanitization patterns
const PATTERNS = {
  name: /^[a-zA-Z\s'-]+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [charCounts, setCharCounts] = useState({
    name: 0,
    email: 0,
    message: 0
  });

  // Real-time character counting
  useEffect(() => {
    setCharCounts({
      name: formData.name.length,
      email: formData.email.length,
      message: formData.message.length
    });
  }, [formData]);

  // Input sanitization and validation
  const sanitizeInput = (value: string, field: string): string => {
    switch (field) {
      case 'name':
        // Remove special characters except spaces, hyphens, apostrophes
        return value.replace(/[^a-zA-Z\s'-]/g, '');
      case 'email':
        // Basic email sanitization
        return value.toLowerCase().trim();
      case 'message':
        // Remove potentially harmful HTML/script tags
        return value.replace(/<[^>]*>/g, '');
      default:
        return value;
    }
  };

  const validateField = (field: string, value: string): string => {
    const limits = LIMITS[field as keyof typeof LIMITS];
    const patterns = PATTERNS[field as keyof typeof PATTERNS];

    if (!value.trim()) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }

    // Only validate limits if the field has limits defined
    if (limits) {
      if ('min' in limits && limits.min && value.length < limits.min) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${limits.min} characters`;
      }

      if ('max' in limits && limits.max && value.length > limits.max) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} must be no more than ${limits.max} characters`;
      }
    }

    // Only validate patterns if the field has patterns defined
    if (patterns && !patterns.test(value)) {
      switch (field) {
        case 'name':
          return 'Name can only contain letters, spaces, hyphens, and apostrophes';
        case 'email':
          return 'Please enter a valid email address';
        default:
          return `Invalid ${field} format`;
      }
    }

    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value, name);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const isFormValid = () => {
    const newErrors: Record<string, string> = {};
    
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // EmailJS configuration
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      
      // Check if environment variables are loaded
      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS configuration is missing. Please check your environment variables.');
      }
      
      console.log('EmailJS Config:', { serviceId, templateId, publicKey: publicKey.substring(0, 10) + '...' });
      
      // Prepare email data
      const templateParams = {
        title: formData.subject,
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        reply_to: formData.email
      };

      console.log('Template Params:', templateParams);

      // Send email using EmailJS
      const result = await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      console.log('EmailJS Result:', result);
      
      if (result.status === 200 || result.text === 'OK') {
        setIsSubmitting(false);
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setErrors({});
        
        // Reset success message after 3 seconds
        setTimeout(() => setSubmitStatus('idle'), 3000);
      } else {
        throw new Error(`Failed to send email. Status: ${result.status}, Text: ${result.text}`);
      }
    } catch (error) {
      setIsSubmitting(false);
      setSubmitStatus('error');
      console.error('Error sending message:', error);
      
      // Reset error message after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  const getCharCountColor = (field: string, count: number) => {
    const limits = LIMITS[field as keyof typeof LIMITS];
    if (!('max' in limits) || !limits.max) return 'text-muted-foreground';
    
    const percentage = (count / limits.max) * 100;
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 75) return 'text-yellow-500';
    return 'text-muted-foreground';
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-background/95 to-background relative">
      <div className="max-w-7xl mx-auto px-5">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <img src="/images/logo.png" alt="After Dark Logo" className="h-16 w-auto" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-serif">
            Get In Touch
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-6 font-serif">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      maxLength={LIMITS.name.max}
                      required
                      className={`w-full px-4 py-3 bg-background/50 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300 hover:border-accent/50 resize-none ${
                        errors.name ? 'border-red-500' : 'border-border/50'
                      }`}
                      placeholder="Your full name"
                      aria-describedby="name-error name-help"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <span className={`text-xs ${getCharCountColor('name', charCounts.name)}`}>
                        {charCounts.name}/{LIMITS.name.max}
                      </span>
                    </div>
                  </div>
                  {errors.name && (
                    <p id="name-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.name}
                    </p>
                  )}
                  <p id="name-help" className="text-muted-foreground text-xs mt-1">
                    Letters, spaces, hyphens, and apostrophes only
                  </p>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      maxLength={LIMITS.email.max}
                      required
                      className={`w-full px-4 py-3 bg-background/50 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300 hover:border-accent/50 resize-none ${
                        errors.email ? 'border-red-500' : 'border-border/50'
                      }`}
                      placeholder="your.email@example.com"
                      aria-describedby="email-error"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <span className={`text-xs ${getCharCountColor('email', charCounts.email)}`}>
                        {charCounts.email}/{LIMITS.email.max}
                      </span>
                    </div>
                  </div>
                  {errors.email && (
                    <p id="email-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-4 py-3 bg-background/50 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300 hover:border-accent/50 ${
                    errors.subject ? 'border-red-500' : 'border-border/50'
                  }`}
                  aria-describedby="subject-error"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="business">Business Partnership</option>
                  <option value="feedback">Feedback</option>
                  <option value="bug">Bug Report</option>
                </select>
                {errors.subject && (
                  <p id="subject-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.subject}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message *
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    maxLength={LIMITS.message.max}
                    required
                    rows={6}
                    className={`w-full px-4 py-3 bg-background/50 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300 hover:border-accent/50 resize-none ${
                      errors.message ? 'border-red-500' : 'border-border/50'
                    }`}
                    placeholder="Tell us how we can help you... (minimum 10 characters)"
                    aria-describedby="message-error message-help"
                  />
                  <div className="absolute bottom-3 right-3">
                    <span className={`text-xs ${getCharCountColor('message', charCounts.message)}`}>
                      {charCounts.message}/{LIMITS.message.max}
                    </span>
                  </div>
                </div>
                {errors.message && (
                  <p id="message-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.message}
                  </p>
                )}
                <p id="message-help" className="text-muted-foreground text-xs mt-1">
                  Minimum {LIMITS.message.min} characters required. HTML tags are not allowed.
                </p>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={isSubmitting || Object.keys(errors).some(key => errors[key])}
                  className="px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 active:scale-95 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Message
                    </>
                  )}
                </button>
                {submitStatus === 'success' && (
                  <div className="text-green-500 font-medium flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Message sent successfully!
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="text-red-500 font-medium flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Failed to send message. Please try again.
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Support Email */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-2xl font-bold text-foreground mb-6 font-serif">Support</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email Support</p>
                    <a href="mailto:support@afterdark.com" className="text-accent hover:text-accent-dark transition-colors">
                      support@afterdark.com
                    </a>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  Get help with technical issues, account problems, or general questions.
                </p>
              </div>
            </div>

            {/* Business Inquiries */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-2xl font-bold text-foreground mb-6 font-serif">Business Inquiries</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Partnerships</p>
                    <a href="mailto:business@afterdark.com" className="text-accent hover:text-accent-dark transition-colors">
                      business@afterdark.com
                    </a>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  Interested in partnerships, advertising, or business opportunities.
                </p>
              </div>
              </div>
            </div>

            {/* Social Media Links */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-6 font-serif text-center">Follow Us</h3>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <a
                href="https://twitter.com/afterdark"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 bg-background/50 rounded-lg hover:bg-accent/10 hover:scale-105 transition-all duration-300 group"
                >
                  <svg className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                  <span className="text-sm font-medium text-foreground">Twitter</span>
                </a>
                <a
                href="https://discord.gg/afterdark"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 bg-background/50 rounded-lg hover:bg-accent/10 hover:scale-105 transition-all duration-300 group"
                >
                  <svg className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  <span className="text-sm font-medium text-foreground">Discord</span>
                </a>
                <a
                href="https://reddit.com/r/afterdark"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 bg-background/50 rounded-lg hover:bg-accent/10 hover:scale-105 transition-all duration-300 group"
                >
                  <svg className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                  <span className="text-sm font-medium text-foreground">Reddit</span>
                </a>
            </div>
          </div>
        </div>

        {/* Response Time Info */}
        <div className="mt-16 text-center">
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-foreground mb-4 font-serif">Response Time</h3>
            <p className="text-muted-foreground">
              We typically respond to all inquiries within 24 hours during business days. 
              For urgent technical issues, please include "URGENT" in your subject line.
            </p>
          </div>
        </div>

        </div>
    </section>
  );
} 