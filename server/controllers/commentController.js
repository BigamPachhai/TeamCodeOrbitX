import Comment from "../models/Comment.js";
import User from "../models/User.js";

export const addComment = async (req, res) => {
  const { issueId, comment } = req.body;

  const newComment = await Comment.create({
    issue: issueId,
    user: req.user._id,
    comment,
  });

  // Award 2 points for adding a helpful comment
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { points: 2 },
  });

  res.json(newComment);
};

export const getComments = async (req, res) => {
  const { issueId } = req.params;

  const comments = await Comment.find({ issue: issueId }).populate("user");

  res.json(comments);
};
