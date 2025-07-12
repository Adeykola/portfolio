import React from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Mail, Heart, ArrowUp } from 'lucide-react'
import { useStore } from '../../store/useStore'

const quickLinks = [
  { name: 'Home', href: '#hero' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
]

const services = [
  'Frontend Development',
  'UI/UX Design',
  'Graphics Design',
  'Web Development',
]

export const Footer: React.FC = () => {
  const { siteSettings, settingsLoaded } = useStore()

  // Dynamic social links using site settings
  const socialLinks = [
    { 
      icon: Github, 
      href: siteSettings.footer_github_url || 'https://github.com', 
      label: 'GitHub' 
    },
    { 
      icon: Linkedin, 
      href: siteSettings.footer_linkedin_url || 'https://linkedin.com', 
      label: 'LinkedIn' 
    },
    { 
      icon: Twitter, 
      href: siteSettings.footer_twitter_url || 'https://twitter.com', 
      label: 'Twitter' 
    },
    { 
      icon: Mail, 
      href: `mailto:${siteSettings.footer_email_contact || 'hello@adekola.dev'}`, 
      label: 'Email' 
    },
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Don't render until settings are loaded
  if (!settingsLoaded) {
    return (
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading...</p>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {siteSettings.footer_brand_name || 'Adekola'}
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                {siteSettings.footer_description || 'Frontend Developer & UI/UX Designer passionate about creating exceptional digital experiences that make a difference.'}
              </p>
              <div className="flex gap-3 sm:gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="p-2 sm:p-2.5 bg-gray-800 rounded-lg hover:bg-cyan-500 transition-all duration-300 group"
                  >
                    <social.icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-white" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <h4 className="text-lg font-semibold text-white">Quick Links</h4>
              <ul className="space-y-1 sm:space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm sm:text-base"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h4 className="text-lg font-semibold text-white">Services</h4>
              <ul className="space-y-1 sm:space-y-2">
                {services.map((service) => (
                  <li key={service}>
                    <span className="text-gray-400 text-sm sm:text-base">{service}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h4 className="text-lg font-semibold text-white">Get In Touch</h4>
              <div className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <p>{siteSettings.footer_location || 'Lagos, Nigeria'}</p>
                <p>{siteSettings.footer_email_contact || 'hello@adekola.dev'}</p>
                <p>{siteSettings.footer_phone || '+234 (0) 123 456 7890'}</p>
              </div>
              <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs sm:text-sm font-medium">
                    {siteSettings.footer_availability_status || 'Available for projects'}
                  </span>
                </div>
                <p className="text-gray-300 text-xs sm:text-sm mt-2"></p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-4 sm:py-6 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-400 text-xs sm:text-sm flex items-center gap-1 text-center sm:text-left"
            >
              {siteSettings.footer_copyright_text || '© 2024 Adekola Afolabi. Made with'}
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              {siteSettings.footer_copyright_suffix || 'in Nigeria'}
            </motion.p>

            <div className="flex items-center gap-6">
              <button
                onClick={() => scrollToSection('#contact')}
                className="text-gray-400 hover:text-cyan-400 text-xs sm:text-sm transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => scrollToSection('#contact')}
                className="text-gray-400 hover:text-cyan-400 text-xs sm:text-sm transition-colors"
              >
                Terms of Service
              </button>
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 sm:p-2 bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors"
              >
                <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}