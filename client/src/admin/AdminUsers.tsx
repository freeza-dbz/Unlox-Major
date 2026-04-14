﻿import { useEffect, useState } from 'react';
import { Plus, Trash2, CreditCard as Edit2, Check, X } from 'lucide-react';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1/users`;

interface AdminUser {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    isAdmin: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
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
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/getAllUsers`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const result = await response.json();
      if (result.success && result.data) {
        setUsers(result.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    setError('');
    setSuccess('');

    if (!formData.fullName || !formData.email || !formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/createUser`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          username: formData.username,
          password: formData.password,
          isAdmin: formData.isAdmin,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create user');
      }

      if (result.success) {
        setSuccess('User created successfully!');
        setFormData({ fullName: '', email: '', username: '', password: '', isAdmin: false });
        setShowForm(false);
        fetchUsers();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    }
  };

  const handleUpdateUser = async (id: string) => {
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/updateDetails/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          username: formData.username,
          isAdmin: formData.isAdmin,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update user');
      }

      if (result.success) {
        setSuccess('User updated successfully!');
        setEditing(null);
        fetchUsers();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to delete ${email}?`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to delete user');
      }

      setSuccess('User deleted successfully!');
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  if (loading) {
    return <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>;
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-900'>Admin Users</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
        >
          <Plus size={18} className='mr-2' />
          Add User
        </button>
      </div>

      {error && (
        <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800'>
          {error}
        </div>
      )}

      {success && (
        <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800'>
          {success}
        </div>
      )}

      {showForm && (
        <div className='mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200'>
          <h3 className='text-lg font-bold text-gray-900 mb-4'>Add New User</h3>
          <div className='space-y-4'>
            <input
              type='text'
              placeholder='Full Name'
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600'
            />
            <input
              type='text'
              placeholder='Username'
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600'
            />
            <input
              type='email'
              placeholder='Email Address'
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600'
            />
            <input
              type='password'
              placeholder='Password'
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600'
            />
            <label className='flex items-center space-x-2'>
              <input
                type='checkbox'
                checked={formData.isAdmin}
                onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                className='rounded border-gray-300 text-blue-600 focus:ring-blue-600'
              />
              <span className='text-sm text-gray-700'>Admin privileges</span>
            </label>
            <div className='flex space-x-2'>
              <button
                onClick={handleAddUser}
                className='flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
              >
                <Check size={18} className='mr-1' /> Create
              </button>
              <button
                onClick={() => setShowForm(false)}
                className='flex items-center px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500'
              >
                <X size={18} className='mr-1' /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead>
            <tr className='bg-gray-100 border-b border-gray-200'>
              <th className='px-6 py-3 text-left text-sm font-semibold text-gray-900'>Full Name</th>
              <th className='px-6 py-3 text-left text-sm font-semibold text-gray-900'>Username</th>
              <th className='px-6 py-3 text-left text-sm font-semibold text-gray-900'>Email</th>
              <th className='px-6 py-3 text-left text-sm font-semibold text-gray-900'>Role</th>
              <th className='px-6 py-3 text-left text-sm font-semibold text-gray-900'>Joined</th>
              <th className='px-6 py-3 text-right text-sm font-semibold text-gray-900'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className='border-b border-gray-200 hover:bg-gray-50'>
                {editing === user._id ? (
                  <>
                    <td className='px-6 py-4'>
                      <input
                        type='text'
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className='w-full px-2 py-1 border border-gray-300 rounded'
                      />
                    </td>
                    <td className='px-6 py-4'>
                      <input
                        type='text'
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className='w-full px-2 py-1 border border-gray-300 rounded'
                      />
                    </td>
                    <td className='px-6 py-4'>
                      <input
                        type='email'
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className='w-full px-2 py-1 border border-gray-300 rounded'
                      />
                    </td>
                    <td className='px-6 py-4'>
                      <label className='flex items-center space-x-2'>
                        <input
                          type='checkbox'
                          checked={formData.isAdmin}
                          onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                          className='rounded border-gray-300 text-blue-600 focus:ring-blue-600'
                        />
                        <span className='text-sm'>Admin</span>
                      </label>
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-600'>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4 text-right space-x-2'>
                      <button
                        onClick={() => handleUpdateUser(user._id)}
                        className='inline-flex items-center px-2 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200'
                      >
                        <Check size={16} className='mr-1' /> Save
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className='inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200'
                      >
                        <X size={16} className='mr-1' /> Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className='px-6 py-4 text-gray-900 font-medium'>{user.fullName}</td>
                    <td className='px-6 py-4 text-gray-700'>@{user.username}</td>
                    <td className='px-6 py-4 text-gray-700'>{user.email}</td>
                    <td className='px-6 py-4'>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isAdmin
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-600'>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4 text-right space-x-2'>
                      <button
                        onClick={() => {
                          setEditing(user._id);
                          setFormData({
                            fullName: user.fullName,
                            username: user.username,
                            email: user.email,
                            password: '',
                            isAdmin: user.isAdmin,
                          });
                        }}
                        className='inline-flex items-center px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200'
                      >
                        <Edit2 size={16} className='mr-1' /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id, user.email)}
                        className='inline-flex items-center px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200'
                      >
                        <Trash2 size={16} className='mr-1' /> Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className='text-center py-8 text-gray-600'>
          No users found. Create your first admin user to get started.
        </div>
      )}
    </div>
  );
}
