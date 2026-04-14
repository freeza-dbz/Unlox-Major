import { useEffect, useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { apiClient } from '../lib/apiClient';

type CompanyInfo = {
  _id?: string;
  mission: string;
  vision: string;
  story: string;
  founded_year?: number;
  values: { title: string; description: string }[];
};

export default function AdminSettings() {
  const [info, setInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await apiClient.get('/api/v1/about');
      if (result.success) {
        setInfo(result.data);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!info) return;
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const result = await apiClient.patch('/api/v1/about', info);
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setInfo(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  if (!info) {
    return <p className="text-gray-600">No settings found</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Settings</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          {success}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Mission Statement
          </label>
          <textarea
            value={info.mission || ''}
            onChange={(e) => setInfo({ ...info, mission: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Vision Statement
          </label>
          <textarea
            value={info.vision || ''}
            onChange={(e) => setInfo({ ...info, vision: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Company Story
          </label>
          <textarea
            value={info.story || ''}
            onChange={(e) => setInfo({ ...info, story: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            rows={5}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Founded Year
          </label>
          <input
            type="number"
            value={info.founded_year || ''}
            onChange={(e) => setInfo({ ...info, founded_year: Number(e.target.value) || undefined })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="border-t pt-6">
          <label className="block text-sm font-semibold text-gray-900 mb-4 flex justify-between items-center">
            Company Values
            <button
              onClick={() => setInfo({ ...info, values: [...info.values, { title: '', description: '' }] })}
              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-200"
            >
              <Plus size={14} className="mr-1" /> Add Value
            </button>
          </label>
          <div className="space-y-3">
            {info.values && info.values.map((value, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg border relative">
                <input
                  type="text"
                  placeholder="Value title"
                  value={value.title}
                  onChange={(e) => {
                    const newValues = [...info.values];
                    newValues[idx].title = e.target.value;
                    setInfo({ ...info, values: newValues });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
                />
                <textarea
                  placeholder="Value description"
                  value={value.description}
                  onChange={(e) => {
                    const newValues = [...info.values];
                    newValues[idx].description = e.target.value;
                    setInfo({ ...info, values: newValues });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  rows={2}
                />
                <button
                  onClick={() => {
                    const newValues = info.values.filter((_, i) => i !== idx);
                    setInfo({ ...info, values: newValues });
                  }}
                  className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded-full"
                  aria-label="Remove value"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          <Save size={18} className="mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
