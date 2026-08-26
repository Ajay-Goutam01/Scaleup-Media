import { Request, Response } from 'express';
import { store } from '../services/store';

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { activeOnly, featuredOnly } = req.query;
    const isPublic = activeOnly === 'true' || req.query.public === 'true';

    const projects = await store.getProjects({
      activeOnly: isPublic ? true : undefined,
      featuredOnly: featuredOnly === 'true' ? true : undefined,
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve projects.',
      error: error.message,
    });
  }
};

export const getProjectBySlugOrId = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const project = await store.getProjectByIdOrSlug(id);

    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve project details.',
      error: error.message,
    });
  }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, client, category, shortDescription, description, thumbnail, gallery, videoUrl, externalUrl, results, featured, active, order } = req.body;

    if (!title || !client || !description || !thumbnail) {
      res.status(400).json({
        success: false,
        message: 'Please provide title, client, description, and thumbnail.',
      });
      return;
    }

    const newProject = await store.createProject({
      title,
      client,
      category: category || 'Digital Growth',
      shortDescription: shortDescription || '',
      description,
      thumbnail,
      gallery: Array.isArray(gallery) ? gallery : [],
      videoUrl: videoUrl || '',
      externalUrl: externalUrl || '',
      results: results || '',
      featured: Boolean(featured),
      active: active !== undefined ? Boolean(active) : true,
      order: Number(order) || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      data: newProject,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create project.',
      error: error.message,
    });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const updated = await store.updateProject(id, req.body);

    if (!updated) {
      res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Project updated successfully.',
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update project.',
      error: error.message,
    });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const deleted = await store.deleteProject(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Project not found or already deleted.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete project.',
      error: error.message,
    });
  }
};
