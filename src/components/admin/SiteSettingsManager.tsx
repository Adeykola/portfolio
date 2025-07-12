import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { supabase } from '../../lib/supabase';
import { Settings, Save, Plus, Trash2, Edit3 } from 'lucide-react';

interface SiteSetting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export default function SiteSettingsManager() {
  const { fetchSiteSettings } = useStore();
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newSetting, setNewSetting] = useState({ key: '', value: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('key');

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (id: string, value: string) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('site_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setSettings(prev => prev.map(setting => 
        setting.id === id ? { ...setting, value, updated_at: new Date().toISOString() } : setting
      ));
      
      // Refresh the store
      await fetchSiteSettings();
      setEditingKey(null);
    } catch (error) {
      console.error('Error updating setting:', error);
      alert('Failed to update setting');
    } finally {
      setSaving(false);
    }
  };

  const addSetting = async () => {
    if (!newSetting.key.trim() || !newSetting.value.trim()) {
      alert('Please provide both key and value');
      return;
    }

    try {
      setSaving(true);
      const { data, error } = await supabase
        .from('site_settings')
        .upsert([{
          key: newSetting.key.trim(),
          value: newSetting.value.trim()
        }])
        .select()
        .single();

      if (error) throw error;

      setSettings(prev => {
        const existingIndex = prev.findIndex(setting => setting.key === data.key);
        if (existingIndex >= 0) {
          // Update existing setting
          return prev.map((setting, index) => 
            index === existingIndex ? data : setting
          );
        } else {
          // Add new setting
          return [...prev, data];
        }
      });
      setNewSetting({ key: '', value: '' });
      setShowAddForm(false);
      
      // Refresh the store
      await fetchSiteSettings();
    } catch (error) {
      console.error('Error adding setting:', error);
      alert('Failed to add setting');
    } finally {
      setSaving(false);
    }
  };

  const deleteSetting = async (id: string) => {
    if (!confirm('Are you sure you want to delete this setting?')) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('site_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSettings(prev => prev.filter(setting => setting.id !== id));
      
      // Refresh the store
      await fetchSiteSettings();
    } catch (error) {
      console.error('Error deleting setting:', error);
      alert('Failed to delete setting');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Settings className="w-6 h-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Site Settings
          </h1>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Setting</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Add New Setting
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Key
              </label>
              <input
                type="text"
                value={newSetting.key}
                onChange={(e) => setNewSetting(prev => ({ ...prev, key: e.target.value }))}
                placeholder="e.g., hero_main_heading"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Value
              </label>
              <input
                type="text"
                value={newSetting.value}
                onChange={(e) => setNewSetting(prev => ({ ...prev, value: e.target.value }))}
                placeholder="Setting value"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewSetting({ key: '', value: '' });
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={addSetting}
              disabled={saving}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Adding...' : 'Add Setting'}</span>
            </button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Current Settings ({settings.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {settings.map((setting) => (
            <SettingRow
              key={setting.id}
              setting={setting}
              isEditing={editingKey === setting.key}
              onEdit={() => setEditingKey(setting.key)}
              onSave={(value) => updateSetting(setting.id, setting.key, value)}
              onSave={(value) => updateSetting(setting.id, value)}
              onCancel={() => setEditingKey(null)}
              onDelete={() => deleteSetting(setting.id)}
              saving={saving}
            />
          ))}
        </div>

        {settings.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No site settings found. Add your first setting to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface SettingRowProps {
  setting: SiteSetting;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (value: string) => void;
  onCancel: () => void;
  onDelete: () => void;
  saving: boolean;
}

function SettingRow({ setting, isEditing, onEdit, onSave, onCancel, onDelete, saving }: SettingRowProps) {
  const [editValue, setEditValue] = useState(setting.value);

  const handleSave = () => {
    onSave(editValue);
  };

  const handleCancel = () => {
    setEditValue(setting.value);
    onCancel();
  };

  return (
    <div className="px-6 py-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <code className="text-sm font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded">
              {setting.key}
            </code>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Updated: {new Date(setting.updated_at).toLocaleDateString()}
            </span>
          </div>
          
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-3 h-3" />
                  <span>{saving ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
              {setting.value}
            </p>
          )}
        </div>
        
        {!isEditing && (
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              title="Edit setting"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Delete setting"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export { SiteSettingsManager }