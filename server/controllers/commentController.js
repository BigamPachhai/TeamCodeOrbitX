import Comment from "../models/Comment.js";

export const addComment = async (req, res) => {
  const { issueId, comment } = req.body;

  const newComment = await Comment.create({
    issue: issueId,
    user: req.user._id,
    comment,
  });

  res.json(newComment);
};

export const getComments = async (req, res) => {
  const { issueId } = req.params;

  const comments = await Comment.find({ issue: issueId }).populate("user");

  res.json(comments);
};
