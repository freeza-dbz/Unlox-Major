import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

type CompanyInfo = {
  id: string;
  mission: string;
  vision: string;
  about_text: string;
  story: string;
  values: { title: string; description: string }[];
};

export default function AdminSettings() {
  const [info, setInfo] = useState<CompanyInfo | null>({
    id: '1',
    mission: 'To deliver exceptional digital solutions',
    vision: 'To be a leading provider of innovative technology services',
    about_text: 'We are a team of passionate developers and designers.',
    story: 'Our story...',
    values: [{ title: 'Innovation', description: 'We embrace new technologies' }]
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // fetchInfo();
  }, []);

  const fetchInfo = async () => {
    // Dummy
  };

  const handleSave = async () => {
    if (!info) return;
    setSaving(true);

    await supabase
      .from('company_info')
      .update({
        mission: info.mission,
        vision: info.vision,
        story: info.story,
        values: info.values,
      })
      .eq('id', info.id);

    setMessage('Settings saved successfully!');
    setTimeout(() => setMessage(''), 3000);
    setSaving(false);
  };

  if (loading) {
    return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>;
  }

  if (!info) {
    return <p className="text-gray-600">No settings found</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Settings</h2>

      {message && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          {message}
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
          <label className="block text-sm font-semibold text-gray-900 mb-4">
            Company Values
          </label>
          <div className="space-y-3">
            {info.values && info.values.map((value, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg">
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
