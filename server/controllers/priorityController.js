import Issue from "../models/Issue.js";
import Upvote from "../models/Upvote.js";
import Comment from "../models/Comment.js";
import { predictResolutionTime } from "../utils/aiUtils.js";

/**
 * Calculate dynamic priority score for an issue
 * Factors:
 * - Upvote count (community support)
 * - Comment count (engagement)
 * - Severity (from AI)
 * - Age of issue
 * - Location criticality
 */
export const calculatePriorityScore = async (issueId) => {
  try {
    const issue = await Issue.findById(issueId);
    if (!issue) {
      throw new Error("Issue not found");
    }

    // Get upvote count
    const upvoteCount = await Upvote.countDocuments({ issue: issueId });

    // Get comment count
    const commentCount = await Comment.countDocuments({ issue: issueId });

    // Calculate age in days
    const ageInDays = Math.floor(
      (Date.now() - new Date(issue.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Severity score (High: 3, Medium: 2, Low: 1)
    const severityScore = issue.severity === "high" ? 3 : issue.severity === "medium" ? 2 : 1;

    // Calculate priority score (0-100)
    let priorityScore = 0;

    // Upvote weight: 30% (max 30 points)
    priorityScore += Math.min(upvoteCount * 2, 30);

    // Comment weight: 20% (max 20 points)
    priorityScore += Math.min(commentCount * 2, 20);

    // Severity weight: 30% (max 30 points)
    priorityScore += severityScore * 10;

    // Age weight: 20% (max 20 points) - older issues get higher priority
    priorityScore += Math.min(ageInDays * 2, 20);

    // Status penalty
    if (issue.status === "resolved") {
      priorityScore = 0; // Resolved issues have no priority
    } else if (issue.status === "in-progress") {
      priorityScore *= 0.7; // In-progress issues have reduced priority
    }

    return Math.round(Math.min(priorityScore, 100));
  } catch (error) {
    console.error("Error calculating priority score:", error);
    return 0;
  }
};

/**
 * Get priority score and resolution prediction for an issue
 */
export const getIssuePriority = async (req, res) => {
  try {
    const { id } = req.params;

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Calculate priority score
    const priorityScore = await calculatePriorityScore(id);

    // Get resolution time prediction using AI
    let resolutionPrediction = null;
    try {
      const similarIssues = await Issue.find({
        category: issue.category,
        status: "resolved",
      })
        .sort({ updatedAt: -1 })
        .limit(5);

      if (similarIssues.length > 0) {
        // Calculate average resolution time from similar issues
        const avgResolutionTime = similarIssues.reduce((sum, similar) => {
          const resolutionTime =
            new Date(similar.updatedAt).getTime() -
            new Date(similar.createdAt).getTime();
          return sum + resolutionTime;
        }, 0) / similarIssues.length;

        // Convert to days
        const avgDays = Math.ceil(avgResolutionTime / (1000 * 60 * 60 * 24));

        resolutionPrediction = {
          estimatedDays: avgDays,
          basedOn: `${similarIssues.length} similar resolved issues`,
          confidence: similarIssues.length >= 3 ? "high" : "medium",
        };
      } else {
        // Use AI prediction if no similar issues
        resolutionPrediction = await predictResolutionTime(
          issue.category,
          issue.description,
          issue.severity
        );
      }
    } catch (error) {
      console.error("Error predicting resolution time:", error);
    }

    // Determine priority level
    let priorityLevel = "low";
    if (priorityScore >= 70) priorityLevel = "high";
    else if (priorityScore >= 40) priorityLevel = "medium";

    res.json({
      priorityScore,
      priorityLevel,
      resolutionPrediction,
      issueId: id,
    });
  } catch (error) {
    console.error("Error getting issue priority:", error);
    res.status(500).json({ message: "Error calculating priority", error: error.message });
  }
};

/**
 * Get issues sorted by priority
 */
export const getIssuesByPriority = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const issues = await Issue.find({ status: { $ne: "resolved" } })
      .populate("user", "fullName email")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    // Calculate priority scores for all issues
    const issuesWithPriority = await Promise.all(
      issues.map(async (issue) => {
        const priorityScore = await calculatePriorityScore(issue._id);
        return {
          ...issue.toObject(),
          priorityScore,
        };
      })
    );

    // Sort by priority score (highest first)
    issuesWithPriority.sort((a, b) => b.priorityScore - a.priorityScore);

    res.json({ issues: issuesWithPriority });
  } catch (error) {
    console.error("Error getting issues by priority:", error);
    res.status(500).json({ message: "Error getting priority issues", error: error.message });
  }
};

