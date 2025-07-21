import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Github, Linkedin, Instagram, Globe, Mail, ArrowRight, Shield, Heart } from 'lucide-react';

export function Footer() {
  const socialLinks = [
    {
      name: 'Portfolio',
      icon: Globe,
      url: '',
      color: 'hover:text-blue-400'
    },
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/mayankchaudharyyy',
      color: 'hover:text-gray-300'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://www.linkedin.com/in/mayankchoudharyy/',
      color: 'hover:text-blue-400'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/_mayank_chaudhary',
      color: 'hover:text-pink-400'
    }
  ];

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '/contact' }
  ];

  const resources = [
    { name: 'Documentation', href: '/docs' },
    { name: 'API Reference', href: '/api' },
    { name: 'Help Center', href: '/help' },
    { name: 'Community', href: '/community' }
  ];

  const legal = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 border-t border-gray-700/50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Brand Section - Takes more space */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-xl shadow-lg">
                    <Leaf className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Carbon Footprint Tracker</h3>
                  <p className="text-emerald-400 text-sm font-medium">Sustainable Living Made Simple</p>
                </div>
              </div>
              
              <p className="text-gray-300 text-base leading-relaxed max-w-md">
                Empowering individuals and organizations to track, understand, and reduce their carbon footprint 
                through intelligent analytics and actionable insights for a sustainable future.
              </p>

               

              {/* Trust Indicators */}
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Secure & Private</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">Carbon Neutral</span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {/* Quick Links */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold text-lg">Company</h4>
                  <ul className="space-y-3">
                    {quickLinks.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="text-gray-300 hover:text-emerald-400 transition-colors text-sm flex items-center group"
                        >
                          <span>{link.name}</span>
                          <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold text-lg">Resources</h4>
                  <ul className="space-y-3">
                    {resources.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="text-gray-300 hover:text-emerald-400 transition-colors text-sm flex items-center group"
                        >
                          <span>{link.name}</span>
                          <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal & Social */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold text-lg">Legal</h4>
                    <ul className="space-y-3">
                      {legal.map((link) => (
                        <li key={link.name}>
                          <a
                            href={link.href}
                            className="text-gray-300 hover:text-emerald-400 transition-colors text-sm flex items-center group"
                          >
                            <span>{link.name}</span>
                            <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Social Media */}
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold text-lg">Follow Us</h4>
                    <div className="flex gap-3">
                      {socialLinks.map((link) => (
                        <motion.a
                          key={link.name}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-3 bg-gray-800/60 backdrop-blur-sm rounded-xl text-gray-400 transition-all duration-300 border border-gray-700 hover:border-emerald-500/50 ${link.color}`}
                          title={link.name}
                        >
                          <link.icon className="w-5 h-5" />
                        </motion.a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>© 2025 Carbon Footprint Tracker. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <span className="flex items-center gap-1">
                Made with <Heart className="w-4 h-4 text-red-500 animate-pulse" /> for Earth
              </span>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
              <a 
                href="mailto:support@carbontracker.com" 
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Support</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}