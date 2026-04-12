import { useEffect, useState } from 'react';
import { Plus, Trash2, CreditCard as Edit2, Check, X, UploadCloud } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Project = {
  _id: string;
  title: string;
  description: string;
  category: string;
  client?: string;
  project_url?: string;
  image?: string;
  tags: string[];
  is_featured: boolean;
  display_order: number;
};

const API_BASE_URL = 'http://localhost:8000/api/v1/portfolios';

export default function AdminPortfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadType, setUploadType] = useState<'url' | 'upload'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    client: '',
    project_url: '',
    image: '',
    tags: '',
    is_featured: false,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const getAuthHeaders = () => {
    let token = localStorage.getItem('token');
    
    // Fallback if token wasn't saved correctly but exists in the user object
    if (!token || token === 'undefined') {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      token = userData?.accessToken || userData?.token || '';
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch projects');
      const result = await response.json();
      if (result.success) {
        setProjects(result.data);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    setError('');
    setSuccess('');
    try {
      await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      setSuccess('Project deleted successfully!');
      setProjects(projects.filter(p => p._id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleFormSubmit = async () => {
    if (editingId) {
      await handleUpdateProject(editingId);
    } else {
      await handleCreateProject();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      client: '',
      project_url: '',
      image: '',
      tags: '',
      is_featured: false,
    });
    setImageFile(null);
    setUploadType('url');
    setEditingId(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  const preparePayload = async () => {
    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    let imageUrl = formData.image;

    if (!formData.title || !formData.description || !formData.category) {
      setError('Title, description, and category are required.');
      return null;
    }

    if (uploadType === 'upload' && imageFile) {
      setIsUploading(true);
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `portfolio/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, imageFile);

      setIsUploading(false);
      if (uploadError) {
        setError(`Image upload failed: ${uploadError.message}`);
        return null;
      }

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      imageUrl = data.publicUrl;
    }

    return { ...formData, image: imageUrl, tags };
  }

  const handleCreateProject = async () => { 
    setError('');
    setSuccess('');
    const payload = await preparePayload();
    if (!payload) return;

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to create project.');

      setSuccess('Project created successfully!');
      setShowForm(false);
      resetForm();
      fetchProjects();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateProject = async (id: string) => {
    setError('');
    setSuccess('');
    const payload = await preparePayload();
    if (!payload) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to update project.');

      setSuccess('Project updated successfully!');
      setShowForm(false);
      resetForm();
      fetchProjects();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Portfolio Projects</h2>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            if (editingId) resetForm();
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} className="mr-2" />
          {showForm ? 'Cancel' : 'Add Project'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {showForm && (
        <div className="border border-gray-200 rounded-lg p-6 mb-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Project' : 'Add New Project'}</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Project Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              rows={2}
            />
            <input
              type="text"
              placeholder="Category (e.g., Web Development)"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Client"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Project URL"
              value={formData.project_url}
              onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2"><input type="radio" name="uploadType" value="url" checked={uploadType === 'url'} onChange={() => setUploadType('url')} /><span>Image URL</span></label>
                <label className="flex items-center space-x-2"><input type="radio" name="uploadType" value="upload" checked={uploadType === 'upload'} onChange={() => setUploadType('upload')} /><span>Upload Image</span></label>
              </div>
              {uploadType === 'url' ? (
                <input
                  type="text"
                  placeholder="https://example.com/image.png"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              ) : (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg flex items-center space-x-2">
                  <UploadCloud size={20} className="text-gray-500" />
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              )}
            </div>
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <span>Featured on Home Page</span>
            </label>
            <div className="flex space-x-2">
              <button onClick={handleFormSubmit} disabled={isUploading} className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400">
                <Check size={18} className="mr-1" /> {editingId ? 'Save' : 'Create'}
              </button>
              <button onClick={handleCancel} className="flex items-center px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                <X size={18} className="mr-1" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src={project.image || '/placeholder.jpg'}
              alt={project.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">{project.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
              <p className="text-xs text-blue-600 mb-4">{project.client}</p>
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    setEditingId(project._id);
                    setFormData({
                      title: project.title,
                      description: project.description,
                      category: project.category,
                      client: project.client || '',
                      project_url: project.project_url || '',
                      image: project.image || '',
                      tags: project.tags.join(', '),
                      is_featured: project.is_featured,
                    });
                    setUploadType('url');
                    setShowForm(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex-1 p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 flex items-center justify-center"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="flex-1 p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 flex items-center justify-center"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
