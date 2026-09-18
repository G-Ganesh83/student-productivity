import Resource from '../models/Resource.js';

/**
 * GET /api/resources
 * Returns all resources belonging to the authenticated user, newest first.
 */
export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(100);
    return res.status(200).json({ success: true, data: resources });
  } catch (error) {
    console.error('[RESOURCES] getResources error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch resources' });
  }
};

/**
 * POST /api/resources
 * Creates a new resource for the authenticated user.
 */
export const createResource = async (req, res) => {
  try {
    const { title, type, url, tags } = req.body;

    const resource = await Resource.create({
      userId: req.user._id,
      title,
      type: type || 'link',
      url,
      tags: Array.isArray(tags) ? tags : [],
    });

    return res.status(201).json({ success: true, data: resource });
  } catch (error) {
    console.error('[RESOURCES] createResource error:', error.message);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }

    return res.status(500).json({ success: false, message: 'Failed to create resource' });
  }
};

/**
 * DELETE /api/resources/:id
 * Deletes a resource — only the owning user may delete.
 */
export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    return res.status(200).json({ success: true, message: 'Resource deleted' });
  } catch (error) {
    console.error('[RESOURCES] deleteResource error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to delete resource' });
  }
};
