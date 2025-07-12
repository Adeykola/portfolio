import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FolderOpen, MessageSquare, Target, Mail } from 'lucide-react';
import { db } from '../../lib/supabase';

const mockAnalytics = [
  { name: 'Jan', views: 120 },
  { name: 'Feb', views: 190 },
  { name: 'Mar', views: 300 },
  { name: 'Apr', views: 250 },
  { name: 'May', views: 420 },
  { name: 'Jun', views: 380 },
];

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    projects: 0,
    testimonials: 0,
    skills: 0,
    contacts: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [projects, testimonials, skills, contacts] = await Promise.all([
        db.getProjects(),
        db.getTestimonials(),
        db.getSkills(),
        db.getContacts(),
      ]);

      setStats({
        projects: projects.length,
        testimonials: testimonials.length,
        skills: skills.length,
        contacts: contacts.length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const statCards = [
    { title: 'Projects', value: stats.projects, icon: FolderOpen, color: 'bg-blue-500' },
    { title: 'Testimonials', value: stats.testimonials, icon: MessageSquare, color: 'bg-green-500' },
    { title: 'Skills', value: stats.skills, icon: Target, color: 'bg-purple-500' },
    { title: 'Contacts', value: stats.contacts, icon: Mail, color: 'bg-cyan-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">Overview of your portfolio performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{card.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <h2 className="text-xl font-semibold text-white mb-6">Portfolio Views</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockAnalytics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="views" fill="#06B6D4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-300">New project added</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-gray-300">Testimonial updated</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <span className="text-gray-300">Skills synchronized</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Site Health</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Performance</span>
              <span className="text-green-400">Good</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">SEO Score</span>
              <span className="text-green-400">95/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Accessibility</span>
              <span className="text-green-400">Excellent</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors">
              Add new project
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors">
              Update skills
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors">
              Backup data
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};