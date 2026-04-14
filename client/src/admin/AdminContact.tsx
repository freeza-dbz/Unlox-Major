import { useEffect, useState } from 'react';
import { Save, Mail, Phone, MapPin, Clock, Linkedin, Twitter, Facebook } from 'lucide-react';

type ContactInfo = {
  _id?: string;
  email?: string;
  phone?: string;
  address?: string;
  business_hours?: string;
  linkedin_url?: string;
  twitter_url?: string;
  facebook_url?: string;
};

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1/contact`;

export default function AdminContact() {
  const [info, setInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchInfo();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const fetchInfo = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch contact settings.');
      const result = await response.json();
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
      const response = await fetch(API_BASE_URL, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(info),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to save contact settings.');

      setSuccess('Contact settings saved successfully!');
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
    return <p className="text-gray-600">No contact settings found</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
      
      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{error}</div>}
      {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">{success}</div>}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
            <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="email" value={info.email || ''} onChange={(e) => setInfo({ ...info, email: e.target.value })} className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" /></div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Contact Number</label>
            <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="tel" value={info.phone || ''} onChange={(e) => setInfo({ ...info, phone: e.target.value })} className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" /></div>
          </div>
        </div>
        <div><label className="block text-sm font-semibold text-gray-900 mb-2">Office Address</label><div className="relative"><MapPin className="absolute left-3 top-4 text-gray-400" size={20} /><textarea value={info.address || ''} onChange={(e) => setInfo({ ...info, address: e.target.value })} className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" rows={3} /></div></div>
        <div><label className="block text-sm font-semibold text-gray-900 mb-2">Business Hours</label><div className="relative"><Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="text" value={info.business_hours || ''} onChange={(e) => setInfo({ ...info, business_hours: e.target.value })} className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" /></div></div>
        <div className="border-t pt-6">
          <label className="block text-sm font-semibold text-gray-900 mb-4">Social Media Links</label>
          <div className="space-y-4">
            <div className="relative"><Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="url" placeholder="LinkedIn URL" value={info.linkedin_url || ''} onChange={(e) => setInfo({ ...info, linkedin_url: e.target.value })} className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" /></div>
            <div className="relative"><Twitter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="url" placeholder="X (Twitter) URL" value={info.twitter_url || ''} onChange={(e) => setInfo({ ...info, twitter_url: e.target.value })} className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" /></div>
            <div className="relative"><Facebook className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="url" placeholder="Facebook URL" value={info.facebook_url || ''} onChange={(e) => setInfo({ ...info, facebook_url: e.target.value })} className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" /></div>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"><Save size={18} className="mr-2" />{saving ? 'Saving...' : 'Save Changes'}</button>
      </div>
    </div>
  );
}