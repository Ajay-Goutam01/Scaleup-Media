import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ExternalLink,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  X,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import { projectsApi } from '../api/projects';
import { Project } from '../types';
import { useSettings } from '../context/SettingsContext';

gsap.registerPlugin(ScrollTrigger);

export const SelectedProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { getWhatsAppUrl } = useSettings();
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await projectsApi.getAll({ public: true });
        if (res.success && res.data) {
          setProjects(res.data);
        }
      } catch (err) {
        console.warn('Failed to load projects, using fallback:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        gridRef.current?.children || [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredProjects]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="py-20 sm:py-24 lg:py-32 bg-[var(--theme-bg)] relative overflow-hidden max-w-full"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Category Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl space-y-3 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--theme-primary)]/10 border border-[var(--theme-primary)]/20 text-[var(--theme-accent)] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Proven Agency Track Record</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--theme-text)] font-display tracking-tight">
              SELECTED WORK
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-[var(--theme-text-secondary)]">
              Explore recent creative sprints, viral reels, Meta Ads campaigns, and digital platforms we engineered for growth.
            </p>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 touch-target ${
                    activeCategory === cat
                      ? 'bg-[var(--theme-primary)] text-white shadow-md'
                      : 'bg-[var(--theme-surface)] text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] border border-[var(--theme-border)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-80 sm:h-96 rounded-3xl bg-[var(--theme-surface)] border border-[var(--theme-border)] animate-pulse p-6"
              />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-[var(--theme-surface)] rounded-3xl border border-[var(--theme-border)] p-8 max-w-lg mx-auto">
            <Layers className="w-12 h-12 text-[var(--theme-text-secondary)] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[var(--theme-text)] font-display mb-2">No Projects Found</h3>
            <p className="text-sm text-[var(--theme-text-secondary)] mb-6">
              New agency case studies and campaigns are being updated through the CMS.
            </p>
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10"
          >
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                onClick={() => setSelectedProject(project)}
                className="group relative rounded-3xl bg-[var(--theme-card)] border border-[var(--theme-card-border)] hover:border-[var(--theme-accent)] overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Image & Container */}
                <div className="relative w-full h-64 sm:h-72 md:h-80 overflow-hidden bg-[var(--theme-surface-secondary)]">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg)]/85 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--theme-surface)]/90 backdrop-blur-md text-[var(--theme-text)] shadow-md border border-[var(--theme-border)]">
                      {project.category}
                    </span>

                    {project.featured && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--theme-accent)] text-white shadow-glow">
                        Featured Case Study
                      </span>
                    )}
                  </div>

                  {/* Quick Client Tag */}
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-10">
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--theme-accent)]">
                      {project.client}
                    </p>
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-6 sm:p-7 md:p-8 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--theme-text)] font-display group-hover:text-[var(--theme-accent)] transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-[var(--theme-text-secondary)] line-clamp-2 leading-relaxed font-normal">
                      {project.shortDescription || project.description}
                    </p>
                  </div>

                  {/* Results highlight banner */}
                  {project.results && (
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate">{project.results}</span>
                    </div>
                  )}

                  {/* Card Bottom CTA */}
                  <div className="pt-4 border-t border-[var(--theme-border)] flex items-center justify-between text-xs sm:text-sm font-bold text-[var(--theme-text)]">
                    <span className="group-hover:text-[var(--theme-accent)] transition-colors">
                      View Project Case Study
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[var(--theme-surface-secondary)] group-hover:bg-[var(--theme-primary)] group-hover:text-white flex items-center justify-center transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Project Showcase Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[var(--theme-surface)] rounded-3xl shadow-2xl overflow-y-auto border border-[var(--theme-border)] p-5 sm:p-8 md:p-10 my-auto text-[var(--theme-text)]">
            {/* Close Button (44px touch target) */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 rounded-full bg-[var(--theme-surface-secondary)] hover:bg-[var(--theme-border)] text-[var(--theme-text)] transition-colors z-20 touch-target"
              aria-label="Close Project Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 sm:space-y-3 mb-6 pr-12">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--theme-accent)] px-3 py-1 rounded-full bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)]">
                  {selectedProject.client}
                </span>
                <span className="text-xs font-semibold text-[var(--theme-text-secondary)] px-3 py-1 rounded-full bg-[var(--theme-surface-secondary)]">
                  {selectedProject.category}
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-[var(--theme-text)] font-display">
                {selectedProject.title}
              </h2>
            </div>

            {/* Hero Media */}
            <div className="relative rounded-2xl overflow-hidden mb-6 sm:mb-8 border border-[var(--theme-border)] shadow-md">
              <img
                src={selectedProject.thumbnail}
                alt={selectedProject.title}
                className="w-full max-h-[380px] sm:max-h-[440px] object-cover"
              />
            </div>

            {/* Results Callout */}
            {selectedProject.results && (
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 mb-6 sm:mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold text-emerald-400">Verified Impact &amp; Results</p>
                  <p className="text-sm sm:text-base md:text-lg font-extrabold">{selectedProject.results}</p>
                </div>
              </div>
            )}

            {/* Full Story Description */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-bold text-[var(--theme-text)] font-display">Project Overview &amp; Strategy</h3>
              <p className="text-sm sm:text-base text-[var(--theme-text-secondary)] leading-relaxed whitespace-pre-line font-normal">
                {selectedProject.description}
              </p>
            </div>

            {/* Gallery Images if available */}
            {selectedProject.gallery && selectedProject.gallery.length > 0 && (
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-bold text-[var(--theme-text)] font-display flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[var(--theme-accent)]" />
                  <span>Campaign Visuals &amp; Assets</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {selectedProject.gallery.map((imgUrl: string, idx: number) => (
                    <div key={idx} className="rounded-2xl overflow-hidden border border-[var(--theme-border)] shadow-sm">
                      <img
                        src={imgUrl}
                        alt={`${selectedProject.title} asset ${idx + 1}`}
                        className="w-full h-48 sm:h-56 object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="pt-5 border-t border-[var(--theme-border)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3">
                {selectedProject.externalUrl && (
                  <a
                    href={selectedProject.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-bold bg-[var(--theme-surface-secondary)] text-[var(--theme-text)] hover:border-[var(--theme-accent)] border border-[var(--theme-border)] transition-colors touch-target"
                  >
                    <span>Visit Live Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <a
                href={getWhatsAppUrl(
                  `Hi ScaleUp Media! I was looking at your case study "${selectedProject.title}" for ${selectedProject.client}. Can we build something similar for my brand?`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-[var(--theme-primary)] text-white hover:opacity-90 shadow-lg transition-all touch-target"
              >
                <span>Scale Similar Results for My Brand →</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
