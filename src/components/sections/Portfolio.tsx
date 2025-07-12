import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, Filter } from 'lucide-react'
import { db } from '../../lib/supabase'
import { Project } from '../../types'
import { ImageGalleryModal } from '../common/ImageGalleryModal'

const categories = ['All', 'Frontend', 'Mobile', 'UI/UX', 'Graphics']

export const Portfolio: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [showGallery, setShowGallery] = useState(false)
  const [selectedProjectImages, setSelectedProjectImages] = useState<any[]>([])
  const [selectedProjectTitle, setSelectedProjectTitle] = useState('')

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      console.log('Loading projects...')
      const data = await db.getProjects()
      console.log('Loaded projects data:', data)
      console.log('Graphics projects with images:', data.filter(p => p.category === 'Graphics' && p.images?.length > 0))

      // More detailed debugging for each project
      data.forEach((project, index) => {
        if (project.category === 'Graphics') {
          console.log(`Graphics Project ${index + 1}:`, {
            id: project.id,
            title: project.title,
            category: project.category,
            hasImages: !!project.images,
            imageCount: project.images?.length || 0,
            images: project.images
          })
        }
      })

      setProjects(data)
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeCategory)

  const openGallery = (project: Project) => {
    console.log('Project clicked:', project)
    console.log('Project category:', project.category)
    console.log('Project images:', project.images)
    console.log('Images length:', project.images?.length)
    console.log('Gallery state before:', { showGallery, selectedProjectImages, selectedProjectTitle })

    if (project.category === 'Graphics' && project.images && project.images.length > 0) {
      console.log('Opening gallery for project:', project.title)
      console.log('Setting gallery images:', project.images)
      setSelectedProjectImages(project.images)
      setSelectedProjectTitle(project.title)
      setShowGallery(true)
      console.log('Gallery state should be updated')
    } else {
      console.log('Gallery not opened. Reasons:')
      console.log('- Category is Graphics?', project.category === 'Graphics')
      console.log('- Has images?', !!project.images)
      console.log('- Images length > 0?', project.images && project.images.length > 0)
    }

    // Debug the state after update (with setTimeout to ensure state is updated)
    setTimeout(() => {
      console.log('Gallery state after update:', { showGallery, selectedProjectImages, selectedProjectTitle })
    }, 100)
  }

  const closeGallery = () => {
    console.log('Closing gallery')
    setShowGallery(false)
    setSelectedProjectImages([])
    setSelectedProjectTitle('')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (loading) {
    return (
      <section id="portfolio" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading projects...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="portfolio" className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Featured <span className="text-cyan-400">Projects</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A showcase of my latest work in frontend development, UI/UX design, and graphics
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12 px-4"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              } text-sm sm:text-base`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {filteredProjects.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
                <p className="text-gray-400">No projects available in this category yet.</p>
              </div>
            ) : (
              filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  onClick={(e) => {
                    e.preventDefault()
                    console.log('Card clicked for project:', project.title)
                    openGallery(project)
                  }}
                  className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 group cursor-pointer"
                  style={{ 
                    userSelect: 'none'
                  }}
                >
                  {/* Project Image */}
                  <div className="relative overflow-hidden">
                    {/* Debug overlay for Graphics projects */}
                    {project.category === 'Graphics' && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded z-10">
                        G: {project.images?.length || 0}
                      </div>
                    )}
                    <img
                      src={
                        project.category === 'Graphics' && project.images && project.images.length > 0
                          ? project.images[0].image_url
                          : project.image_url || 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800'
                      }
                      alt={project.title}
                      className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Overlay Actions */}
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {project.live_url && (
                        <motion.a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          className="p-1.5 sm:p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-cyan-500 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </motion.a>
                      )}
                      {project.github_url && (
                        <motion.a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          className="p-1.5 sm:p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-gray-600 transition-colors"
                        >
                          <Github className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </motion.a>
                      )}
                    </div>

                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                        <span className="bg-gradient-to-r from-cyan-500 to-pink-500 text-white text-xs px-2 sm:px-3 py-1 rounded-full font-medium">
                          Featured
                        </span>
                      </div>
                    )}

                    {/* Graphics Gallery Indicator */}
                    {project.category === 'Graphics' && project.images && project.images.length > 1 && (
                      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
                        <span className="bg-black/70 text-white text-xs px-2 sm:px-3 py-1 rounded-full font-medium">
                          {project.images.length} images
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg sm:text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded whitespace-nowrap ml-2">
                        {project.category}
                      </span>
                    </div>

                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Action Links */}
                    <div className="flex gap-2 sm:gap-3">
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white text-center py-2 sm:py-2.5 rounded-lg transition-colors text-xs sm:text-sm font-medium"
                        >
                          Live Demo
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-center py-2 sm:py-2.5 rounded-lg transition-colors text-xs sm:text-sm font-medium"
                        >
                          Code
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* View All Projects CTA */}
        {filteredProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-cyan-500 text-cyan-400 px-8 py-3 rounded-full font-semibold hover:bg-cyan-500 hover:text-white transition-all duration-300"
            >
              View All Projects
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Image Gallery Modal */}

      <ImageGalleryModal
        images={selectedProjectImages}
        isOpen={showGallery}
        onClose={closeGallery}
        projectTitle={selectedProjectTitle}
      />
    </section>
  )
}
