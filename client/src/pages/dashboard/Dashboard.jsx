import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { STATUS_COLORS } from '../../utils/constants';
import toast from 'react-hot-toast';

const StatCard = ({ label, value, color }) => (
  <div className={`rounded-xl p-5 text-white ${color}`}>
    <p className="text-sm opacity-80">{label}</p>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/students/stats')
      .then((r) => setStats(r.data))
      .catch(() => toast.error('Failed to load stats'));
  }, []);

  if (!stats) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total" value={stats.total} color="bg-gray-700" />
        <StatCard label="Applied" value={stats.applied} color="bg-yellow-500" />
        <StatCard label="Verified" value={stats.verified} color="bg-blue-500" />
        <StatCard label="Admitted" value={stats.admitted} color="bg-green-500" />
        <StatCard label="Rejected" value={stats.rejected} color="bg-red-500" />
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Track-wise Students</h3>
        <div className="space-y-3">
          {stats.trackWise.map((t) => (
            <div key={t._id} className="flex items-center gap-3">
              <span className="w-36 text-sm text-gray-600 truncate">{t._id}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-5">
                <div className="bg-primary h-5 rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${Math.max((t.count / stats.total) * 100, 5)}%` }}>
                  <span className="text-white text-xs font-medium">{t.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
