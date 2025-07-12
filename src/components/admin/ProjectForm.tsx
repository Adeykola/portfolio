import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, Upload } from 'lucide-react';
import { Project } from '../../types';
import { db } from '../../lib/supabase';
import { optimizeImage } from '../../utils/imageOptimizer';
import toast from 'react-hot-toast';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  category: yup.string().oneOf(['Frontend', 'Mobile', 'UI/UX', 'Graphics']).required('Category is required'),
  technologies: yup.string().required('Technologies are required'),
  live_url: yup.string().url('Must be a valid URL').nullable(),
  github_url: yup.string().url('Must be a valid URL').nullable(),
  image_url: yup.string().url('Must be a valid URL').nullable(),
  featured: yup.boolean().default(false),
  order_index: yup.number().min(0).required('Order is required'),
});

type FormData = yup.InferType<typeof schema>;

interface ProjectFormProps {
  project?: Project | null;
  onSubmit: (data: any, images: string[]) => void;
  onClose: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSubmit, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [uploadingSingle, setUploadingSingle] = useState(false);
  const [projectImages, setProjectImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      category: project?.category || 'Frontend',
      technologies: project?.technologies?.join(', ') || '',
      live_url: project?.live_url || null,
      github_url: project?.github_url || null,
      image_url: project?.image_url || null,
      featured: project?.featured || false,
      order_index: project?.order_index || 0,
    },
  });

  // Initialize project images when editing
  useEffect(() => {
    if (project?.images) {
      setProjectImages(project.images.map(img => img.image_url));
    } else {
      setProjectImages([]);
    }
  }, [project]);

  const category = watch('category');

  const addImage = () => {
    if (newImageUrl.trim() && !projectImages.includes(newImageUrl.trim())) {
      console.log('Adding image URL:', newImageUrl.trim());
      setProjectImages([...projectImages, newImageUrl.trim()]);
      console.log('Updated projectImages state:', [...projectImages, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleSingleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploadingSingle(true);
    try {
      // Optimize image
      const optimizedImage = await optimizeImage(file);
      
      // Generate unique filename
      const timestamp = Date.now();
      const extension = file.name.split('.').pop() || 'jpg';
      const filename = `main-${timestamp}.${extension}`;
      
      // Upload to Supabase Storage
      const { publicUrl, error } = await db.uploadFile(optimizedImage, 'project-images', filename);
      
      if (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload image');
        return;
      }
      
      if (publicUrl) {
        setValue('image_url', publicUrl);
        toast.success('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingSingle(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  const removeImage = (index: number) => {
    setProjectImages(projectImages.filter((_, i) => i !== index));
  };

  const imageUrl = watch('image_url');

  const handleFormSubmit = async (data: FormData) => {
    setLoading(true);
    console.log('Form submission - Category:', data.category);
    console.log('Form submission - Project images:', projectImages);
    try {
      const projectData = {
        ...data,
        technologies: data.technologies.split(',').map(t => t.trim()).filter(Boolean),
        live_url: data.live_url || null,
        github_url: data.github_url || null,
        image_url: data.image_url || null,
      };

      console.log('Calling onSubmit with projectData:', projectData);
      console.log('Calling onSubmit with projectImages:', projectImages);
      await onSubmit(projectData, projectImages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {project ? 'Edit Project' : 'Add Project'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  {...register('title')}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Project title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  {...register('category')}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Mobile">Mobile</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="Graphics">Graphics</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-400">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Project description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Technologies * (comma-separated)
              </label>
              <input
                {...register('technologies')}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="React, TypeScript, TailwindCSS"
              />
              {errors.technologies && (
                <p className="mt-1 text-sm text-red-400">{errors.technologies.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Live URL
                </label>
                <input
                  {...register('live_url')}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="https://example.com"
                />
                {errors.live_url && (
                  <p className="mt-1 text-sm text-red-400">{errors.live_url.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  GitHub URL
                </label>
                <input
                  {...register('github_url')}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="https://github.com/username/repo"
                />
                {errors.github_url && (
                  <p className="mt-1 text-sm text-red-400">{errors.github_url.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Main Project Image
              </label>
              
              {/* File Upload Option */}
              <div className="mb-3">
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSingleImageUpload}
                    className="hidden"
                    id="main-image-upload"
                  />
                  <label
                    htmlFor="main-image-upload"
                    className={`flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-cyan-500 transition-colors ${
                      uploadingSingle ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Upload className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-300">
                      {uploadingSingle ? 'Uploading...' : 'Upload from computer'}
                    </span>
                  </label>
                  {uploadingSingle && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-500"></div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Max 5MB • PNG, JPG, JPEG, WebP
                </p>
              </div>

              {/* URL Input Option */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Or paste image URL:
                </label>
                <input
                  {...register('image_url')}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {errors.image_url && (
                <p className="mt-1 text-sm text-red-400">{errors.image_url.message}</p>
              )}
              {imageUrl && (
                <div className="mt-2">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-32 h-20 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Graphics Images Section */}
            {category === 'Graphics' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Images
                </label>
                
                {/* Add Image Input */}
                <div className="flex gap-2 mb-4">
                  <input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>

                {/* Images Grid */}
                {projectImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {projectImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Project image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Order *
                </label>
                <input
                  {...register('order_index')}
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="0"
                />
                {errors.order_index && (
                  <p className="mt-1 text-sm text-red-400">{errors.order_index.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    {...register('featured')}
                    type="checkbox"
                    className="rounded border-gray-600 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">Featured project</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : project ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};