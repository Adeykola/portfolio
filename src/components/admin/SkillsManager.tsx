import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Target } from 'lucide-react';
import { db } from '../../lib/supabase';
import { Skill } from '../../types';
import toast from 'react-hot-toast';
import { SkillForm } from './SkillForm';

export const SkillsManager: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const data = await db.getSkills();
      setSkills(data);
    } catch (error: any) {
      toast.error('Failed to load skills');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      await db.deleteSkill(id);
      setSkills(skills.filter(s => s.id !== id));
      toast.success('Skill deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete skill');
    }
  };

  const handleFormSubmit = async (skillData: any) => {
    try {
      if (editingSkill) {
        const updated = await db.updateSkill(editingSkill.id, skillData);
        setSkills(skills.map(s => s.id === updated.id ? updated : s));
        toast.success('Skill updated successfully');
      } else {
        const created = await db.createSkill(skillData);
        setSkills([...skills, created]);
        toast.success('Skill created successfully');
      }
      setShowForm(false);
      setEditingSkill(null);
    } catch (error: any) {
      toast.error('Failed to save skill');
    }
  };

  const openForm = (skill?: Skill) => {
    setEditingSkill(skill || null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingSkill(null);
  };

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

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
          <h1 className="text-3xl font-bold text-white">Skills</h1>
          <p className="text-gray-400 mt-2">Manage your technical and creative skills</p>
        </div>
        <motion.button
          onClick={() => openForm()}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="h-5 w-5" />
          Add Skill
        </motion.button>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No skills yet</h3>
          <p className="text-gray-400 mb-4">Get started by adding your first skill</p>
          <button
            onClick={() => openForm()}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add Skill
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="space-y-4">
              <h2 className="text-xl font-semibold text-white capitalize">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorySkills.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openForm(skill)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4 text-white" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Proficiency</span>
                        <span className="text-cyan-400 font-semibold">{skill.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="bg-gradient-to-r from-cyan-500 to-pink-500 h-2 rounded-full"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-500 capitalize">{skill.category}</span>
                      <span className="text-xs text-gray-500">Order: {skill.order_index}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <SkillForm
          skill={editingSkill}
          onSubmit={handleFormSubmit}
          onClose={closeForm}
        />
      )}
    </div>
  );
};