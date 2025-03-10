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

    // Add cache control headers - cache for 5 minutes
    res.set('Cache-Control', 'public, max-age=300');
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

    // Add cache control headers - discussions with comments change frequently
    // so use a shorter cache time
    res.set('Cache-Control', 'public, max-age=60'); // 1 minute
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
    const userId = req.user.id;

    // Find the discussion
    const discussion = await Discussion.findById(discussionId).populate({
      path: 'comments.user',
      select: 'name email'
    }).populate('user', 'name email');

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    // Find the comment
    const commentIndex = discussion.comments.findIndex(
      comment => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const comment = discussion.comments[commentIndex];

    // Check if the user is authorized to delete the comment
    // (either the comment author or discussion author)
    if (
      comment.user._id.toString() !== userId &&
      discussion.user._id.toString() !== userId
    ) {
      return res.status(403).json({
        error: 'You are not authorized to delete this comment'
      });
    }

    // Remove the comment
    discussion.comments.splice(commentIndex, 1);
    await discussion.save();

    // Return the updated discussion with populated user fields
    const updatedDiscussion = await Discussion.findById(discussionId)
      .populate({
        path: 'comments.user',
        select: 'name email'
      })
      .populate('user', 'name email');

    res.json({
      message: 'Comment deleted successfully',
      discussion: updatedDiscussion
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      error: 'An error occurred while deleting the comment'
    });
  }
};