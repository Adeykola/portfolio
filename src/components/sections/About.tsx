import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Award, Users, Coffee, Calendar } from 'lucide-react'
import { db } from '../../lib/supabase'
import { Skill } from '../../types'
import { useStore } from '../../store/useStore'

const stats = [
  { icon: Award, label: 'Projects Completed', value: '50+' },
  { icon: Users, label: 'Happy Clients', value: '25+' },
  { icon: Coffee, label: 'Cups of Coffee', value: '1000+' },
  { icon: Calendar, label: 'Years Experience', value: '5+' },
]

export const About: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const { settingsLoaded } = useStore()

  useEffect(() => {
    loadSkills()
  }, [])

  const loadSkills = async () => {
    try {
      const data = await db.getSkills()
      setSkills(data)
    } catch (error) {
      console.error('Error loading skills:', error)
    } finally {
      setLoading(false)
    }
  }

  // Default skills if none in database
  const defaultSkills = [
    { name: 'Frontend Development', category: 'technical', percentage: 95 },
    { name: 'UI/UX Design', category: 'design', percentage: 90 },
    { name: 'Graphics Design', category: 'design', percentage: 85 },
    { name: 'React/TypeScript', category: 'technical', percentage: 92 },
    { name: 'TailwindCSS', category: 'technical', percentage: 88 },
    { name: 'Figma/Adobe CC', category: 'design', percentage: 87 },
  ]

  const displaySkills = skills.length > 0 ? skills : defaultSkills

  // Don't render until settings are loaded
  if (!settingsLoaded || loading) {
    return (
      <section id="about" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About <span className="text-cyan-400">Me</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Passionate about creating digital experiences that make a difference
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 order-2 lg:order-1"
          >
            <div className="prose prose-lg prose-invert">
              <p className="text-gray-300 leading-relaxed">
                I'm a passionate <span className="text-white font-semibold">Frontend Developer</span> and{' '}
                <span className="text-white font-semibold">UI/UX Designer</span> with over 5 years of experience 
                creating exceptional digital experiences. I specialize in building responsive web applications 
                and crafting intuitive user interfaces that drive engagement and conversions.
              </p>
              
              <p className="text-gray-300 leading-relaxed">
                My expertise spans across modern web technologies including React, TypeScript, and TailwindCSS, 
                combined with a strong eye for design using Figma and Adobe Creative Suite. I believe in the 
                power of merging aesthetics with functionality to create products that not only look great 
                but also solve real problems.
              </p>

              <p className="text-gray-300 leading-relaxed">
                When I'm not coding or designing, you'll find me exploring new technologies, contributing to 
                open-source projects, or sharing my knowledge through tech communities. I'm always excited 
                to take on new challenges and collaborate on innovative projects.
              </p>
            </div>

            {/* Download Resume */}
            <motion.a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                const element = document.querySelector('#contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
            >
              <Download className="h-5 w-5" />
              Get In Touch
            </motion.a>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6 pt-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-gray-800 p-3 sm:p-4 rounded-lg">
                    <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 mx-auto mb-2" />
                    <div className="text-lg sm:text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Skills */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8 order-1 lg:order-2"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-8">Technical Skills</h3>
              
              <div className="space-y-4 sm:space-y-6">
                {displaySkills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium text-sm sm:text-base">{skill.name}</span>
                      <span className="text-cyan-400 font-semibold text-sm sm:text-base">{skill.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 sm:h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="bg-gradient-to-r from-cyan-500 to-pink-500 h-2 sm:h-3 rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-800 p-4 sm:p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-white mb-4">What I Do Best</h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-300 text-sm sm:text-base">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  Responsive Web Development
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  User Interface Design
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  Brand Identity & Graphics
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  Performance Optimization
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}