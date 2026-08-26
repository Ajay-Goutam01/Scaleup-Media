import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  CheckCircle,
  X,
  Upload,
  MessageSquareQuote,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { testimonialsApi } from '../../api/testimonials';
import { uploadApi } from '../../api/upload';
import { Testimonial } from '../../types';

export const AdminTestimonialsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Testimonial>>({
    clientName: '',
    company: '',
    review: '',
    profileImage: '',
    rating: 5,
    marqueeRow: 1,
    active: true,
    order: 0,
  });

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const res = await testimonialsApi.getAll();
      if (res.success && res.data) {
        setTestimonials(res.data);
      }
    } catch (err) {
      console.error('Failed to load testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenCreateModal = () => {
    setEditingTestimonial(null);
    setFormData({
      clientName: '',
      company: '',
      review: '',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
      rating: 5,
      marqueeRow: 1,
      active: true,
      order: testimonials.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (t: Testimonial) => {
    setEditingTestimonial(t);
    setFormData({
      clientName: t.clientName,
      company: t.company,
      review: t.review,
      profileImage: t.profileImage,
      rating: t.rating || 5,
      marqueeRow: t.marqueeRow || 1,
      active: t.active !== false,
      order: t.order || 0,
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const res = await uploadApi.uploadImage(file);
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, profileImage: res.url }));
        showToast('Client photo uploaded successfully!');
      }
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.company || !formData.review) {
      alert('Please fill in client name, company, and review.');
      return;
    }

    try {
      if (editingTestimonial) {
        await testimonialsApi.update(editingTestimonial._id, formData);
        showToast(`Review from ${formData.clientName} updated.`);
      } else {
        await testimonialsApi.create(formData);
        showToast(`Review from ${formData.clientName} created.`);
      }
      setModalOpen(false);
      loadTestimonials();
    } catch (err: any) {
      alert('Failed to save review: ' + err.message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete review from "${name}"?`)) return;
    try {
      await testimonialsApi.delete(id);
      showToast(`Review deleted.`);
      loadTestimonials();
    } catch (err: any) {
      alert('Failed to delete review: ' + err.message);
    }
  };

  const handleToggleActive = async (t: Testimonial) => {
    try {
      const updated = !t.active;
      await testimonialsApi.update(t._id, { active: updated });
      showToast(`Review status updated.`);
      loadTestimonials();
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  return (
    <AdminLayout
      title="Testimonials CMS"
      subtitle="Manage client testimonials, avatar photos, 5-star ratings, and continuous marquee row assignments."
      action={
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#07111F] text-white text-xs font-bold hover:bg-primary-hover shadow-sm"
        >
          <Plus className="w-4 h-4 text-accent" />
          <span>Add Client Review</span>
        </button>
      }
    >
      {toastMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-bold flex items-center gap-3 animate-in fade-in shadow-md">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Testimonials Table */}
      <div className="bg-white rounded-3xl border border-[#DCE3EA] shadow-card overflow-hidden">
        <div className="p-6 border-b border-[#DCE3EA] flex items-center justify-between">
          <h3 className="text-lg font-bold text-primary font-display">Client Testimonials ({testimonials.length})</h3>
          <span className="text-xs text-secondary font-medium">Split between Row 1 (Right→Left) &amp; Row 2 (Left→Right)</span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-secondary mt-3">Loading testimonials from database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F7F9FC] text-secondary text-xs uppercase font-bold border-b border-[#DCE3EA]">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Review Excerpt</th>
                  <th className="px-6 py-4 text-center">Rating</th>
                  <th className="px-6 py-4 text-center">Marquee Row</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE3EA]/60">
                {testimonials.map((t) => (
                  <tr key={t._id} className="hover:bg-[#F7F9FC]/60 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={t.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop'}
                        alt={t.clientName}
                        className="w-10 h-10 rounded-full object-cover border border-[#DCE3EA]"
                      />
                      <div>
                        <span className="font-bold text-primary block">{t.clientName}</span>
                        <span className="text-xs text-secondary">{t.company}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-sm">
                      <p className="text-xs text-secondary line-clamp-2 italic">“{t.review}”</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-0.5 text-amber-400">
                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F0F4F8] text-primary">
                        Row {t.marqueeRow === 2 ? '2 (L→R)' : '1 (R→L)'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleActive(t)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          t.active !== false
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {t.active !== false ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(t)}
                          className="p-2 rounded-xl bg-[#F0F4F8] hover:bg-brandBlue hover:text-white text-primary transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(t._id, t.clientName)}
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
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#DCE3EA] p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#DCE3EA] mb-6">
              <h3 className="text-xl font-black text-primary font-display">
                {editingTestimonial ? `Edit Review: ${editingTestimonial.clientName}` : 'Add Client Review'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl bg-[#F0F4F8] text-secondary hover:text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium"
                    placeholder="e.g. Aarav Sharma"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                    Company / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium"
                    placeholder="Founder, LuxeAura"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                  Review Text *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium"
                  placeholder="ScaleUp Media transformed our digital presence..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                  Client Avatar Image (URL or Upload)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.profileImage || ''}
                    onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium"
                    placeholder="https://..."
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-[#07111F] text-white text-xs font-bold cursor-pointer hover:bg-primary-hover flex items-center gap-1.5 shrink-0">
                    <Upload className="w-4 h-4 text-accent" />
                    <span>{uploadingImage ? '...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                    Star Rating (1 - 5)
                  </label>
                  <select
                    value={formData.rating || 5}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                    Marquee Row Position
                  </label>
                  <select
                    value={formData.marqueeRow || 1}
                    onChange={(e) => setFormData({ ...formData, marqueeRow: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium"
                  >
                    <option value={1}>Row 1 (Moves Right to Left)</option>
                    <option value={2}>Row 2 (Moves Left to Right)</option>
                  </select>
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
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
