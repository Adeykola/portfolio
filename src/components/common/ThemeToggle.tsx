import React from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useStore } from '../../store/useStore'

export const ThemeToggle: React.FC = () => {
  const { isDarkMode, setDarkMode } = useStore()

  return (
    <motion.button
      onClick={() => setDarkMode(!isDarkMode)}
      className="fixed top-6 right-6 z-50 p-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        animate={{ rotate: isDarkMode ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {isDarkMode ? (
          <Sun className="h-5 w-5 text-yellow-400" />
        ) : (
          <Moon className="h-5 w-5 text-blue-600" />
        )}
      </motion.div>
    </motion.button>
  )
}