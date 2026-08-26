import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Admin, IAdmin } from '../models/Admin';
import { Project, IProject } from '../models/Project';
import { Service, IService } from '../models/Service';
import { Testimonial, ITestimonial } from '../models/Testimonial';
import { Review, IReview } from '../models/Review';
import { Branding, IBranding } from '../models/Branding';
import { ThemeSettings, IThemeSettings } from '../models/ThemeSettings';
import { WebsiteContent, IWebsiteContent } from '../models/WebsiteContent';
import { SectionSettings, ISectionSettings } from '../models/SectionSettings';
import { ContactSettings, IContactSettings } from '../models/ContactSettings';
import { defaultSeedData } from '../seed/seedData';

import os from 'os';

const DATA_DIR = process.env.VERCEL || process.env.NODE_ENV === 'production'
  ? path.join(os.tmpdir(), 'scaleup-data')
  : path.resolve(__dirname, '../../data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

interface MemoryStoreData {
  admins: any[];
  projects: any[];
  services: any[];
  testimonials: any[];
  reviews: any[];
  websiteContent: any;
  sectionSettings: any;
  contactSettings: any;
  branding: any;
  themeSettings: any;
}

class ResilientStore {
  private localData: MemoryStoreData;
  private isMongoConnected: boolean = false;

  constructor() {
    this.localData = this.loadLocalFile();
  }

  public setMongoConnected(status: boolean) {
    this.isMongoConnected = status;
    if (status) {
      this.syncToMongo();
    }
  }

  private loadLocalFile(): MemoryStoreData {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(STORE_FILE)) {
        const raw = fs.readFileSync(STORE_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('[Store] Local store init fallback:', e);
    }

    const initial: MemoryStoreData = {
      admins: [],
      projects: defaultSeedData.projects.map((p) => ({
        ...p,
        _id: new mongoose.Types.ObjectId().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      services: defaultSeedData.services.map((s) => ({
        ...s,
        _id: new mongoose.Types.ObjectId().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      testimonials: defaultSeedData.testimonials.map((t) => ({
        ...t,
        _id: new mongoose.Types.ObjectId().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      reviews: [],
      websiteContent: {
        ...defaultSeedData.websiteContent,
        _id: new mongoose.Types.ObjectId().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      sectionSettings: {
        ...defaultSeedData.sectionSettings,
        _id: new mongoose.Types.ObjectId().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      contactSettings: {
        ...defaultSeedData.contactSettings,
        _id: new mongoose.Types.ObjectId().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      branding: {
        ...defaultSeedData.branding,
        _id: new mongoose.Types.ObjectId().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      themeSettings: {
        ...defaultSeedData.themeSettings,
        _id: new mongoose.Types.ObjectId().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    try {
      fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[Store] Could not write store.json initially:', err);
    }
    return initial;
  }

  private persistLocalFile() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(STORE_FILE, JSON.stringify(this.localData, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Store] Error persisting local store:', err);
    }
  }

  public async syncToMongo() {
    if (mongoose.connection.readyState !== 1) return;
    try {
      // Seed Services
      const serviceCount = await Service.countDocuments();
      if (serviceCount === 0) {
        await Service.insertMany(defaultSeedData.services);
        console.log('[Store] Services seeded in MongoDB.');
      }

      // Seed Projects
      const projectCount = await Project.countDocuments();
      if (projectCount === 0) {
        await Project.insertMany(defaultSeedData.projects);
        console.log('[Store] Projects seeded in MongoDB.');
      }

      // Seed Testimonials
      const testCount = await Testimonial.countDocuments();
      if (testCount === 0) {
        await Testimonial.insertMany(defaultSeedData.testimonials);
        console.log('[Store] Testimonials seeded in MongoDB.');
      }

      // Seed Content
      const contentCount = await WebsiteContent.countDocuments();
      if (contentCount === 0) {
        await WebsiteContent.create(defaultSeedData.websiteContent);
        console.log('[Store] Website Content seeded in MongoDB.');
      }

      // Seed Sections
      const sectionCount = await SectionSettings.countDocuments();
      if (sectionCount === 0) {
        await SectionSettings.create(defaultSeedData.sectionSettings);
        console.log('[Store] Section Settings seeded in MongoDB.');
      }

      // Seed Contact
      const contactCount = await ContactSettings.countDocuments();
      if (contactCount === 0) {
        await ContactSettings.create(defaultSeedData.contactSettings);
        console.log('[Store] Contact Settings seeded in MongoDB.');
      }

      // Seed Branding
      const brandingCount = await Branding.countDocuments();
      if (brandingCount === 0) {
        await Branding.create(defaultSeedData.branding);
        console.log('[Store] Branding seeded in MongoDB.');
      }

      // Seed Theme
      const themeCount = await ThemeSettings.countDocuments();
      if (themeCount === 0) {
        await ThemeSettings.create(defaultSeedData.themeSettings);
        console.log('[Store] Theme Settings seeded in MongoDB.');
      }
    } catch (err) {
      console.warn('[Store] Mongo sync notice:', err);
    }
  }

  // --- ADMIN METHODS ---
  public async countAdmins(): Promise<number> {
    if (mongoose.connection.readyState === 1) {
      try {
        return await Admin.countDocuments();
      } catch (err) {}
    }
    return this.localData.admins.length;
  }

  public async findAdminByEmail(email: string) {
    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
        if (doc) return doc;
      } catch (err) {}
    }
    return this.localData.admins.find((a) => a.email.toLowerCase() === email.toLowerCase());
  }

  public async findAdminById(id: string) {
    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await Admin.findById(id).select('-password');
        if (doc) return doc;
      } catch (err) {}
    }
    const admin = this.localData.admins.find((a) => a._id === id || a.id === id);
    if (admin) {
      const { password, ...safe } = admin;
      return safe;
    }
    return null;
  }

  public async createAdmin(data: { name: string; email: string; password: string; role?: string; mustChangePassword?: boolean }) {
    const adminPayload = {
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      password: data.password,
      role: data.role || 'superadmin',
      mustChangePassword: data.mustChangePassword !== undefined ? data.mustChangePassword : true,
      lastPasswordChangedAt: null,
    };

    if (mongoose.connection.readyState === 1) {
      try {
        const created = await Admin.create(adminPayload);
        const obj = created.toObject();
        this.localData.admins.push(obj);
        this.persistLocalFile();
        return obj;
      } catch (err) {
        console.error('[Store] Error creating admin in MongoDB:', err);
      }
    }

    const newAdmin = {
      ...adminPayload,
      _id: new mongoose.Types.ObjectId().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.localData.admins.push(newAdmin);
    this.persistLocalFile();
    return newAdmin;
  }

  public async updateAdminPassword(id: string, hashedPassword: string): Promise<void> {
    const now = new Date();
    if (mongoose.connection.readyState === 1) {
      try {
        await Admin.updateOne(
          { _id: id },
          { $set: { password: hashedPassword, mustChangePassword: false, lastPasswordChangedAt: now } }
        );
        const localAdmin = this.localData.admins.find((a) => a._id === id || a.id === id);
        if (localAdmin) {
          localAdmin.password = hashedPassword;
          localAdmin.mustChangePassword = false;
          localAdmin.lastPasswordChangedAt = now;
          this.persistLocalFile();
        }
        return;
      } catch (err) {
        console.error('[Store] Error updating admin password in MongoDB:', err);
      }
    }
    const localAdmin = this.localData.admins.find((a) => a._id === id || a.id === id);
    if (localAdmin) {
      localAdmin.password = hashedPassword;
      localAdmin.mustChangePassword = false;
      localAdmin.lastPasswordChangedAt = now;
      this.persistLocalFile();
    }
  }

  public async resetAdminPassword(email: string, hashedPassword: string): Promise<boolean> {
    const now = new Date();
    const normalizedEmail = email.toLowerCase().trim();
    if (mongoose.connection.readyState === 1) {
      try {
        const res = await Admin.updateOne(
          { email: normalizedEmail },
          { $set: { password: hashedPassword, mustChangePassword: true, lastPasswordChangedAt: now } }
        );
        const localAdmin = this.localData.admins.find((a) => a.email.toLowerCase() === normalizedEmail);
        if (localAdmin) {
          localAdmin.password = hashedPassword;
          localAdmin.mustChangePassword = true;
          localAdmin.lastPasswordChangedAt = now;
          this.persistLocalFile();
        }
        return res.matchedCount > 0 || !!localAdmin;
      } catch (err) {
        console.error('[Store] Error resetting admin password in MongoDB:', err);
      }
    }
    const localAdmin = this.localData.admins.find((a) => a.email.toLowerCase() === normalizedEmail);
    if (localAdmin) {
      localAdmin.password = hashedPassword;
      localAdmin.mustChangePassword = true;
      localAdmin.lastPasswordChangedAt = now;
      this.persistLocalFile();
      return true;
    }
    return false;
  }

  public async updateAdminEmail(id: string, newEmail: string): Promise<void> {
    if (mongoose.connection.readyState === 1) {
      try {
        await Admin.updateOne({ _id: id }, { $set: { email: newEmail } });
        const localAdmin = this.localData.admins.find((a) => a._id === id || a.id === id);
        if (localAdmin) {
          localAdmin.email = newEmail;
          this.persistLocalFile();
        }
        return;
      } catch (err) {
        console.error('[Store] Error updating admin email in MongoDB:', err);
      }
    }
    const localAdmin = this.localData.admins.find((a) => a._id === id || a.id === id);
    if (localAdmin) {
      localAdmin.email = newEmail;
      this.persistLocalFile();
    }
  }

  // --- PROJECTS ---
  public async getProjects(query: { activeOnly?: boolean; featuredOnly?: boolean } = {}) {
    if (mongoose.connection.readyState === 1) {
      try {
        const filter: any = {};
        if (query.activeOnly) filter.active = true;
        if (query.featuredOnly) filter.featured = true;
        return await Project.find(filter).sort({ order: 1, createdAt: -1 });
      } catch (err) {}
    }
    let list = [...this.localData.projects];
    if (query.activeOnly) list = list.filter((p) => p.active !== false);
    if (query.featuredOnly) list = list.filter((p) => p.featured === true);
    return list.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  public async getProjectByIdOrSlug(identifier: string) {
    if (mongoose.connection.readyState === 1) {
      try {
        if (mongoose.Types.ObjectId.isValid(identifier)) {
          const doc = await Project.findById(identifier);
          if (doc) return doc;
        }
        const docSlug = await Project.findOne({ slug: identifier });
        if (docSlug) return docSlug;
      } catch (err) {}
    }
    return this.localData.projects.find(
      (p) => p._id === identifier || p.id === identifier || p.slug === identifier
    );
  }

  public async createProject(data: any) {
    if (!data.slug && data.title) {
      data.slug =
        data.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '') +
        '-' +
        Math.floor(Math.random() * 10000);
    }
    if (mongoose.connection.readyState === 1) {
      try {
        const created = await Project.create(data);
        this.localData.projects.push(created.toObject());
        this.persistLocalFile();
        return created;
      } catch (err) {}
    }
    const newProj = {
      ...data,
      _id: new mongoose.Types.ObjectId().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.localData.projects.push(newProj);
    this.persistLocalFile();
    return newProj;
  }

  public async updateProject(id: string, updates: any) {
    if (mongoose.connection.readyState === 1) {
      try {
        const updated = await Project.findByIdAndUpdate(id, updates, { new: true });
        if (updated) {
          const idx = this.localData.projects.findIndex((p) => p._id === id || p.id === id);
          if (idx !== -1) {
            this.localData.projects[idx] = updated.toObject();
            this.persistLocalFile();
          }
          return updated;
        }
      } catch (err) {}
    }
    const idx = this.localData.projects.findIndex((p) => p._id === id || p.id === id);
    if (idx === -1) return null;
    this.localData.projects[idx] = {
      ...this.localData.projects[idx],
      ...updates,
      updatedAt: new Date(),
    };
    this.persistLocalFile();
    return this.localData.projects[idx];
  }

  public async deleteProject(id: string) {
    if (mongoose.connection.readyState === 1) {
      try {
        await Project.findByIdAndDelete(id);
      } catch (err) {}
    }
    const idx = this.localData.projects.findIndex((p) => p._id === id || p.id === id);
    if (idx !== -1) {
      this.localData.projects.splice(idx, 1);
      this.persistLocalFile();
      return true;
    }
    return false;
  }

  // --- SERVICES ---
  public async getServices(query: { activeOnly?: boolean } = {}) {
    if (mongoose.connection.readyState === 1) {
      try {
        const filter: any = {};
        if (query.activeOnly) filter.active = true;
        return await Service.find(filter).sort({ order: 1, serviceNumber: 1 });
      } catch (err) {}
    }
    let list = [...this.localData.services];
    if (query.activeOnly) list = list.filter((s) => s.active !== false);
    return list.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  public async createService(data: any) {
    if (mongoose.connection.readyState === 1) {
      try {
        const created = await Service.create(data);
        this.localData.services.push(created.toObject());
        this.persistLocalFile();
        return created;
      } catch (err) {}
    }
    const newService = {
      ...data,
      _id: new mongoose.Types.ObjectId().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.localData.services.push(newService);
    this.persistLocalFile();
    return newService;
  }

  public async updateService(id: string, updates: any) {
    if (mongoose.connection.readyState === 1) {
      try {
        const updated = await Service.findByIdAndUpdate(id, updates, { new: true });
        if (updated) {
          const idx = this.localData.services.findIndex((s) => s._id === id || s.id === id);
          if (idx !== -1) {
            this.localData.services[idx] = updated.toObject();
            this.persistLocalFile();
          }
          return updated;
        }
      } catch (err) {}
    }
    const idx = this.localData.services.findIndex((s) => s._id === id || s.id === id);
    if (idx === -1) return null;
    this.localData.services[idx] = {
      ...this.localData.services[idx],
      ...updates,
      updatedAt: new Date(),
    };
    this.persistLocalFile();
    return this.localData.services[idx];
  }

  public async deleteService(id: string) {
    if (mongoose.connection.readyState === 1) {
      try {
        await Service.findByIdAndDelete(id);
      } catch (err) {}
    }
    const idx = this.localData.services.findIndex((s) => s._id === id || s.id === id);
    if (idx !== -1) {
      this.localData.services.splice(idx, 1);
      this.persistLocalFile();
      return true;
    }
    return false;
  }

  // --- TESTIMONIALS ---
  public async getTestimonials(query: { activeOnly?: boolean } = {}) {
    if (mongoose.connection.readyState === 1) {
      try {
        const filter: any = {};
        if (query.activeOnly) filter.active = true;
        return await Testimonial.find(filter).sort({ order: 1, createdAt: -1 });
      } catch (err) {}
    }
    let list = [...this.localData.testimonials];
    if (query.activeOnly) list = list.filter((t) => t.active !== false);
    return list.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  public async createTestimonial(data: any) {
    if (mongoose.connection.readyState === 1) {
      try {
        const created = await Testimonial.create(data);
        this.localData.testimonials.push(created.toObject());
        this.persistLocalFile();
        return created;
      } catch (err) {}
    }
    const newTestimonial = {
      ...data,
      _id: new mongoose.Types.ObjectId().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.localData.testimonials.push(newTestimonial);
    this.persistLocalFile();
    return newTestimonial;
  }

  public async updateTestimonial(id: string, updates: any) {
    if (mongoose.connection.readyState === 1) {
      try {
        const updated = await Testimonial.findByIdAndUpdate(id, updates, { new: true });
        if (updated) {
          const idx = this.localData.testimonials.findIndex((t) => t._id === id || t.id === id);
          if (idx !== -1) {
            this.localData.testimonials[idx] = updated.toObject();
            this.persistLocalFile();
          }
          return updated;
        }
      } catch (err) {}
    }
    const idx = this.localData.testimonials.findIndex((t) => t._id === id || t.id === id);
    if (idx === -1) return null;
    this.localData.testimonials[idx] = {
      ...this.localData.testimonials[idx],
      ...updates,
      updatedAt: new Date(),
    };
    this.persistLocalFile();
    return this.localData.testimonials[idx];
  }

  public async deleteTestimonial(id: string) {
    if (mongoose.connection.readyState === 1) {
      try {
        await Testimonial.findByIdAndDelete(id);
      } catch (err) {}
    }
    const idx = this.localData.testimonials.findIndex((t) => t._id === id || t.id === id);
    if (idx !== -1) {
      this.localData.testimonials.splice(idx, 1);
      this.persistLocalFile();
      return true;
    }
    return false;
  }

  // --- WEBSITE CONTENT ---
  public async getWebsiteContent() {
    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await WebsiteContent.findOne();
        if (doc) return doc;
      } catch (err) {}
    }
    return this.localData.websiteContent;
  }

  public async updateWebsiteContent(updates: any) {
    if (mongoose.connection.readyState === 1) {
      try {
        let doc = await WebsiteContent.findOne();
        if (!doc) {
          doc = await WebsiteContent.create(updates);
        } else {
          doc = await WebsiteContent.findByIdAndUpdate(doc._id, updates, { new: true });
        }
        if (doc) {
          this.localData.websiteContent = doc.toObject();
          this.persistLocalFile();
          return doc;
        }
      } catch (err) {}
    }
    this.localData.websiteContent = {
      ...this.localData.websiteContent,
      ...updates,
      updatedAt: new Date(),
    };
    this.persistLocalFile();
    return this.localData.websiteContent;
  }

  // --- SECTION SETTINGS ---
  public async getSectionSettings() {
    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await SectionSettings.findOne();
        if (doc) return doc;
      } catch (err) {}
    }
    return this.localData.sectionSettings;
  }

  public async updateSectionSettings(updates: any) {
    if (mongoose.connection.readyState === 1) {
      try {
        let doc = await SectionSettings.findOne();
        if (!doc) {
          doc = await SectionSettings.create(updates);
        } else {
          doc = await SectionSettings.findByIdAndUpdate(doc._id, updates, { new: true });
        }
        if (doc) {
          this.localData.sectionSettings = doc.toObject();
          this.persistLocalFile();
          return doc;
        }
      } catch (err) {}
    }
    this.localData.sectionSettings = {
      ...this.localData.sectionSettings,
      ...updates,
      updatedAt: new Date(),
    };
    this.persistLocalFile();
    return this.localData.sectionSettings;
  }

  // --- CONTACT SETTINGS ---
  public async getContactSettings() {
    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await ContactSettings.findOne();
        if (doc) return doc;
      } catch (err) {}
    }
    return this.localData.contactSettings;
  }

  public async updateContactSettings(updates: any) {
    if (mongoose.connection.readyState === 1) {
      try {
        let doc = await ContactSettings.findOne();
        if (!doc) {
          doc = await ContactSettings.create(updates);
        } else {
          doc = await ContactSettings.findByIdAndUpdate(doc._id, updates, { new: true });
        }
        if (doc) {
          this.localData.contactSettings = doc.toObject();
          this.persistLocalFile();
          return doc;
        }
      } catch (err) {}
    }
    this.localData.contactSettings = {
      ...this.localData.contactSettings,
      ...updates,
      updatedAt: new Date(),
    };
    this.persistLocalFile();
    return this.localData.contactSettings;
  }

  // --- STATS SUMMARY ---
  public async getStats() {
    const projects = await this.getProjects();
    const services = await this.getServices();
    const testimonials = await this.getTestimonials();
    const sections = await this.getSectionSettings();
    const pendingReviews = await this.getReviews({ status: 'pending' });

    const activeSectionsCount = Object.values(sections || {}).filter(
      (v) => v === true
    ).length;

    return {
      totalProjects: projects.length,
      activeProjects: projects.filter((p: any) => p.active !== false).length,
      featuredProjects: projects.filter((p: any) => p.featured === true).length,
      totalServices: services.length,
      activeServices: services.filter((s: any) => s.active !== false).length,
      totalTestimonials: testimonials.length,
      activeTestimonials: testimonials.filter((t: any) => t.active !== false).length,
      activeSectionsCount,
      pendingReviews: pendingReviews.length,
    };
  }

  // --- REVIEWS ---
  public async getReviews(query: { status?: string } = {}) {
    if (mongoose.connection.readyState === 1) {
      try {
        const filter: any = {};
        if (query.status) filter.status = query.status;
        return await Review.find(filter).sort({ order: 1, createdAt: -1 });
      } catch (err) {}
    }
    let list = [...(this.localData.reviews || [])];
    if (query.status) list = list.filter((r) => r.status === query.status);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async createReview(data: any) {
    if (mongoose.connection.readyState === 1) {
      try {
        const created = await Review.create(data);
        if (!this.localData.reviews) this.localData.reviews = [];
        this.localData.reviews.unshift(created.toObject());
        this.persistLocalFile();
        return created;
      } catch (err) {}
    }
    const newReview = {
      ...data,
      _id: new mongoose.Types.ObjectId().toString(),
      status: data.status || 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (!this.localData.reviews) this.localData.reviews = [];
    this.localData.reviews.unshift(newReview);
    this.persistLocalFile();
    return newReview;
  }

  public async updateReview(id: string, updates: any) {
    if (mongoose.connection.readyState === 1) {
      try {
        const updated = await Review.findByIdAndUpdate(id, updates, { new: true });
        if (updated) {
          if (!this.localData.reviews) this.localData.reviews = [];
          const idx = this.localData.reviews.findIndex((r) => r._id === id || r.id === id);
          if (idx !== -1) {
            this.localData.reviews[idx] = updated.toObject();
            this.persistLocalFile();
          }
          return updated;
        }
      } catch (err) {}
    }
    if (!this.localData.reviews) return null;
    const idx = this.localData.reviews.findIndex((r) => r._id === id || r.id === id);
    if (idx === -1) return null;
    this.localData.reviews[idx] = {
      ...this.localData.reviews[idx],
      ...updates,
      updatedAt: new Date(),
    };
    this.persistLocalFile();
    return this.localData.reviews[idx];
  }

  public async deleteReview(id: string) {
    if (mongoose.connection.readyState === 1) {
      try {
        await Review.findByIdAndDelete(id);
      } catch (err) {}
    }
    if (!this.localData.reviews) return false;
    const idx = this.localData.reviews.findIndex((r) => r._id === id || r.id === id);
    if (idx !== -1) {
      this.localData.reviews.splice(idx, 1);
      this.persistLocalFile();
      return true;
    }
    return false;
  }

  // --- BRANDING ---
  public async getBranding() {
    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await Branding.findOne();
        if (doc) return doc;
      } catch (err) {}
    }
    return this.localData.branding || defaultSeedData.branding;
  }

  public async updateBranding(updates: any) {
    if (mongoose.connection.readyState === 1) {
      try {
        let doc = await Branding.findOne();
        if (!doc) {
          doc = await Branding.create({ ...defaultSeedData.branding, ...updates });
        } else {
          doc = await Branding.findByIdAndUpdate(doc._id, updates, { new: true });
        }
        if (doc) {
          this.localData.branding = doc.toObject();
          this.persistLocalFile();
          return doc;
        }
      } catch (err) {}
    }
    this.localData.branding = {
      ...(this.localData.branding || defaultSeedData.branding),
      ...updates,
      updatedAt: new Date(),
    };
    this.persistLocalFile();
    return this.localData.branding;
  }

  // --- THEME SETTINGS ---
  public async getThemeSettings() {
    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await ThemeSettings.findOne();
        if (doc) return doc;
      } catch (err) {}
    }
    return this.localData.themeSettings || defaultSeedData.themeSettings;
  }

  public async updateThemeSettings(updates: any) {
    if (mongoose.connection.readyState === 1) {
      try {
        let doc = await ThemeSettings.findOne();
        if (!doc) {
          doc = await ThemeSettings.create({ ...defaultSeedData.themeSettings, ...updates });
        } else {
          doc = await ThemeSettings.findByIdAndUpdate(doc._id, updates, { new: true });
        }
        if (doc) {
          this.localData.themeSettings = doc.toObject();
          this.persistLocalFile();
          return doc;
        }
      } catch (err) {}
    }
    this.localData.themeSettings = {
      ...(this.localData.themeSettings || defaultSeedData.themeSettings),
      ...updates,
      updatedAt: new Date(),
    };
    this.persistLocalFile();
    return this.localData.themeSettings;
  }
}

export const store = new ResilientStore();

