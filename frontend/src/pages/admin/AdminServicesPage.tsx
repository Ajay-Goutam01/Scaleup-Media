import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  X,
  Briefcase,
  Video,
  Sparkles,
  Palette,
  Target,
  Share2,
  Globe,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { servicesApi } from '../../api/services';
import { Service } from '../../types';

const iconOptions = ['Video', 'Sparkles', 'Palette', 'Target', 'Share2', 'Globe'];

export const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Service>>({
    serviceNumber: '01',
    title: '',
    tagline: '',
    description: '',
    tags: [],
    icon: 'Sparkles',
    active: true,
    order: 0,
  });
  const [tagsInput, setTagsInput] = useState('');

  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await servicesApi.getAll();
      if (res.success && res.data) {
        setServices(res.data);
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenCreateModal = () => {
    setEditingService(null);
    const nextNum = String(services.length + 1).padStart(2, '0');
    setFormData({
      serviceNumber: nextNum,
      title: '',
      tagline: '',
      description: '',
      tags: [],
      icon: 'Sparkles',
      active: true,
      order: services.length + 1,
    });
    setTagsInput('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      serviceNumber: service.serviceNumber,
      title: service.title,
      tagline: service.tagline,
      description: service.description,
      tags: service.tags || [],
      icon: service.icon || 'Sparkles',
      active: service.active !== false,
      order: service.order || 0,
    });
    setTagsInput((service.tags || []).join(', '));
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.serviceNumber || !formData.title || !formData.tagline || !formData.description) {
      alert('Please fill in service number, title, tagline and description.');
      return;
    }

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      tags: parsedTags,
    };

    try {
      if (editingService) {
        await servicesApi.update(editingService._id, payload);
        showToast(`Service "${formData.title}" updated.`);
      } else {
        await servicesApi.create(payload);
        showToast(`Service "${formData.title}" created.`);
      }
      setModalOpen(false);
      loadServices();
    } catch (err: any) {
      alert('Failed to save service: ' + err.message);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete service "${title}"?`)) return;
    try {
      await servicesApi.delete(id);
      showToast(`Service "${title}" removed.`);
      loadServices();
    } catch (err: any) {
      alert('Failed to delete service: ' + err.message);
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      const updated = !service.active;
      await servicesApi.update(service._id, { active: updated });
      showToast(`Service "${service.title}" is now ${updated ? 'Active' : 'Disabled'}.`);
      loadServices();
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  return (
    <AdminLayout
      title="Services CMS"
      subtitle="Manage your 6 core agency offerings, taglines, tags, icons, and 3D stack presentation order."
      action={
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--theme-primary)] text-white text-xs font-bold hover:opacity-90 shadow-sm"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add New Service</span>
        </button>
      }
    >
      {toastMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-sm font-bold flex items-center gap-3 animate-in fade-in shadow-md">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Services Table */}
      <div className="bg-[var(--theme-surface)] rounded-3xl border border-[var(--theme-border)] shadow-card overflow-hidden">
        <div className="p-6 border-b border-[var(--theme-border)] flex items-center justify-between">
          <h3 className="text-lg font-bold text-[var(--theme-text)] font-display">All Agency Services ({services.length})</h3>
          <span className="text-xs text-[var(--theme-text-secondary)] font-medium">Rendered directly inside the GSAP 3D stacked card section</span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-[var(--theme-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[var(--theme-text-secondary)] mt-3">Loading services from database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--theme-surface-secondary)] text-[var(--theme-text-secondary)] text-xs uppercase font-bold border-b border-[var(--theme-border)]">
                <tr>
                  <th className="px-6 py-4">Number</th>
                  <th className="px-6 py-4">Service &amp; Tagline</th>
                  <th className="px-6 py-4">Pill Tags</th>
                  <th className="px-6 py-4 text-center">Icon</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--theme-border)]">
                {services.map((s) => (
                  <tr key={s._id} className="hover:bg-[#F7F9FC]/60 transition-colors">
                    <td className="px-6 py-4 font-black text-accent text-base">
                      {s.serviceNumber}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-primary text-base block">{s.title}</span>
                      <span className="text-xs font-semibold text-brandBlue">“{s.tagline}”</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(s.tags || []).map((t, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0F4F8] text-primary"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-[#F0F4F8] text-primary">
                        {s.icon}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleActive(s)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          s.active !== false
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {s.active !== false ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Disabled</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(s)}
                          className="p-2 rounded-xl bg-[#F0F4F8] hover:bg-brandBlue hover:text-white text-primary transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s._id, s.title)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#07111F]/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#DCE3EA] p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#DCE3EA] mb-6">
              <h3 className="text-xl font-black text-primary font-display">
                {editingService ? `Edit Service: ${editingService.title}` : 'Add New Service'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl bg-[#F0F4F8] text-secondary hover:text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                    Service Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.serviceNumber}
                    onChange={(e) => setFormData({ ...formData, serviceNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium"
                    placeholder="01"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium"
                    placeholder="Creative Reel / Ad"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                  Catchy Tagline *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium"
                  placeholder="Turn attention into action."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium"
                  placeholder="High-impact reels and video advertisements designed to make your brand stand out..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium"
                  placeholder="Promotional Reels, Short-form Ads, Product Videos"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                    Icon Name
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium"
                  >
                    {iconOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.order || 0}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#DCE3EA] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#F0F4F8] text-secondary text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#07111F] text-white text-xs font-bold hover:bg-primary-hover shadow-md"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
