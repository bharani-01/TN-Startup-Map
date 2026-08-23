import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Search, Trash2, ShieldCheck, Loader2, ExternalLink, RefreshCw, Archive, RotateCcw, Activity } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Startup } from '../../../types';

export const AdminStartups: React.FC = () => {
  const { token } = useAuth();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [archivedStartups, setArchivedStartups] = useState<Startup[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  const fetchStartups = async () => {
    try {
      setLoading(true);
      const [activeRes, archivedRes] = await Promise.all([
        fetch('/api/startups?limit=5000'),
        fetch('/api/startups?includeDeleted=true&limit=5000'),
      ]);
      const activeData = await activeRes.json();
      const archivedData = await archivedRes.json();
      
      if (activeData.success) {
        setStartups(activeData.data);
      }
      if (archivedData.success) {
        setArchivedStartups(archivedData.data);
      }
    } catch (err) {
      console.error('Error fetching admin startups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartups();
  }, []);

  const handleSoftDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to soft-delete '${name}'? It will be hidden from the public directory but can be restored anytime.`)) return;

    try {
      const res = await fetch(`/api/startups/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchStartups();
      }
    } catch (err) {
      alert('Error soft-deleting startup');
    }
  };

  const handleRestore = async (id: string, name: string) => {
    if (!confirm(`Restore '${name}' back to the active directory and spatial map?`)) return;

    try {
      const res = await fetch(`/api/startups/${id}/restore`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchStartups();
      }
    } catch (err) {
      alert('Error restoring startup');
    }
  };

  const currentList = activeTab === 'active' ? startups : archivedStartups;

  const filtered = currentList.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.district.toLowerCase().includes(search.toLowerCase()) ||
      s.sectors.some((sec) => sec.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
            Startup Entity Database
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage live verified companies and inspect non-destructive soft-deleted records.
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search startup, district, or sector..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:bg-white/10 focus:border-[#0071E3] transition-colors outline-none"
          />
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'active'
              ? 'bg-[#0071E3] text-white font-bold'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          Active Ventures ({startups.length})
        </button>

        <button
          onClick={() => setActiveTab('archived')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'archived'
              ? 'bg-rose-600 text-white font-bold'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Archive className="w-3.5 h-3.5" />
          <span>Soft-Deleted / Archived ({archivedStartups.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading startup directory database...</p>
        </div>
      ) : (
        <div className="bg-[#1c1c1e] border border-white/10 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-black/30 border-b border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Startup</th>
                  <th className="py-3.5 px-4">District</th>
                  <th className="py-3.5 px-4">Sectors</th>
                  <th className="py-3.5 px-4">Stage</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                      No startup records found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((startup) => (
                    <tr key={startup.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-white/10 text-white font-bold flex items-center justify-center text-xs shrink-0">
                            {startup.name.charAt(0)}
                          </div>
                          <div>
                            <Link
                              to={`/admin/startups/${startup.id}`}
                              className="font-bold text-white hover:text-[#0071E3] transition-colors block"
                            >
                              {startup.name}
                            </Link>
                            <span className="text-[11px] text-slate-400 truncate max-w-xs block">{startup.tagline}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-white">
                        {startup.district}
                      </td>
                      <td className="py-4 px-4 text-[#0071E3] font-medium">
                        {startup.sectors.join(', ')}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/5 text-slate-300 border border-white/10">
                          {startup.stage}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {activeTab === 'archived' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                            <span>SOFT_DELETED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            <span>{startup.verificationStatus}</span>
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/admin/startups/${startup.id}`}
                            className="p-1.5 text-[#0071E3] hover:text-white hover:bg-[#0071E3]/20 rounded-lg transition-colors cursor-pointer"
                            title="Open Dossier & Analytics"
                          >
                            <Activity className="w-4 h-4" />
                          </Link>

                          <a
                            href={`/startups/${startup.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            title="View Public Profile"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          {activeTab === 'active' ? (
                            <button
                              onClick={() => handleSoftDelete(startup.id, startup.name)}
                              className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                              title="Soft Delete (Non-destructive Archive)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRestore(startup.id, startup.name)}
                              className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                              title="Restore to Active Directory"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
