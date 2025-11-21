import Issue from "../models/Issue.js";

/**
 * Predict likely issues based on historical patterns
 * Uses location, time, category patterns to predict potential issues
 */
export const predictLikelyIssues = async (location, category) => {
  try {
    const issues = await Issue.find({
      locationName: { $regex: location, $options: "i" },
      category: category,
    }).sort({ createdAt: -1 }).limit(50);

    // Analyze patterns
    const patterns = {
      seasonal: analyzeSeasonalPatterns(issues),
      timeOfDay: analyzeTimePatterns(issues),
      frequency: issues.length,
      severity: calculateAverageSeverity(issues),
      resolutionTime: calculateAverageResolutionTime(issues),
    };

    // Predict likelihood (0-100)
    let likelihood = 0;
    
    // Higher frequency = higher likelihood
    if (patterns.frequency > 10) likelihood += 30;
    else if (patterns.frequency > 5) likelihood += 20;
    else if (patterns.frequency > 2) likelihood += 10;

    // Seasonal patterns
    const currentMonth = new Date().getMonth();
    if (patterns.seasonal[currentMonth] > 2) likelihood += 25;

    // Time of day patterns
    const currentHour = new Date().getHours();
    if (patterns.timeOfDay[currentHour] > 1) likelihood += 20;

    // Recent issues increase likelihood
    const recentIssues = issues.filter(
      (issue) => new Date() - new Date(issue.createdAt) < 7 * 24 * 60 * 60 * 1000
    );
    if (recentIssues.length > 0) likelihood += 25;

    return {
      likelihood: Math.min(100, likelihood),
      confidence: likelihood > 50 ? "high" : likelihood > 25 ? "medium" : "low",
      predictedIssues: issues.slice(0, 5).map((issue) => ({
        category: issue.category,
        location: issue.locationName,
        date: issue.createdAt,
        severity: issue.severity,
      })),
      patterns,
      recommendation: likelihood > 50
        ? "High risk area - preventive maintenance recommended"
        : likelihood > 25
        ? "Moderate risk - regular monitoring advised"
        : "Low risk - standard procedures",
    };
  } catch (error) {
    console.error("Error predicting issues:", error);
    return { likelihood: 0, confidence: "low", error: error.message };
  }
};

function analyzeSeasonalPatterns(issues) {
  const monthlyCount = {};
  issues.forEach((issue) => {
    const month = new Date(issue.createdAt).getMonth();
    monthlyCount[month] = (monthlyCount[month] || 0) + 1;
  });
  return monthlyCount;
}

function analyzeTimePatterns(issues) {
  const hourlyCount = {};
  issues.forEach((issue) => {
    const hour = new Date(issue.createdAt).getHours();
    hourlyCount[hour] = (hourlyCount[hour] || 0) + 1;
  });
  return hourlyCount;
}

function calculateAverageSeverity(issues) {
  const severityMap = { high: 3, medium: 2, low: 1 };
  const total = issues.reduce(
    (sum, issue) => sum + (severityMap[issue.severity] || 1),
    0
  );
  return issues.length > 0 ? total / issues.length : 0;
}

function calculateAverageResolutionTime(issues) {
  const resolved = issues.filter((i) => i.status === "resolved");
  if (resolved.length === 0) return null;

  const totalTime = resolved.reduce((sum, issue) => {
    const created = new Date(issue.createdAt);
    const resolved = new Date(issue.updatedAt);
    return sum + (resolved - created);
  }, 0);

  return totalTime / resolved.length / (1000 * 60 * 60 * 24); // days
}

/**
 * Get predictions for multiple locations/categories
 */
export const getBulkPredictions = async (filters = {}) => {
  try {
    const { municipality, category, ward } = filters;
    const query = {};

    if (municipality) query.municipality = municipality;
    if (category) query.category = category;
    if (ward) query.ward = ward;

    const recentIssues = await Issue.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    // Group by location and category
    const groups = {};
    recentIssues.forEach((issue) => {
      const key = `${issue.locationName}_${issue.category}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(issue);
    });

    // Predict for each group
    const predictions = await Promise.all(
      Object.entries(groups).map(async ([key, issues]) => {
        const [location, category] = key.split("_");
        return predictLikelyIssues(location, category);
      })
    );

    return predictions
      .filter((p) => p.likelihood > 25)
      .sort((a, b) => b.likelihood - a.likelihood);
  } catch (error) {
    console.error("Error getting bulk predictions:", error);
    return [];
  }
};

