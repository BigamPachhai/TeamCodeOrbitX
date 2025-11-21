import IssueHistory from "../models/IssueHistory.js";
import Issue from "../models/Issue.js";

/**
 * Get timeline/history for an issue
 */
export const getIssueTimeline = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify issue exists
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Get all history entries, sorted by date (newest first)
    const history = await IssueHistory.find({ issue: id })
      .populate("changedBy", "fullName email")
      .sort({ createdAt: -1 });

    // Transform to include issue creation if not in history
    const timeline = history.map((entry) => ({
      id: entry._id,
      status: entry.status,
      changeType: entry.changeType,
      notes: entry.notes,
      changedBy: entry.changedBy
        ? {
            name: entry.changedBy.fullName || entry.changedBy.email,
            email: entry.changedBy.email,
          }
        : null,
      timestamp: entry.createdAt,
    }));

    // Add creation entry if not exists
    if (timeline.length === 0 || timeline[timeline.length - 1].changeType !== "created") {
      timeline.push({
        id: issue._id,
        status: "pending",
        changeType: "created",
        notes: "Issue reported",
        changedBy: null,
        timestamp: issue.createdAt,
      });
    }

    // Sort by timestamp (oldest first for timeline display)
    timeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    res.json({ timeline, issueId: id });
  } catch (error) {
    console.error("Error fetching issue timeline:", error);
    res.status(500).json({ message: "Error fetching timeline", error: error.message });
  }
};

