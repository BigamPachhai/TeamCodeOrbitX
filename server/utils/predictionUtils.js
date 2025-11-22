import Issue from "../models/Issue.js";

/**
 * Predict likely issues based on historical patterns
 * Uses location, time, category patterns to predict potential issues
 */
export const predictLikelyIssues = async (location, category) => {
  try {
    // Find issues matching location and category
    // Use more flexible matching to catch similar locations
    const locationQuery = location ? { locationName: { $regex: location, $options: "i" } } : {};
    const categoryQuery = category ? { category: category } : {};
    
    const query = {
      ...locationQuery,
      ...categoryQuery,
    };

    const issues = await Issue.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    // If no exact matches, try broader search
    let allIssues = issues;
    if (issues.length === 0 && location) {
      // Try partial location match
      const partialMatch = await Issue.find({
        locationName: { $regex: location.split(" ")[0], $options: "i" },
        ...categoryQuery,
      })
        .sort({ createdAt: -1 })
        .limit(30);
      
      if (partialMatch.length > 0) {
        allIssues = partialMatch;
      }
    }

    // If still no issues, try category-only match for predictions
    if (allIssues.length === 0 && category) {
      const categoryIssues = await Issue.find({ category: category })
        .sort({ createdAt: -1 })
        .limit(30);
      
      if (categoryIssues.length > 0) {
        allIssues = categoryIssues;
      }
    }

    // Analyze patterns
    const patterns = {
      seasonal: analyzeSeasonalPatterns(allIssues),
      timeOfDay: analyzeTimePatterns(allIssues),
      frequency: allIssues.length,
      severity: calculateAverageSeverity(allIssues),
      resolutionTime: calculateAverageResolutionTime(allIssues),
    };

    // Predict likelihood (0-100) - improved algorithm
    let likelihood = 0;
    
    // Higher frequency = higher likelihood (more weight)
    if (patterns.frequency >= 10) likelihood += 40;
    else if (patterns.frequency >= 5) likelihood += 30;
    else if (patterns.frequency >= 3) likelihood += 25;
    else if (patterns.frequency >= 2) likelihood += 20;
    else if (patterns.frequency >= 1) likelihood += 15;

    // Recent issues significantly increase likelihood
    const now = new Date();
    const recentIssues = allIssues.filter((issue) => {
      const issueDate = new Date(issue.createdAt);
      const daysDiff = (now - issueDate) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    });
    
    if (recentIssues.length >= 3) likelihood += 30;
    else if (recentIssues.length >= 2) likelihood += 25;
    else if (recentIssues.length >= 1) likelihood += 20;

    // Seasonal patterns
    const currentMonth = new Date().getMonth();
    if (patterns.seasonal[currentMonth] && patterns.seasonal[currentMonth] >= 2) {
      likelihood += 15;
    }

    // Time of day patterns (less weight)
    const currentHour = new Date().getHours();
    if (patterns.timeOfDay[currentHour] && patterns.timeOfDay[currentHour] >= 2) {
      likelihood += 10;
    }

    // Severity boost - high severity issues predict more issues
    if (patterns.severity >= 2.5) likelihood += 15;
    else if (patterns.severity >= 2.0) likelihood += 10;

    // Ensure minimum likelihood if there are any issues
    // Make predictions visible even with very few issues
    if (allIssues.length > 0) {
      // Base likelihood from having at least one issue
      if (likelihood < 25) {
        likelihood = 25 + Math.min(15, allIssues.length * 3); // 25-40 minimum
      }
    }

    // Generate recommendation based on likelihood
    let recommendation = "Low risk - standard procedures";
    if (likelihood >= 70) {
      recommendation = "High risk area - immediate preventive maintenance recommended";
    } else if (likelihood >= 50) {
      recommendation = "Moderate-high risk - preventive maintenance recommended";
    } else if (likelihood >= 30) {
      recommendation = "Moderate risk - regular monitoring advised";
    }

    return {
      likelihood: Math.min(100, Math.max(10, likelihood)), // Ensure 10-100 range
      confidence: likelihood >= 60 ? "high" : likelihood >= 35 ? "medium" : "low",
      predictedIssues: allIssues.slice(0, 5).map((issue) => ({
        category: issue.category,
        location: issue.locationName || location,
        date: issue.createdAt,
        severity: issue.severity || "medium",
      })),
      patterns,
      recommendation: recommendation,
    };
  } catch (error) {
    console.error("Error predicting issues:", error);
    return { 
      likelihood: 0, 
      confidence: "low", 
      error: error.message,
      recommendation: "Unable to generate prediction"
    };
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
    console.log("🔮 Generating bulk predictions...");
    
    const { municipality, category, ward } = filters;
    const query = {};

    if (municipality) query.municipality = municipality;
    if (category) query.category = category;
    if (ward) query.ward = ward;

    // Get all recent issues (increased limit for better predictions)
    const recentIssues = await Issue.find(query)
      .sort({ createdAt: -1 })
      .limit(200);

    console.log(`📊 Found ${recentIssues.length} recent issues for prediction analysis`);

    if (recentIssues.length === 0) {
      console.log("⚠️  No issues found for predictions");
      return [];
    }

    // Group by location and category
    const groups = {};
    recentIssues.forEach((issue) => {
      // Use locationName and category to create unique groups
      if (issue.locationName && issue.category) {
        const key = `${issue.locationName}_${issue.category}`;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(issue);
      }
    });

    console.log(`📍 Found ${Object.keys(groups).length} unique location-category groups`);

    if (Object.keys(groups).length === 0) {
      console.log("⚠️  No valid groups found for predictions");
      return [];
    }

    // Predict for each group
    const predictions = await Promise.all(
      Object.entries(groups).map(async ([key, issues]) => {
        const [location, category] = key.split("_");
        try {
          const prediction = await predictLikelyIssues(location, category);
          
          // Add location and category to prediction for display
          return {
            ...prediction,
            location: location,
            category: category,
          };
        } catch (error) {
          console.error(`Error predicting for ${key}:`, error);
          return null;
        }
      })
    );

    // Filter out null predictions and very low likelihood, then sort
    // Show predictions even with minimal data (threshold lowered to 5)
    const validPredictions = predictions
      .filter((p) => p && p.likelihood !== undefined && p.likelihood >= 5) // Very low threshold to show all predictions
      .sort((a, b) => b.likelihood - a.likelihood)
      .slice(0, 50); // Limit to top 50
    
    // If no predictions above threshold but we have issues, create a generic prediction
    if (validPredictions.length === 0 && recentIssues.length > 0) {
      // Group all issues by category for a category-level prediction
      const categoryGroups = {};
      recentIssues.forEach((issue) => {
        if (issue.category) {
          if (!categoryGroups[issue.category]) {
            categoryGroups[issue.category] = [];
          }
          categoryGroups[issue.category].push(issue);
        }
      });
      
      // Create predictions for each category
      for (const [cat, issues] of Object.entries(categoryGroups)) {
        if (issues.length > 0) {
          const mostRecentLocation = issues[0].locationName || "Multiple locations";
          validPredictions.push({
            location: mostRecentLocation,
            category: cat,
            likelihood: Math.min(100, 25 + issues.length * 5), // Start at 25%, increase with issue count
            confidence: issues.length >= 3 ? "high" : issues.length >= 2 ? "medium" : "low",
            recommendation: `Based on ${issues.length} reported ${cat} issue${issues.length !== 1 ? 's' : ''} - Regular monitoring recommended`,
            predictedIssues: issues.slice(0, 5).map((issue) => ({
              category: issue.category,
              location: issue.locationName,
              date: issue.createdAt,
              severity: issue.severity || "medium",
            })),
            patterns: {
              frequency: issues.length,
            },
          });
        }
      }
      
      // Sort again after adding generic predictions
      validPredictions.sort((a, b) => b.likelihood - a.likelihood);
      console.log(`📊 Created ${validPredictions.length} category-level predictions from ${recentIssues.length} issues`);
    }

    console.log(`✅ Generated ${validPredictions.length} valid predictions`);
    
    return validPredictions;
  } catch (error) {
    console.error("❌ Error getting bulk predictions:", error);
    return [];
  }
};

