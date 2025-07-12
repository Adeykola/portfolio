import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ExternalLink, Github, FolderOpen } from 'lucide-react';
import { db } from '../../lib/supabase';
import { Project } from '../../types';
import toast from 'react-hot-toast';
import { ProjectForm } from './ProjectForm';

export const ProjectsManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await db.getProjects();
      setProjects(data);
    } catch (error: any) {
      toast.error('Failed to load projects');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await db.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
      toast.success('Project deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete project');
    }
  };

  const handleFormSubmit = async (projectData: any, projectImages: string[] = []) => {
    console.log('ProjectsManager - Received projectData:', projectData);
    console.log('ProjectsManager - Received projectImages:', projectImages);
    console.log('ProjectsManager - Project category:', projectData.category);
    
    try {
      let savedProject;
      if (editingProject) {
        console.log('Updating existing project with ID:', editingProject.id);
        savedProject = await db.updateProject(editingProject.id, projectData);
        toast.success('Project updated successfully');
      } else {
        console.log('Creating new project');
        savedProject = await db.createProject(projectData);
        toast.success('Project created successfully');
      }

      // Handle project images
      const projectId = savedProject.id;
      console.log('Saved project ID:', projectId);
      
      if (projectData.category === 'Graphics') {
        console.log('Processing Graphics project - deleting existing images');
        // For Graphics projects, manage multiple images
        await db.deleteProjectImages(projectId);
        console.log('Deleted existing project images');
        
        // Add new images
        console.log('Adding', projectImages.length, 'new images');
        for (let i = 0; i < projectImages.length; i++) {
          console.log('Adding image', i + 1, ':', projectImages[i]);
          await db.addProjectImage(projectId, projectImages[i], i);
          console.log('Successfully added image', i + 1);
        }
        console.log('Finished adding all images');
      } else {
        console.log('Non-Graphics project - ensuring no project images exist');
        // For non-Graphics projects, ensure no project images exist
        await db.deleteProjectImages(projectId);
        console.log('Cleaned up any existing project images');
      }

      // Reload projects to get updated data with images
      console.log('Reloading projects to refresh data');
      await loadProjects();
      console.log('Projects reloaded successfully');
      
      setShowForm(false);
      setEditingProject(null);
    } catch (error: any) {
      console.error('Error in handleFormSubmit:', error);
      toast.error('Failed to save project');
      console.error('Project save error:', error);
    }
  };

  const openForm = (project?: Project) => {
    setEditingProject(project || null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProject(null);
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
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 mt-2">Manage your portfolio projects</p>
        </div>
        <motion.button
          onClick={() => openForm()}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="h-5 w-5" />
          Add Project
        </motion.button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
          <p className="text-gray-400 mb-4">Get started by adding your first project</p>
          <button
            onClick={() => openForm()}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors"
            >
              {/* Project Images */}
              {project.category === 'Graphics' && project.images && project.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-1 h-48">
                  {project.images.slice(0, 4).map((image, imgIndex) => (
                    <img
                      key={image.id}
                      src={image.image_url}
                      alt={`${project.title} ${imgIndex + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop';
                      }}
                    />
                  ))}
                  {project.images.length > 4 && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      +{project.images.length - 4} more
                    </div>
                  )}
                </div>
              ) : project.image_url ? (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                  {project.featured && (
                    <span className="bg-cyan-500 text-white text-xs px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                    {project.category}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-gray-400 text-xs">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <ExternalLink className="h-4 w-4 text-gray-300" />
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <Github className="h-4 w-4 text-gray-300" />
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openForm(project)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4 text-white" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showForm && (
        <ProjectForm
          project={editingProject}
          onSubmit={handleFormSubmit}
          onClose={closeForm}
        />
      )}
    </div>
  );
};