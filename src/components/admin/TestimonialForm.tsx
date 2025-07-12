import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, Star } from 'lucide-react';
import { Testimonial } from '../../types';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  position: yup.string().required('Position is required'),
  company: yup.string().required('Company is required'),
  content: yup.string().required('Content is required'),
  image_url: yup.string().url('Must be a valid URL').nullable(),
  rating: yup.number().min(1).max(5).required('Rating is required'),
  featured: yup.boolean(),
});

type FormData = yup.InferType<typeof schema>;

interface TestimonialFormProps {
  testimonial?: Testimonial | null;
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export const TestimonialForm: React.FC<TestimonialFormProps> = ({ testimonial, onSubmit, onClose }) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: testimonial?.name || '',
      position: testimonial?.position || '',
      company: testimonial?.company || '',
      content: testimonial?.content || '',
      image_url: testimonial?.image_url || '',
      rating: testimonial?.rating || 5,
      featured: testimonial?.featured || false,
    },
  });

  const imageUrl = watch('image_url');
  const rating = watch('rating');

  const handleFormSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const testimonialData = {
        ...data,
        image_url: data.image_url || null,
      };
      await onSubmit(testimonialData);
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
              {testimonial ? 'Edit Testimonial' : 'Add Testimonial'}
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
                  Name *
                </label>
                <input
                  {...register('name')}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Client name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Position *
                </label>
                <input
                  {...register('position')}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Job title"
                />
                {errors.position && (
                  <p className="mt-1 text-sm text-red-400">{errors.position.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company *
              </label>
              <input
                {...register('company')}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Company name"
              />
              {errors.company && (
                <p className="mt-1 text-sm text-red-400">{errors.company.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Testimonial Content *
              </label>
              <textarea
                {...register('content')}
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="What did they say about your work?"
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-400">{errors.content.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Profile Image URL
              </label>
              <input
                {...register('image_url')}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="https://example.com/profile.jpg"
              />
              {errors.image_url && (
                <p className="mt-1 text-sm text-red-400">{errors.image_url.message}</p>
              )}
              {imageUrl && (
                <div className="mt-2">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setValue('rating', star)}
                      className="text-2xl hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-gray-300">{rating}/5</span>
                </div>
                {errors.rating && (
                  <p className="mt-1 text-sm text-red-400">{errors.rating.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    {...register('featured')}
                    type="checkbox"
                    className="rounded border-gray-600 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">Featured testimonial</span>
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
                {loading ? 'Saving...' : testimonial ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};