import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Star, MessageSquare } from 'lucide-react';
import { db } from '../../lib/supabase';
import { Testimonial } from '../../types';
import toast from 'react-hot-toast';
import { TestimonialForm } from './TestimonialForm';

export const TestimonialsManager: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const data = await db.getTestimonials();
      setTestimonials(data);
    } catch (error: any) {
      toast.error('Failed to load testimonials');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      await db.deleteTestimonial(id);
      setTestimonials(testimonials.filter(t => t.id !== id));
      toast.success('Testimonial deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete testimonial');
    }
  };

  const handleFormSubmit = async (testimonialData: any) => {
    try {
      if (editingTestimonial) {
        const updated = await db.updateTestimonial(editingTestimonial.id, testimonialData);
        setTestimonials(testimonials.map(t => t.id === updated.id ? updated : t));
        toast.success('Testimonial updated successfully');
      } else {
        const created = await db.createTestimonial(testimonialData);
        setTestimonials([created, ...testimonials]);
        toast.success('Testimonial created successfully');
      }
      setShowForm(false);
      setEditingTestimonial(null);
    } catch (error: any) {
      toast.error('Failed to save testimonial');
    }
  };

  const openForm = (testimonial?: Testimonial) => {
    setEditingTestimonial(testimonial || null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTestimonial(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Testimonials</h1>
          <p className="text-gray-400 mt-2">Manage client testimonials and reviews</p>
        </div>
        <motion.button
          onClick={() => openForm()}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="h-5 w-5" />
          Add Testimonial
        </motion.button>
      </div>

      {testimonials.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No testimonials yet</h3>
          <p className="text-gray-400 mb-4">Get started by adding your first testimonial</p>
          <button
            onClick={() => openForm()}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add Testimonial
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {testimonial.image_url ? (
                    <img
                      src={testimonial.image_url}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-white font-medium">{testimonial.name}</h3>
                    <p className="text-sm text-gray-400">{testimonial.position}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
                {testimonial.featured && (
                  <span className="bg-cyan-500 text-white text-xs px-2 py-1 rounded">
                    Featured
                  </span>
                )}
              </div>

              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                "{testimonial.content}"
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {new Date(testimonial.created_at).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openForm(testimonial)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4 text-white" />
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showForm && (
        <TestimonialForm
          testimonial={editingTestimonial}
          onSubmit={handleFormSubmit}
          onClose={closeForm}
        />
      )}
    </div>
  );
};