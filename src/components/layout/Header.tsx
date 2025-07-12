import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useStore } from '../../store/useStore'

const navigation = [
  { name: 'Home', href: '#hero' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
]

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { activeSection } = useStore()

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    const handleScroll = () => {
      // Clear the previous timeout
      clearTimeout(timeoutId)
      
      // Set a new timeout to debounce the scroll event
      timeoutId = setTimeout(() => {
        const scrolled = window.scrollY > 50
        setIsScrolled(scrolled)
      }, 10) // 10ms debounce for smooth updates
    }

    // Set initial state
    setIsScrolled(window.scrollY > 50)
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timeoutId)
    }
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-4 left-4 right-4 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg shadow-black/20'
          : 'bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold text-white"
          >
            Adekola
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  activeSection === item.href.slice(1)
                    ? 'text-cyan-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-xl mt-2 shadow-lg"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 max-h-[60vh] overflow-y-auto">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="block px-4 py-3 text-lg font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md w-full text-left transition-colors"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}