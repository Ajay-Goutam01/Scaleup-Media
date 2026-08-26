import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { reviewsApi } from '../../api/reviews';
import { Review } from '../../types';
import {
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  Clock,
  User,
  Building2,
  RefreshCw,
  AlertCircle,
  Loader2,
  EyeOff,
} from 'lucide-react';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, { color: string; label: string }> = {
    pending:  { color: 'bg-amber-500/15 text-amber-400 border border-amber-500/20', label: 'Pending' },
    approved: { color: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20', label: 'Approved' },
    rejected: { color: 'bg-red-500/15 text-red-400 border border-red-500/20', label: 'Rejected' },
  };
  const { color, label } = map[status] || map.pending;
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${color}`}>{label}</span>;
};

const StarRating: React.FC<{ rating: number; small?: boolean }> = ({ rating, small }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`${small ? 'w-3 h-3' : 'w-4 h-4'} ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-[var(--theme-border)]'}`}
      />
    ))}
  </div>
);

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [marqueeRowMap, setMarqueeRowMap] = useState<Record<string, 1 | 2>>({});

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3500);
  };

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reviewsApi.getAdmin(filter === 'all' ? undefined : filter);
      if (res.success && res.data) {
        setReviews(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleApprove = async (id: string) => {
    setActionLoading(id + '_approve');
    try {
      const row = marqueeRowMap[id] || 1;
      const res = await reviewsApi.approve(id, row);
      if (res.success) {
        showMessage('success', 'Review approved and published to public site!');
        fetchReviews();
      }
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to approve');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id + '_reject');
    try {
      await reviewsApi.reject(id);
      showMessage('success', 'Review rejected.');
      fetchReviews();
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to reject');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnpublish = async (id: string) => {
    setActionLoading(id + '_unpublish');
    try {
      await reviewsApi.unpublish(id);
      showMessage('success', 'Review unpublished.');
      fetchReviews();
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to unpublish');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Permanently delete this review? This cannot be undone.')) return;
    setActionLoading(id + '_delete');
    try {
      await reviewsApi.delete(id);
      showMessage('success', 'Review deleted.');
      fetchReviews();
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to delete');
    } finally {
      setActionLoading(null);
    }
  };

  const counts = {
    all: reviews.length,
    pending: reviews.filter((r) => r.status === 'pending').length,
    approved: reviews.filter((r) => r.status === 'approved').length,
    rejected: reviews.filter((r) => r.status === 'rejected').length,
  };

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <AdminLayout
      title="Reviews Queue"
      subtitle="Moderate public review submissions before they appear on your website"
      action={
        <button
          onClick={fetchReviews}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--theme-surface-secondary)] text-[var(--theme-text)] text-sm font-semibold hover:border-[var(--theme-accent)] border border-[var(--theme-border)] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      }
    >
      {/* Toast */}
      {message && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold ${
            message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: 'all', label: 'All', count: counts.all },
          { id: 'pending', label: 'Pending', count: counts.pending, color: 'text-amber-400' },
          { id: 'approved', label: 'Approved', count: counts.approved, color: 'text-emerald-400' },
          { id: 'rejected', label: 'Rejected', count: counts.rejected, color: 'text-red-400' },
        ].map(({ id, label, count, color }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              filter === id
                ? 'bg-[var(--theme-primary)] text-white shadow-sm'
                : 'bg-[var(--theme-surface)] border border-[var(--theme-border)] text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)]'
            }`}
          >
            {label}
            <span
              className={`text-xs font-black px-1.5 py-0.5 rounded-full ${
                filter === id ? 'bg-white/20 text-white' : `bg-[var(--theme-surface-secondary)] ${color || 'text-[var(--theme-text)]'}`
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--theme-primary)]" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-[var(--theme-surface)] rounded-3xl border border-[var(--theme-border)] p-8">
          <Star className="w-12 h-12 text-[var(--theme-text-secondary)]/40 mb-4" />
          <h3 className="text-lg font-bold text-[var(--theme-text)] mb-2">
            No {filter !== 'all' ? filter : ''} reviews
          </h3>
          <p className="text-sm text-[var(--theme-text-secondary)]">
            {filter === 'pending' ? 'New submissions will appear here for moderation.' : 'No reviews in this category.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const isActing = actionLoading?.startsWith(review._id);
            return (
              <div
                key={review._id}
                className="bg-[var(--theme-surface)] rounded-3xl border border-[var(--theme-border)] p-6 transition-shadow hover:shadow-md text-[var(--theme-text)]"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Avatar */}
                  <div className="shrink-0">
                    {review.profileImageUrl ? (
                      <img
                        src={review.profileImageUrl}
                        alt={review.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-[var(--theme-border)]"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] flex items-center justify-center text-[var(--theme-text)] font-bold text-lg">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-[var(--theme-text-secondary)]" />
                        <span className="text-sm font-bold text-[var(--theme-text)]">{review.name}</span>
                      </div>
                      {review.company && (
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-[var(--theme-text-secondary)]" />
                          <span className="text-xs text-[var(--theme-text-secondary)] font-medium">{review.company}</span>
                        </div>
                      )}
                      <StatusBadge status={review.status} />
                      <span className="text-xs text-[var(--theme-text-secondary)] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    <StarRating rating={review.rating} small />

                    <p className="text-sm text-[var(--theme-text)] leading-relaxed mt-2 line-clamp-3">
                      "{review.review}"
                    </p>

                    {review.email && (
                      <p className="text-xs text-[var(--theme-text-secondary)] mt-1">{review.email}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-[var(--theme-border)] flex flex-wrap items-center gap-2">
                  {/* Marquee Row selector when approving */}
                  {review.status === 'pending' && (
                    <div className="flex items-center gap-2 mr-2">
                      <span className="text-xs text-[var(--theme-text-secondary)] font-medium">Marquee Row:</span>
                      <select
                        value={marqueeRowMap[review._id] || 1}
                        onChange={(e) =>
                          setMarqueeRowMap((prev) => ({
                            ...prev,
                            [review._id]: Number(e.target.value) as 1 | 2,
                          }))
                        }
                        className="text-xs font-semibold px-2 py-1 rounded-lg border border-[var(--theme-border)] text-[var(--theme-text)] bg-[var(--theme-surface-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
                      >
                        <option value={1}>Row 1 (→ Left)</option>
                        <option value={2}>Row 2 (← Right)</option>
                      </select>
                    </div>
                  )}

                  {review.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(review._id)}
                        disabled={!!isActing}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors disabled:opacity-60"
                      >
                        {isActing && actionLoading === review._id + '_approve' ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <CheckCircle className="w-3.5 h-3.5" />
                        )}
                        Approve & Publish
                      </button>
                      <button
                        onClick={() => handleReject(review._id)}
                        disabled={!!isActing}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold hover:bg-red-500/20 transition-colors disabled:opacity-60"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </>
                  )}

                  {review.status === 'approved' && (
                    <button
                      onClick={() => handleUnpublish(review._id)}
                      disabled={!!isActing}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--theme-surface-secondary)] text-[var(--theme-text-secondary)] border border-[var(--theme-border)] text-xs font-bold hover:text-[var(--theme-text)] transition-colors disabled:opacity-60"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      Unpublish
                    </button>
                  )}

                  {review.status === 'rejected' && (
                    <button
                      onClick={() => handleApprove(review._id)}
                      disabled={!!isActing}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold hover:bg-emerald-500/20 transition-colors disabled:opacity-60"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Re-Approve
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(review._id)}
                    disabled={!!isActing}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--theme-surface-secondary)] text-[var(--theme-text-secondary)] text-xs font-bold hover:bg-red-500/10 hover:text-red-400 transition-colors ml-auto disabled:opacity-60 border border-[var(--theme-border)]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminReviewsPage;
