import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X } from 'lucide-react';
import { Skill } from '../../types';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  category: yup.string().required('Category is required'),
  percentage: yup.number().min(0).max(100).required('Percentage is required'),
  order_index: yup.number().min(0).required('Order is required'),
});

type FormData = yup.InferType<typeof schema>;

interface SkillFormProps {
  skill?: Skill | null;
  onSubmit: (data: any) => void;
  onClose: () => void;
}

const categories = [
  'frontend',
  'backend',
  'design',
  'mobile',
  'tools',
  'languages'
];

export const SkillForm: React.FC<SkillFormProps> = ({ skill, onSubmit, onClose }) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: skill?.name || '',
      category: skill?.category || 'frontend',
      percentage: skill?.percentage || 80,
      order_index: skill?.order_index || 0,
    },
  });

  const percentage = watch('percentage');

  const handleFormSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await onSubmit(data);
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
          className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {skill ? 'Edit Skill' : 'Add Skill'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Skill Name *
              </label>
              <input
                {...register('name')}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="e.g., React, TypeScript, Figma"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
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
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-400">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Proficiency Level * ({percentage}%)
              </label>
              <input
                {...register('percentage')}
                type="range"
                min="0"
                max="100"
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
              {errors.percentage && (
                <p className="mt-1 text-sm text-red-400">{errors.percentage.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Order *
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
                {loading ? 'Saving...' : skill ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};