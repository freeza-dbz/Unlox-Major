import { useEffect, useState } from 'react';
import { Plus, Trash2, CreditCard as Edit2, Check, X, User, UploadCloud } from 'lucide-react';
import { supabase } from '../lib/supabase';

import { apiClient } from '../lib/apiClient';
type TeamMember = {
  _id: string;
  name: string;
  position: string;
  bio?: string;
  avatar_url?: string;
  linkedin_url?: string;
  department?: string;
  is_leadership: boolean;
  is_active: boolean;
  display_order: number;
};

export default function AdminTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadType, setUploadType] = useState<'url' | 'upload'>('url');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    avatar_url: '',
    linkedin_url: '',
    department: '',
    is_leadership: false,
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await apiClient.get('/api/v1/team');
      if (result.success) {
        setMembers(result.data);
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
      await apiClient.delete(`/api/v1/team/${id}`);
      setSuccess('Team member deleted successfully!');
      setMembers(members.filter(m => m._id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleFormSubmit = async () => {
    if (editingId) {
      await handleUpdateMember(editingId);
    } else {
      await handleCreateMember();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      bio: '',
      avatar_url: '',
      linkedin_url: '',
      department: '',
      is_leadership: false,
      is_active: true,
      display_order: 0,
    });
    setAvatarFile(null);
    setUploadType('url');
    setEditingId(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  const preparePayload = async () => {
    let avatarUrl = formData.avatar_url;

    if (!formData.name || !formData.position) {
      setError('Name and position are required.');
      return null;
    }

    if (uploadType === 'upload' && avatarFile) {
      setIsUploading(true);
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, avatarFile);

      setIsUploading(false);
      if (uploadError) {
        setError(`Avatar upload failed: ${uploadError.message}`);
        return null;
      }

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      avatarUrl = data.publicUrl;
    }

    return { ...formData, avatar_url: avatarUrl, display_order: Number(formData.display_order) };
  }

  const handleCreateMember = async () => { 
    setError('');
    setSuccess('');
    const payload = await preparePayload();
    if (!payload) return;

    try {
      await apiClient.post('/api/v1/team', payload);
      setSuccess('Team member created successfully!');
      setShowForm(false);
      resetForm();
      fetchMembers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateMember = async (id: string) => {
    setError('');
    setSuccess('');
    const payload = await preparePayload();
    if (!payload) return;

    try {
      await apiClient.patch(`/api/v1/team/${id}`, payload);
      setSuccess('Team member updated successfully!');
      setShowForm(false);
      resetForm();
      fetchMembers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            if (editingId) resetForm();
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} className="mr-2" />
          {showForm ? 'Cancel' : 'Add Member'}
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
          <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Member' : 'Add New Member'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded" />
            <input type="text" placeholder="Position" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded" />
            <input type="text" placeholder="Department" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded" />
            <input type="number" placeholder="Display Order" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded" />
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2"><input type="radio" name="uploadType" value="url" checked={uploadType === 'url'} onChange={() => setUploadType('url')} /><span>Avatar URL</span></label>
                <label className="flex items-center space-x-2"><input type="radio" name="uploadType" value="upload" checked={uploadType === 'upload'} onChange={() => setUploadType('upload')} /><span>Upload Avatar</span></label>
              </div>
              {uploadType === 'url' ? (
                <input type="text" placeholder="https://example.com/avatar.png" value={formData.avatar_url} onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded" />
              ) : (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg flex items-center space-x-2">
                  <UploadCloud size={20} className="text-gray-500" />
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) => setAvatarFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              )}
            </div>
            <input type="text" placeholder="LinkedIn URL" value={formData.linkedin_url} onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded md:col-span-2" />
            <textarea placeholder="Bio" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded md:col-span-2" rows={3} />
            <div className="flex items-center space-x-4 md:col-span-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={formData.is_leadership} onChange={(e) => setFormData({ ...formData, is_leadership: e.target.checked })} className="rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                <span>Leadership</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                <span>Active</span>
              </label>
            </div>
            <div className="flex space-x-2 md:col-span-2">
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
        {members.map((member) => (
          <div key={member._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
              {member.avatar_url ? (
                <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-gray-400" />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-sm text-blue-600 mb-2">{member.position}</p>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{member.bio}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span className={`px-2 py-1 rounded-full ${member.is_leadership ? 'bg-purple-100 text-purple-800' : 'bg-gray-100'}`}>
                  {member.is_leadership ? 'Leadership' : 'Team'}
                </span>
                <span className={`px-2 py-1 rounded-full ${member.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {member.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    setEditingId(member._id);
                    setFormData({
                      name: member.name,
                      position: member.position,
                      bio: member.bio || '',
                      avatar_url: member.avatar_url || '',
                      linkedin_url: member.linkedin_url || '',
                      department: member.department || '',
                      is_leadership: member.is_leadership,
                      is_active: member.is_active,
                      display_order: member.display_order,
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
                  onClick={() => handleDelete(member._id)}
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