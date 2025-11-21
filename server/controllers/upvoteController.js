import Upvote from "../models/Upvote.js";
import Issue from "../models/Issue.js";

/**
 * Get client IP address
 */
const getClientIp = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.headers["x-real-ip"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    "unknown"
  );
};

/**
 * Toggle upvote for an issue (like/unlike) - Works for both authenticated and anonymous users
 */
export const toggleUpvote = async (req, res) => {
  try {
    const { issueId, sessionId } = req.body;
    const userId = req.user?._id; // Optional - may be undefined for anonymous users
    const ipAddress = getClientIp(req);

    let existingUpvote;

    if (userId) {
      // Authenticated user - check by user ID
      existingUpvote = await Upvote.findOne({
        issue: issueId,
        user: userId,
      });
    } else {
      // Anonymous user - check by IP address or session ID
      const query = { issue: issueId };
      if (sessionId) {
        query.sessionId = sessionId;
      } else {
        query.ipAddress = ipAddress;
        query.user = null; // Ensure no user is associated
      }
      existingUpvote = await Upvote.findOne(query);
    }

    if (existingUpvote) {
      // Remove upvote (unlike)
      await Upvote.deleteOne({ _id: existingUpvote._id });

      // Get updated count
      const upvoteCount = await Upvote.countDocuments({ issue: issueId });

      return res.json({
        success: true,
        message: "Upvote removed",
        upvoted: false,
        upvoteCount,
      });
    } else {
      // Add upvote (like)
      const upvoteData = {
        issue: issueId,
        ipAddress: ipAddress,
      };

      if (userId) {
        upvoteData.user = userId;
      }

      if (sessionId) {
        upvoteData.sessionId = sessionId;
      }

      await Upvote.create(upvoteData);

      // Get updated count
      const upvoteCount = await Upvote.countDocuments({ issue: issueId });

      return res.json({
        success: true,
        message: "Upvoted successfully",
        upvoted: true,
        upvoteCount,
      });
    }
  } catch (error) {
    console.error("Error toggling upvote:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to toggle upvote",
      error: error.message,
    });
  }
};

/**
 * Get upvote count and user's upvote status for an issue - Works for anonymous users
 */
export const getUpvoteStatus = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { sessionId } = req.query;
    const userId = req.user?._id;
    const ipAddress = getClientIp(req);

    // Get total upvote count
    const upvoteCount = await Upvote.countDocuments({ issue: issueId });

    // Check if current user has upvoted
    let upvoted = false;

    if (userId) {
      // Authenticated user - check by user ID
      const userUpvote = await Upvote.findOne({
        issue: issueId,
        user: userId,
      });
      upvoted = !!userUpvote;
    } else {
      // Anonymous user - check by IP address or session ID
      const query = { issue: issueId };
      if (sessionId) {
        query.sessionId = sessionId;
      } else {
        query.ipAddress = ipAddress;
        query.user = null;
      }
      const anonymousUpvote = await Upvote.findOne(query);
      upvoted = !!anonymousUpvote;
    }

    return res.json({
      success: true,
      upvoteCount,
      upvoted,
    });
  } catch (error) {
    console.error("Error getting upvote status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get upvote status",
      error: error.message,
    });
  }
};

/**
 * Get all upvotes for multiple issues (bulk)
 */
export const getBulkUpvotes = async (req, res) => {
  try {
    const { issueIds } = req.body;
    const userId = req.user?._id;

    if (!issueIds || !Array.isArray(issueIds)) {
      return res.status(400).json({
        success: false,
        message: "issueIds array is required",
      });
    }

    // Get upvote counts for all issues
    const upvoteCounts = await Upvote.aggregate([
      {
        $match: {
          issue: { $in: issueIds.map((id) => mongoose.Types.ObjectId(id)) },
        },
      },
      { $group: { _id: "$issue", count: { $sum: 1 } } },
    ]);

    // Get user's upvoted issues (if logged in)
    let userUpvotes = [];
    if (userId) {
      userUpvotes = await Upvote.find({
        issue: { $in: issueIds },
        user: userId,
      }).select("issue");
    }

    // Format response
    const result = issueIds.map((issueId) => {
      const countData = upvoteCounts.find(
        (uc) => uc._id.toString() === issueId.toString()
      );
      const upvoted = userUpvotes.some(
        (uv) => uv.issue.toString() === issueId.toString()
      );

      return {
        issueId,
        upvoteCount: countData ? countData.count : 0,
        upvoted,
      };
    });

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error getting bulk upvotes:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get bulk upvotes",
      error: error.message,
    });
  }
};
