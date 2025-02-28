import Discussion from '../models/Discussion.js';

// Create a new discussion
export const createDiscussion = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const discussion = new Discussion({
      title,
      content,
      category,
      user: req.user.id
    });

    await discussion.save();

    // Populate user info without returning password
    const populatedDiscussion = await Discussion.findById(discussion._id)
      .populate('user', 'name email -_id');

    res.status(201).json({
      message: 'Discussion created successfully',
      discussion: populatedDiscussion
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all discussions
export const getAllDiscussions = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    const discussions = await Discussion.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });  // Sort by newest first

    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a discussion by ID
export const getDiscussionById = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate('user', 'name email') // Make sure to populate user
      .populate('comments.user', 'name email');

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    res.status(200).json(discussion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a discussion
export const updateDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    // Check if user owns this discussion
    if (discussion.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this discussion' });
    }

    const { title, content, category } = req.body;

    discussion.title = title || discussion.title;
    discussion.content = content || discussion.content;
    discussion.category = category || discussion.category;
    discussion.updatedAt = Date.now();

    await discussion.save();

    res.status(200).json({
      message: 'Discussion updated successfully',
      discussion
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a discussion
export const deleteDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    // Check if user owns this discussion
    if (discussion.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this discussion' });
    }

    await Discussion.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Discussion deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a comment to a discussion
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    discussion.comments.push({
      content,
      user: req.user.id
    });

    await discussion.save();

    // Get the populated discussion with the new comment
    const updatedDiscussion = await Discussion.findById(req.params.id)
      .populate('user', 'name email')
      .populate('comments.user', 'name email');

    res.status(201).json({
      message: 'Comment added successfully',
      discussion: updatedDiscussion
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { discussionId, commentId } = req.params;

    const discussion = await Discussion.findById(discussionId);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const comment = discussion.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns this comment or the discussion
    if (comment.user.toString() !== req.user.id && discussion.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    comment.remove();
    await discussion.save();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};