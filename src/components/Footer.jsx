import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Github, Linkedin, Instagram, Mail, Shield, Heart } from 'lucide-react';

export function Footer() {
  const socialLinks = [
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

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 border-t border-gray-700/50">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-8 lg:space-y-0">
            <div className="flex flex-col items-center lg:items-start space-y-4">
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
              
              <p className="text-gray-300 text-base leading-relaxed text-center lg:text-left max-w-md">
                Empowering individuals and organizations to track, understand, and reduce their carbon footprint 
                through intelligent analytics and actionable insights for a sustainable future.
              </p>

              <div className="flex items-center gap-4">
                 
                <div className="flex items-center gap-2 text-emerald-400">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">Carbon Neutral</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-end space-y-4">
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
                 
                
              </div>
              <a 
                href="mailto:mayankchaudhary7289@gmail.com" 
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