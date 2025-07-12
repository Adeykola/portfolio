import React from 'react'
import { motion } from 'framer-motion'
import { Download, ArrowRight, Github, Linkedin, Mail, Sun, Moon } from 'lucide-react'
import { useStore } from '../../store/useStore'

const skills = [
  'React', 'TypeScript', 'TailwindCSS', 'Node.js', 'Figma', 'Adobe CC'
]

export const Hero: React.FC = () => {
  const { siteSettings, settingsLoaded, fetchSiteSettings } = useStore()
  const dotPatternUrl = "data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"

  // Force refetch settings if they're empty
  React.useEffect(() => {
    if (settingsLoaded && Object.keys(siteSettings).length === 0) {
      console.log('Settings loaded but empty, refetching...')
      fetchSiteSettings()
    }
  }, [settingsLoaded, siteSettings, fetchSiteSettings])

  const scrollToPortfolio = () => {
    const element = document.querySelector('#portfolio')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToContact = () => {
    const element = document.querySelector('#contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Don't render until settings are loaded to prevent flash of default content
  if (!settingsLoaded) {
    return (
      <section id="hero" className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </section>
    )
  }

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden z-0">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
      <div className={`absolute inset-0 bg-[url('${dotPatternUrl}')]`}></div>
      
      {/* Floating Elements */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-20 w-16 h-16 bg-cyan-500/20 rounded-full blur-xl"
      />
      <motion.div
        animate={{ 
          y: [0, 20, 0],
          rotate: [360, 180, 0]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-20 right-20 w-24 h-24 bg-pink-500/20 rounded-full blur-xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 md:pt-32">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-medium mb-4">
                {siteSettings.hero_freelance_status_text || 'Available for Freelance'}
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
                {siteSettings.hero_main_heading_prefix || 'Hello, I\'m '}{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent block sm:inline">
                  {siteSettings.hero_main_heading_suffix || 'Adekola'}
                </span>
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 leading-relaxed">
                {siteSettings.hero_tagline || '<span class="font-semibold text-white">Frontend Developer</span>, <span class="font-semibold text-white">UI/UX Designer</span> & <span class="font-semibold text-white">Graphics Designer</span>'}
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8"
            >
              <motion.button
                onClick={scrollToContact}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 text-sm sm:text-base"
              >
                {siteSettings.hero_cta_primary_text || 'Let\'s Work Together'}
                <ArrowRight className="h-5 w-5" />
              </motion.button>
              <motion.button
                onClick={scrollToPortfolio}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-gray-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 text-sm sm:text-base"
              >
                {siteSettings.hero_cta_secondary_text || 'View Portfolio'}
              </motion.button>
            </motion.div>

            {/* Technologies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center lg:text-left"
            >
              <p className="text-gray-400 text-sm sm:text-base mb-4">{siteSettings.hero_technologies_label || 'Technologies I work with'}</p>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 sm:px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full text-gray-300 text-xs sm:text-sm font-medium hover:border-cyan-500/50 transition-colors"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>

          </motion.div>

          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mx-auto">
              <img
                src="/portfolio (1).png"
                alt="Adekola Afolabi"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
        </div>


      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-cyan-400 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}