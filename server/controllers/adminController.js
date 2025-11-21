import Issue from "../models/Issue.js";

export const getAllIssues = async (req, res) => {
  const issues = await Issue.find().sort({ createdAt: -1 });
  res.json(issues);
};

export const updateIssueStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const issue = await Issue.findByIdAndUpdate(id, { status }, { new: true });
  res.json(issue);
};
