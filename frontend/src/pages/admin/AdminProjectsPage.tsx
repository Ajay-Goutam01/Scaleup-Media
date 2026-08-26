import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  ExternalLink,
  Upload,
  CheckCircle,
  AlertCircle,
  X,
  Image as ImageIcon,
  TrendingUp,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { projectsApi } from '../../api/projects';
import { uploadApi } from '../../api/upload';
import { Project } from '../../types';

export const AdminProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [uploadingImage, setUploadingingImage] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    client: '',
    category: 'Creative Ads & Meta Campaigns',
    shortDescription: '',
    description: '',
    thumbnail: '',
    gallery: [],
    videoUrl: '',
    externalUrl: '',
    results: '',
    featured: false,
    active: true,
    order: 0,
  });

  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await projectsApi.getAll();
      if (res.success && res.data) {
        setProjects(res.data);
      }
    } catch (err: any) {
      setErrorMessage('Failed to load projects from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      client: '',
      category: 'Creative Ads & Meta Campaigns',
      shortDescription: '',
      description: '',
      thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
      gallery: [],
      videoUrl: '',
      externalUrl: '',
      results: '',
      featured: false,
      active: true,
      order: projects.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      client: project.client,
      category: project.category,
      shortDescription: project.shortDescription || '',
      description: project.description,
      thumbnail: project.thumbnail,
      gallery: project.gallery || [],
      videoUrl: project.videoUrl || '',
      externalUrl: project.externalUrl || '',
      results: project.results || '',
      featured: Boolean(project.featured),
      active: project.active !== false,
      order: project.order || 0,
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingingImage(true);
      const res = await uploadApi.uploadImage(file);
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, thumbnail: res.url }));
        showToast('Image uploaded successfully!');
      }
    } catch (err: any) {
      alert('Image upload failed: ' + err.message);
    } finally {
      setUploadingingImage(false);
    }
  };

  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      gallery: [...(prev.gallery || []), newGalleryUrl.trim()],
    }));
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.client || !formData.description || !formData.thumbnail) {
      alert('Please fill in title, client, description, and thumbnail.');
      return;
    }

    try {
      if (editingProject) {
        await projectsApi.update(editingProject._id, formData);
        showToast(`Project "${formData.title}" updated successfully!`);
      } else {
        await projectsApi.create(formData);
        showToast(`Project "${formData.title}" created successfully!`);
      }
      setModalOpen(false);
      loadProjects();
    } catch (err: any) {
      alert('Failed to save project: ' + err.message);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the project "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      await projectsApi.delete(id);
      showToast(`Project "${title}" deleted.`);
      loadProjects();
    } catch (err: any) {
      alert('Failed to delete project: ' + err.message);
    }
  };

  const handleToggleActive = async (project: Project) => {
    try {
      const updated = !project.active;
      await projectsApi.update(project._id, { active: updated });
      showToast(`Project "${project.title}" is now ${updated ? 'Active (Live)' : 'Draft (Hidden)'}.`);
      loadProjects();
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      const updated = !project.featured;
      await projectsApi.update(project._id, { featured: updated });
      showToast(`Project "${project.title}" ${updated ? 'marked as Featured' : 'unfeatured'}.`);
      loadProjects();
    } catch (err: any) {
      alert('Failed to update featured flag: ' + err.message);
    }
  };

  return (
    <AdminLayout
      title="Projects & Work CMS"
      subtitle="Manage portfolio case studies, thumbnails, metrics, and video assets displayed on the public site."
      action={
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--theme-primary)] text-white text-xs font-bold hover:opacity-90 shadow-sm"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add New Project</span>
        </button>
      }
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-sm font-bold flex items-center gap-3 animate-in fade-in shadow-md">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Projects Table */}
      <div className="bg-[var(--theme-surface)] rounded-3xl border border-[var(--theme-border)] shadow-card overflow-hidden">
        <div className="p-6 border-b border-[var(--theme-border)] flex items-center justify-between">
          <h3 className="text-lg font-bold text-[var(--theme-text)] font-display">All Agency Projects ({projects.length})</h3>
          <span className="text-xs text-[var(--theme-text-secondary)] font-medium">Reordering and visibility changes apply in real-time</span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-[var(--theme-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[var(--theme-text-secondary)] mt-3">Loading projects from database...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center text-[var(--theme-text-secondary)]">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 text-[var(--theme-text-secondary)]/50" />
            <p className="text-base font-bold text-[var(--theme-text)]">No projects configured</p>
            <p className="text-xs mt-1">Click "Add New Project" above to create your first case study.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--theme-surface-secondary)] text-[var(--theme-text-secondary)] text-xs uppercase font-bold border-b border-[var(--theme-border)]">
                <tr>
                  <th className="px-6 py-4">Thumbnail</th>
                  <th className="px-6 py-4">Project / Client</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Results Metric</th>
                  <th className="px-6 py-4 text-center">Featured</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE3EA]/60">
                {projects.map((p) => (
                  <tr key={p._id} className="hover:bg-[#F7F9FC]/60 transition-colors">
                    <td className="px-6 py-4">
                      <img
                        src={p.thumbnail}
                        alt={p.title}
                        className="w-14 h-14 rounded-2xl object-cover border border-[#DCE3EA] shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-primary text-base block">{p.title}</span>
                      <span className="text-xs font-semibold text-secondary">{p.client}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F0F4F8] text-primary border border-[#DCE3EA]">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {p.results ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                          {p.results}
                        </span>
                      ) : (
                        <span className="text-xs text-secondary/60">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(p)}
                        className={`p-2 rounded-xl transition-colors ${
                          p.featured
                            ? 'bg-amber-50 text-amber-500 hover:bg-amber-100'
                            : 'text-secondary/40 hover:text-amber-500'
                        }`}
                        title={p.featured ? 'Featured on Home' : 'Not Featured'}
                      >
                        <Star className={`w-5 h-5 ${p.featured ? 'fill-amber-400' : ''}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleActive(p)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          p.active !== false
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {p.active !== false ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-2 rounded-xl bg-[#F0F4F8] hover:bg-brandBlue hover:text-white text-primary transition-colors"
                          title="Edit Project"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id, p.title)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors"
                          title="Delete Project"
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

      {/* Add / Edit Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#07111F]/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#DCE3EA] p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#DCE3EA] mb-6">
              <h3 className="text-xl font-black text-primary font-display">
                {editingProject ? `Edit Project: ${editingProject.title}` : 'Create New Project'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl bg-[#F0F4F8] text-secondary hover:text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium focus:bg-white"
                    placeholder="e.g. LuxeAura E-Commerce Scaling"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium focus:bg-white"
                    placeholder="e.g. LuxeAura Skincare"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium focus:bg-white"
                    placeholder="e.g. Creative Ads & Meta Campaigns"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                    Results Metric Banner
                  </label>
                  <input
                    type="text"
                    value={formData.results || ''}
                    onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium focus:bg-white"
                    placeholder="e.g. +380% Revenue | 4.8x Meta ROAS"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                  Short Description
                </label>
                <input
                  type="text"
                  value={formData.shortDescription || ''}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium focus:bg-white"
                  placeholder="1-2 sentences summarizing the case study"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                  Full Project Story / Strategy *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium focus:bg-white"
                  placeholder="Detailed breakdown of the strategy, creatives and impact..."
                />
              </div>

              {/* Thumbnail Image URL & File Upload */}
              <div>
                <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                  Thumbnail Image (URL or Upload) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium focus:bg-white"
                    placeholder="https://..."
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-[#07111F] text-white text-xs font-bold cursor-pointer hover:bg-primary-hover flex items-center gap-1.5 shrink-0">
                    <Upload className="w-4 h-4 text-accent" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {formData.thumbnail && (
                  <div className="mt-2 w-28 h-20 rounded-xl overflow-hidden border border-[#DCE3EA]">
                    <img
                      src={formData.thumbnail}
                      alt="Thumbnail Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Gallery List */}
              <div>
                <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                  Visual Gallery Images (Optional)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-xs"
                    placeholder="Add gallery image URL (https://...)"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryUrl}
                    className="px-4 py-2 rounded-xl bg-[#F0F4F8] text-primary text-xs font-bold hover:bg-[#DCE3EA]"
                  >
                    + Add
                  </button>
                </div>

                {formData.gallery && formData.gallery.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.gallery.map((url, i) => (
                      <div
                        key={i}
                        className="relative group w-20 h-16 rounded-xl overflow-hidden border border-[#DCE3EA]"
                      >
                        <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryUrl(i)}
                          className="absolute inset-0 bg-rose-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                    External Project URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.externalUrl || ''}
                    onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium"
                    placeholder="https://clientbrand.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                    Sort Order (Number)
                  </label>
                  <input
                    type="number"
                    value={formData.order || 0}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-primary">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-accent"
                  />
                  <span>Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-primary">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded text-accent"
                  />
                  <span>Active (Visible publicly)</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-[#DCE3EA] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#F0F4F8] text-secondary hover:text-primary text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#07111F] text-white text-xs font-bold hover:bg-primary-hover shadow-md"
                >
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
