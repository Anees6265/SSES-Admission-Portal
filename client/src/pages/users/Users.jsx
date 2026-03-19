import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { TRACKS, ROLES } from '../../utils/constants';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';

const emptyForm = { name: '', email: '', password: '', role: 'track_incharge', track: '', isActive: true };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = () => api.get('/users').then(({ data }) => setUsers(data)).catch(() => toast.error('Failed to load users'));

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) await api.put(`/users/${editId}`, form);
      else await api.post('/users', form);
      toast.success(`User ${editId ? 'updated' : 'created'}`);
      setShowForm(false); setForm(emptyForm); setEditId(null);
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const handleEdit = (u) => {
    setForm({ name: u.name, email: u.email, password: '', role: u.role, track: u.track || '', isActive: u.isActive });
    setEditId(u._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await api.delete(`/users/${id}`); toast.success('User deleted'); fetchUsers(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Users</h2>
        <button onClick={() => { setShowForm(true); setForm(emptyForm); setEditId(null); }}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark text-sm">
          <FiPlus /> Add User
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h3 className="font-semibold mb-4">{editId ? 'Edit User' : 'Add New User'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[['Name', 'name', 'text'], ['Email', 'email', 'email'], ['Password', 'password', 'password']].map(([label, key, type]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}{key !== 'password' && <span className="text-red-500">*</span>}</label>
                <input type={type} value={form[key]} required={key !== 'password' || !editId}
                  placeholder={editId && key === 'password' ? 'Leave blank to keep current' : ''}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none">
                {ROLES.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
              </select>
            </div>
            {form.role === 'track_incharge' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Track</label>
                <select value={form.track} onChange={(e) => setForm({ ...form, track: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none">
                  <option value="">Select Track</option>
                  {TRACKS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            )}
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="isActive" checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={loading}
                className="bg-primary text-white px-5 py-2 rounded-lg text-sm hover:bg-primary-dark disabled:opacity-60">
                {loading ? 'Saving...' : editId ? 'Update' : 'Create User'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); }}
                className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Name', 'Email', 'Role', 'Track', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3 capitalize text-gray-600">{u.role.replace('_', ' ')}</td>
                <td className="px-4 py-3 text-gray-600">{u.track || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(u)} className="text-yellow-500 hover:text-yellow-700"><FiEdit2 /></button>
                    <button onClick={() => handleDelete(u._id)} className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
