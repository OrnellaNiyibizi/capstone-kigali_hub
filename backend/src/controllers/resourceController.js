import Resource from '../models/Resource.js';

// Create a new resource
export const createResource = async (req, res) => {
  try {
    // Add the user ID from the authenticated user
    const resource = new Resource({
      ...req.body,
      user: req.user.id
    });

    await resource.save();
    res.status(201).json({ message: 'Resource created successfully', resource });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all resources
export const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate('user', 'name email -_id');

    // Add cache control headers - cache for 5 minutes
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a resource by ID
export const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('user', 'name email');

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a resource by ID
export const updateResource = async (req, res) => {
  try {
    // First find the resource to check ownership
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if the user owns this resource
    if (resource.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this resource' });
    }

    // Update the resource
    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({ message: 'Resource updated successfully', resource: updatedResource });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a resource by ID
export const deleteResource = async (req, res) => {
  try {
    // First find the resource to check ownership
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if the user owns this resource
    if (resource.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this resource' });
    }

    // Delete the resource
    await Resource.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update your getResources function to handle filters
export const getResources = async (req, res) => {
  try {
    const { category, title, tags, sortBy } = req.query;

    // Build filter object
    const filter = {};

    if (category) {
      // Make category search case-insensitive too
      filter.category = { $regex: category, $options: 'i' };
    }

    if (title) {
      filter.title = { $regex: title, $options: 'i' }; // Case-insensitive search
    }

    if (tags) {
      filter.tags = { $in: Array.isArray(tags) ? tags : [tags] };
    }


    // Build sort object
    let sort = {};
    if (sortBy === 'newest') {
      sort = { createdAt: -1 };
    } else if (sortBy === 'oldest') {
      sort = { createdAt: 1 };
    } else if (sortBy === 'popular') {
      sort = { views: -1 };
    }

    const resources = await Resource.find(filter)
      .sort(sort)
      .populate('user', 'name email');

    res.json(resources);
  } catch (error) {
    console.error('Error in getResources:', error); // Add logging
    res.status(500).json({ message: error.message });
  }
};