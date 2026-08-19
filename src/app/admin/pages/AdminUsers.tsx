import React, { useEffect, useState } from 'react';
import { Users, Shield, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { User, UserRole } from '../../../types';

export const AdminUsers: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdatingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      alert('Error updating user role');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
          User & Role Governance
        </h1>
        <p className="text-xs sm:text-sm text-apple-secondary mt-1">
          Assign and govern access permissions: USER, FOUNDER, ADMIN, SUPER_ADMIN.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-apple-blue animate-spin mx-auto" />
          <p className="text-xs text-apple-secondary">Loading platform users...</p>
        </div>
      ) : (
        <div className="bg-[#1c1c1e] border border-white/10 rounded-3xl overflow-hidden shadow-apple-modal">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-black/30 border-b border-white/10 text-[10px] font-bold text-apple-secondary uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-5">User Name</th>
                  <th className="py-4 px-4">Email</th>
                  <th className="py-4 px-4">Managed Entity</th>
                  <th className="py-4 px-4">Role Badge</th>
                  <th className="py-4 px-5 text-right">Access Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-4 px-5 font-bold text-white">
                      {u.name}
                    </td>
                    <td className="py-4 px-4 text-apple-secondary">
                      {u.email}
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {u.companyName || '—'}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'ADMIN' || u.role === 'SUPER_ADMIN'
                          ? 'bg-apple-amber/20 text-apple-amber border border-apple-amber/30'
                          : u.role === 'FOUNDER'
                          ? 'bg-apple-blue/20 text-apple-blue border border-apple-blue/30'
                          : 'bg-white/5 text-apple-secondary border border-white/10'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <select
                        value={u.role}
                        disabled={updatingId === u.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className="bg-black/50 border border-white/15 text-white text-xs rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-apple-blue font-medium cursor-pointer"
                      >
                        <option value="USER">USER</option>
                        <option value="FOUNDER">FOUNDER</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
