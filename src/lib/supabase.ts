import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database functions
export const db = {
  // File upload function
  async uploadFile(file: File | Blob, bucketName: string, fileName: string) {
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      return { publicUrl, error: null };
    } catch (error) {
      console.error('Upload error:', error);
      return { publicUrl: null, error };
    }
  },

  // Projects
  async getProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          images:project_images(*)
        `)
        .order('order_index', { ascending: true });
      
      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }
      
      const processedData = data?.map(project => {
        return {
          ...project,
          images: project.images || []
        };
      }) || [];
      
      return processedData;
    } catch (error) {
      console.error('Database error in getProjects:', error);
      throw error;
    }
  },

  async createProject(project: Omit<any, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProject(id: string, updates: any) {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteProject(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Project Images
  async getProjectImages(projectId: string) {
    const { data, error } = await supabase
      .from('project_images')
      .select('*')
      .eq('project_id', projectId)
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async addProjectImage(projectId: string, imageUrl: string, orderIndex: number = 0) {
    const { data, error } = await supabase
      .from('project_images')
      .insert([{
        project_id: projectId,
        image_url: imageUrl,
        order_index: orderIndex
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteProjectImage(imageId: string) {
    const { error } = await supabase
      .from('project_images')
      .delete()
      .eq('id', imageId);
    
    if (error) throw error;
  },

  async deleteProjectImages(projectId: string) {
    const { error } = await supabase
      .from('project_images')
      .delete()
      .eq('project_id', projectId);
    
    if (error) throw error;
  },

  // Testimonials
  async getTestimonials() {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createTestimonial(testimonial: any) {
    const { data, error } = await supabase
      .from('testimonials')
      .insert([testimonial])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateTestimonial(id: string, updates: any) {
    const { data, error } = await supabase
      .from('testimonials')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteTestimonial(id: string) {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Skills
  async getSkills() {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async createSkill(skill: any) {
    const { data, error } = await supabase
      .from('skills')
      .insert([skill])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateSkill(id: string, updates: any) {
    const { data, error } = await supabase
      .from('skills')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteSkill(id: string) {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Site Settings
  async getSiteSettings() {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('key', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async updateSiteSetting(key: string, value: string) {
    const { data, error } = await supabase
      .from('site_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Contacts
  async getContacts() {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createContact(contact: any) {
    const { data, error } = await supabase
      .from('contacts')
      .insert([contact])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateContactStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('contacts')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteContact(id: string) {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};