import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Briefcase,
  MessageSquareQuote,
  Sliders,
  Plus,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Globe,
  ExternalLink,
  ShieldCheck,
  Star,
  Bell,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { statsApi } from '../../api/stats';
import { projectsApi } from '../../api/projects';
import { DashboardStats, Project } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, projectsRes] = await Promise.allSettled([
          statsApi.get(),
          projectsApi.getAll(),
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value.success && statsRes.value.data) {
          setStats(statsRes.value.data);
        }
        if (projectsRes.status === 'fulfilled' && projectsRes.value.success && projectsRes.value.data) {
          setRecentProjects(projectsRes.value.data.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <AdminLayout
      title="Admin Dashboard"
      subtitle="Overview of your digital agency operations, CMS data and live website controls."
      action={
        <div className="flex items-center gap-2">
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--theme-primary)] text-white text-xs font-bold hover:opacity-90 shadow-sm"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add Project</span>
          </Link>
        </div>
      }
    >
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Projects Metric */}
        <div className="p-6 rounded-3xl bg-[var(--theme-surface)] border border-[var(--theme-border)] shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
              Total Projects
            </p>
            <h3 className="text-3xl font-black text-[var(--theme-text)] font-display mt-1">
              {stats?.totalProjects ?? 4}
            </h3>
            <p className="text-xs text-emerald-500 font-semibold mt-1 flex items-center gap-1">
              <span>{stats?.activeProjects ?? 4} active publicly</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--theme-surface-secondary)] text-[var(--theme-accent)] flex items-center justify-center border border-[var(--theme-border)]">
            <FolderKanban className="w-6 h-6" />
          </div>
        </div>

        {/* Services Metric */}
        <div className="p-6 rounded-3xl bg-[var(--theme-surface)] border border-[var(--theme-border)] shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
              Agency Services
            </p>
            <h3 className="text-3xl font-black text-[var(--theme-text)] font-display mt-1">
              {stats?.totalServices ?? 6}
            </h3>
            <p className="text-xs text-[var(--theme-accent)] font-semibold mt-1">
              {stats?.activeServices ?? 6} live on website
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--theme-surface-secondary)] text-[var(--theme-accent)] flex items-center justify-center border border-[var(--theme-border)]">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        {/* Testimonials Metric */}
        <div className="p-6 rounded-3xl bg-[var(--theme-surface)] border border-[var(--theme-border)] shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
              Client Reviews
            </p>
            <h3 className="text-3xl font-black text-[var(--theme-text)] font-display mt-1">
              {stats?.totalTestimonials ?? 6}
            </h3>
            <p className="text-xs text-[var(--theme-accent)] font-semibold mt-1">
              2 Marquee Rows active
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--theme-surface-secondary)] text-[var(--theme-accent)] flex items-center justify-center border border-[var(--theme-border)]">
            <MessageSquareQuote className="w-6 h-6" />
          </div>
        </div>

        {/* Active Sections Metric */}
        <div className="p-6 rounded-3xl bg-[var(--theme-surface)] border border-[var(--theme-border)] shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
              Live Sections
            </p>
            <h3 className="text-3xl font-black text-[var(--theme-text)] font-display mt-1">
              {stats?.activeSectionsCount ?? 10} / 11
            </h3>
            <p className="text-xs text-emerald-500 font-semibold mt-1">
              All major sections ON
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Sliders className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Pending Reviews Alert */}
      {stats && (stats.pendingReviews || 0) > 0 && (
        <Link
          to="/admin/reviews"
          className="flex items-center justify-between p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-8 hover:bg-amber-500/15 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-300">
                {stats.pendingReviews} new review{stats.pendingReviews !== 1 ? 's' : ''} awaiting approval
              </p>
              <p className="text-xs text-amber-400/80">Click to review and moderate submissions</p>
            </div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      )}

      {/* Quick Action Hub */}
      <div className="mb-10 p-8 rounded-3xl bg-[var(--theme-surface)] border border-[var(--theme-border)] text-[var(--theme-text)] shadow-xl">
        <div className="max-w-3xl mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-accent)] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant CMS Control Hub</span>
          </div>
          <h3 className="text-2xl font-bold font-display text-[var(--theme-text)]">Fast Management Shortcuts</h3>
          <p className="text-sm text-[var(--theme-text-secondary)] mt-1">
            Instantly create projects, configure services, update headlines, or toggle section visibility.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/admin/projects"
            className="p-4 rounded-2xl bg-[var(--theme-surface-secondary)] hover:border-[var(--theme-accent)] border border-[var(--theme-border)] flex flex-col items-center text-center transition-all group"
          >
            <FolderKanban className="w-6 h-6 text-[var(--theme-accent)] mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-[var(--theme-text)]">Add Project</span>
          </Link>

          <Link
            to="/admin/services"
            className="p-4 rounded-2xl bg-[var(--theme-surface-secondary)] hover:border-[var(--theme-accent)] border border-[var(--theme-border)] flex flex-col items-center text-center transition-all group"
          >
            <Briefcase className="w-6 h-6 text-[var(--theme-accent)] mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-[var(--theme-text)]">Edit Services</span>
          </Link>

          <Link
            to="/admin/sections"
            className="p-4 rounded-2xl bg-[var(--theme-surface-secondary)] hover:border-[var(--theme-accent)] border border-[var(--theme-border)] flex flex-col items-center text-center transition-all group"
          >
            <Sliders className="w-6 h-6 text-[var(--theme-accent)] mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-[var(--theme-text)]">Sections ON/OFF</span>
          </Link>

          <Link
            to="/admin/appearance"
            className="p-4 rounded-2xl bg-[var(--theme-surface-secondary)] hover:border-[var(--theme-accent)] border border-[var(--theme-border)] flex flex-col items-center text-center transition-all group"
          >
            <Globe className="w-6 h-6 text-[var(--theme-accent)] mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-[var(--theme-text)]">Appearance &amp; Theme</span>
          </Link>
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="bg-[var(--theme-surface)] rounded-3xl border border-[var(--theme-border)] shadow-card overflow-hidden">
        <div className="p-6 border-b border-[var(--theme-border)] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[var(--theme-text)] font-display">Recent Projects</h3>
            <p className="text-xs text-[var(--theme-text-secondary)]">Latest work items configured in your agency database.</p>
          </div>
          <Link
            to="/admin/projects"
            className="text-xs font-bold text-[var(--theme-accent)] hover:underline flex items-center gap-1"
          >
            <span>Manage All Projects</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--theme-surface-secondary)] text-[var(--theme-text-secondary)] text-xs uppercase font-bold border-b border-[var(--theme-border)]">
              <tr>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--theme-border)]">
              {recentProjects.map((p) => (
                <tr key={p._id} className="hover:bg-[var(--theme-surface-secondary)] transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="w-10 h-10 rounded-xl object-cover border border-[var(--theme-border)]"
                    />
                    <div>
                      <span className="font-bold text-[var(--theme-text)] block">{p.title}</span>
                      <span className="text-xs text-[var(--theme-text-secondary)]">{p.slug}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-[var(--theme-text)]">{p.client}</td>
                  <td className="px-6 py-4 text-[var(--theme-text-secondary)]">{p.category}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        p.active !== false
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                          : 'bg-[var(--theme-surface-secondary)] text-[var(--theme-text-secondary)]'
                      }`}
                    >
                      {p.active !== false ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to="/admin/projects"
                      className="text-xs font-bold text-[var(--theme-text)] hover:text-[var(--theme-accent)] px-3 py-1.5 rounded-lg bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] hover:border-[var(--theme-accent)] transition-colors"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
