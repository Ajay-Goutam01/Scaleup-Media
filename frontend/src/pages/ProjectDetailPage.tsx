import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, TrendingUp, Calendar, ArrowUpRight, MessageCircle } from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { projectsApi } from '../api/projects';
import { Project } from '../types';
import { useSettings } from '../context/SettingsContext';
import { getOptimizedImageUrl } from '../utils/imageKit';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { getWhatsAppUrl } = useSettings();

  useEffect(() => {
    if (!id) return;
    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await projectsApi.getByIdOrSlug(id);
        if (res.success && res.data) {
          setProject(res.data);
        }
      } catch (err) {
        console.error('Failed to load project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--theme-bg)] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-[var(--theme-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[var(--theme-bg)] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-32 text-center px-4">
          <h2 className="text-3xl font-bold text-[var(--theme-text)] mb-4 font-display">Project Not Found</h2>
          <p className="text-[var(--theme-text-secondary)] mb-6">The requested case study could not be loaded.</p>
          <Link
            to="/#work"
            className="px-6 py-3 rounded-full bg-[var(--theme-primary)] text-white font-bold text-sm shadow-md"
          >
            ← Back to Selected Work
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 text-[var(--theme-text)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <Link
            to="/#work"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Work</span>
          </Link>

          {/* Header */}
          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] text-[var(--theme-accent)]">
                {project.client}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--theme-surface)] border border-[var(--theme-border)] text-[var(--theme-text-secondary)]">
                {project.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[var(--theme-text)] font-display tracking-tight leading-tight">
              {project.title}
            </h1>
          </div>

          {/* Hero Thumbnail */}
          <div className="rounded-3xl overflow-hidden border border-[var(--theme-border)] shadow-xl mb-12">
            <img
              src={getOptimizedImageUrl(project.thumbnail, { width: 1200, quality: 85 })}
              alt={project.title}
              className="w-full max-h-[520px] object-cover"
              loading="eager"
            />
          </div>

          {/* Results Badge */}
          {project.results && (
            <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 mb-12 flex items-center gap-4 text-emerald-300">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase font-bold text-emerald-400">Demonstrated Growth Metrics</p>
                <p className="text-xl font-extrabold">{project.results}</p>
              </div>
            </div>
          )}

          {/* Project Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-[var(--theme-text)] font-display">
                Case Study Overview &amp; Execution
              </h2>
              <div className="prose text-[var(--theme-text-secondary)] leading-relaxed whitespace-pre-line text-base">
                {project.description}
              </div>
            </div>

            <div className="p-7 rounded-3xl bg-[var(--theme-surface)] border border-[var(--theme-border)] shadow-card space-y-6 h-fit">
              <div>
                <p className="text-xs uppercase font-bold text-[var(--theme-text-secondary)]">Client</p>
                <p className="text-base font-bold text-[var(--theme-text)]">{project.client}</p>
              </div>

              <div>
                <p className="text-xs uppercase font-bold text-[var(--theme-text-secondary)]">Category</p>
                <p className="text-base font-bold text-[var(--theme-text)]">{project.category}</p>
              </div>

              {project.externalUrl && (
                <div>
                  <p className="text-xs uppercase font-bold text-[var(--theme-text-secondary)] mb-1">Live Project</p>
                  <a
                    href={project.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--theme-accent)] hover:underline"
                  >
                    <span>Visit Live Experience</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              <div className="pt-4 border-t border-[var(--theme-border)]">
                <a
                  href={getWhatsAppUrl(
                    `Hi ScaleUp Media! I'm interested in scaling a project like "${project.title}".`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-[var(--theme-primary)] text-white text-xs font-bold hover:opacity-90 transition-colors shadow-md"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>Discuss This Project</span>
                </a>
              </div>
            </div>
          </div>

          {/* Gallery Showcase */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[var(--theme-text)] font-display">Visual Campaign Assets</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {project.gallery.map((img, idx) => (
                  <div key={idx} className="rounded-3xl overflow-hidden border border-[var(--theme-border)] shadow-md">
                    <img
                      src={getOptimizedImageUrl(img, { width: 800, quality: 85 })}
                      alt={`${project.title} visual ${idx + 1}`}
                      className="w-full h-72 object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
