import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'

interface ImageGalleryModalProps {
  images: { id: string; image_url: string; order_index: number }[]
  isOpen: boolean
  onClose: () => void
  projectTitle?: string
}

export const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  images,
  isOpen,
  onClose,
  projectTitle = 'Project Gallery'
}) => {
  console.log('ImageGalleryModal rendered with:', { images, isOpen, projectTitle })
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [imageLoading, setImageLoading] = useState(true)

  // Sort images by order_index
  const sortedImages = [...images].sort((a, b) => a.order_index - b.order_index)
  console.log('Sorted images:', sortedImages)

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % sortedImages.length)
    setImageLoading(true)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length)
    setImageLoading(true)
  }

  const selectImage = (index: number) => {
    setSelectedImageIndex(index)
    setImageLoading(true)
  }

  // Reset selected image when modal opens
  React.useEffect(() => {
    if (isOpen) {
      console.log('🎭 Modal opened, resetting to first image')
      setSelectedImageIndex(0)
      setImageLoading(true)
    }
  }, [isOpen])

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return
      
      switch (event.key) {
        case 'Escape':
          console.log('⌨️ Escape key pressed, closing modal')
          onClose()
          break
        case 'ArrowLeft':
          prevImage()
          break
        case 'ArrowRight':
          nextImage()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  if (!isOpen || sortedImages.length === 0) {
    console.log('❌ Modal not rendering because:', { 
      isOpen, 
      imagesLength: sortedImages.length,
      reason: !isOpen ? 'Modal is closed' : 'No images to display'
    })
    return null
  }
  
  console.log('✅ Modal IS rendering with', sortedImages.length, 'images!')

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden p-2 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/95 backdrop-blur-lg cursor-pointer"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full h-full max-w-7xl max-h-screen flex flex-col z-[110]"
        >
          {/* Header */}
          <div className="relative flex items-center justify-between mb-2 sm:mb-4 bg-gray-900/98 backdrop-blur-xl rounded-t-xl p-3 sm:p-4 border-b border-gray-600 shadow-2xl">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-white line-clamp-1">{projectTitle}</h2>
              <p className="text-gray-400 text-xs sm:text-sm">
                {selectedImageIndex + 1} of {sortedImages.length} images
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 relative z-[120]">
              <motion.a
                href={sortedImages[selectedImageIndex]?.image_url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 sm:p-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors shadow-2xl border-2 border-cyan-300"
                title="Open full size"
              >
                <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 text-white drop-shadow-lg" />
              </motion.a>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 sm:p-3 lg:p-4 bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-2xl border-2 border-red-300 hover:border-red-200"
                title="Close gallery"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white drop-shadow-lg font-bold" strokeWidth={4} />
              </motion.button>
            </div>
            
            {/* Alternative close button in top-right corner */}
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 p-2 sm:p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors shadow-2xl border-2 sm:border-3 border-white z-[130]"
              title="Close gallery"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6 text-white drop-shadow-lg" strokeWidth={4} />
            </motion.button>
          </div>

          {/* Main Image Display */}
          <div className="flex-1 flex items-center justify-center relative bg-gray-900/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl border border-gray-700 min-h-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImageIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-cyan-500"></div>
                  </div>
                )}
                <img
                  src={sortedImages[selectedImageIndex]?.image_url}
                  alt={`${projectTitle} ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain touch-pan-x touch-pan-y"
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {sortedImages.length > 1 && (
              <>
                <motion.button
                  onClick={prevImage}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute left-2 sm:left-4 p-2 sm:p-3 bg-black/60 hover:bg-black/80 rounded-full transition-colors shadow-xl border border-gray-600 touch-manipulation"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </motion.button>
                <motion.button
                  onClick={nextImage}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-2 sm:right-4 p-2 sm:p-3 bg-black/60 hover:bg-black/80 rounded-full transition-colors shadow-xl border border-gray-600 touch-manipulation"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </motion.button>
              </>
            )}
          </div>

          {/* Thumbnail Grid */}
          {sortedImages.length > 1 && (
            <div className="mt-2 sm:mt-4 bg-gray-900/90 backdrop-blur-xl rounded-b-xl p-2 sm:p-4 shadow-2xl border-t-2 border-gray-600">
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {sortedImages.map((image, index) => (
                  <motion.button
                    key={image.id}
                    onClick={() => selectImage(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-all touch-manipulation ${
                      selectedImageIndex === index
                        ? 'border-cyan-400 ring-2 ring-cyan-400/60 shadow-xl'
                        : 'border-gray-500 hover:border-gray-300 shadow-lg'
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}