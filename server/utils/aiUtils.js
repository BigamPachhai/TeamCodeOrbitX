import genAI from "../config/gemini.js";

/**
 * Analyze image and determine category using Gemini Vision
 */
export const analyzeImageCategory = async (imageUrl) => {
  try {
    if (!genAI || !process.env.GEMINI_API_KEY) {
      console.warn("Gemini API key not configured, returning default category");
      return "Other";
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Analyze this image and determine which category it belongs to. 
    Categories are: "Road Management", "Waste Management", "Electricity", "Water Supply", or "Other".
    
    Look for:
    - Road Management: potholes, damaged roads, broken pavements, road signs issues
    - Waste Management: garbage, trash, waste disposal issues, littering
    - Electricity: broken street lights, electrical hazards, power line issues
    - Water Supply: water leaks, broken pipes, water quality issues, drainage problems
    - Other: anything that doesn't fit the above categories
    
    Respond with ONLY the category name, nothing else.`;

    // Fetch image from URL
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString("base64");
    const mimeType = imageResponse.headers.get("content-type") || "image/jpeg";

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      },
    ]);

    const response = await result.response;
    const category = response.text().trim();

    // Validate and return category
    const validCategories = [
      "Road Management",
      "Waste Management",
      "Electricity",
      "Water Supply",
      "Other",
    ];

    // Check if response contains a valid category
    for (const validCat of validCategories) {
      if (category.toLowerCase().includes(validCat.toLowerCase())) {
        return validCat;
      }
    }

    return "Other";
  } catch (error) {
    console.error("Error analyzing image category with Gemini:", error);
    return "Other";
  }
};

/**
 * Generate description from image using Gemini Vision
 */
export const generateDescriptionAI = async (imageUrl) => {
  try {
    if (!genAI || !process.env.GEMINI_API_KEY) {
      console.warn("Gemini API key not configured, returning default description");
      return "Issue detected in the image. Please provide more details.";
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Analyze this image of a community issue in Rupandehi District, Nepal. 
    Generate a clear, concise description in English (or Nepali if appropriate) that describes:
    1. What the problem is
    2. Where it appears to be located (if visible)
    3. The severity/urgency of the issue
    4. Any relevant details that would help authorities address it
    
    Keep the description professional, factual, and under 200 words. 
    Focus on actionable information that will help resolve the issue.`;

    // Fetch image from URL
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString("base64");
    const mimeType = imageResponse.headers.get("content-type") || "image/jpeg";

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      },
    ]);

    const response = await result.response;
    const description = response.text().trim();

    return description || "Issue detected in the image. Please provide more details.";
  } catch (error) {
    console.error("Error generating description with Gemini:", error);
    return "Issue detected in the image. Please provide more details.";
  }
};

/**
 * Detect duplicate issues using location and image similarity
 */
export const detectDuplicateIssue = async (lat, lng, imageUrl) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("Gemini API key not configured, skipping duplicate detection");
      return false;
    }

    // First, do a geospatial check for nearby issues
    const Issue = (await import("../models/Issue.js")).default;
    
    // Check for issues within 50 meters of this location
    const nearbyIssues = await Issue.find({
      lat: { $gte: lat - 0.0005, $lte: lat + 0.0005 },
      lng: { $gte: lng - 0.0005, $lte: lng + 0.0005 },
      status: { $ne: "resolved" }, // Only check unresolved issues
    }).limit(5);

    if (nearbyIssues.length === 0) {
      return false;
    }

    // If we have nearby issues and an image, use Gemini to compare visual similarity
    if (imageUrl && nearbyIssues.length > 0 && genAI) {
      try {
        // Compare with the most recent nearby issue
        const mostRecentIssue = nearbyIssues[0];
        if (mostRecentIssue.image) {
          const model = genAI.getGenerativeModel({ model: "gemini-pro" });

          // Fetch both images
          const [image1Response, image2Response] = await Promise.all([
            fetch(imageUrl),
            fetch(mostRecentIssue.image),
          ]);

          const [image1Buffer, image2Buffer] = await Promise.all([
            image1Response.arrayBuffer(),
            image2Response.arrayBuffer(),
          ]);

          const image1Base64 = Buffer.from(image1Buffer).toString("base64");
          const image2Base64 = Buffer.from(image2Buffer).toString("base64");
          const mimeType1 = image1Response.headers.get("content-type") || "image/jpeg";
          const mimeType2 = image2Response.headers.get("content-type") || "image/jpeg";

          const prompt = `Compare these two images. Are they showing the same issue/problem? 
          Respond with only "YES" if they are the same issue, or "NO" if they are different issues.`;

          const result = await model.generateContent([
            prompt,
            {
              inlineData: {
                data: image1Base64,
                mimeType: mimeType1,
              },
            },
            {
              inlineData: {
                data: image2Base64,
                mimeType: mimeType2,
              },
            },
          ]);

          const response = await result.response;
          const isDuplicate = response.text().trim().toUpperCase().includes("YES");
          return isDuplicate;
        }
      } catch (error) {
        console.error("Error comparing images with Gemini:", error);
        // Fall back to location-based detection
      }
    }

    // If image comparison fails or no image, return true if there are nearby issues
    return nearbyIssues.length > 0;
  } catch (error) {
    console.error("Error detecting duplicate issue:", error);
    return false;
  }
};

/**
 * Analyze priority level based on image and description
 */
export const suggestPriorityAI = async (imageUrl, description = "") => {
  try {
    if (!genAI || !process.env.GEMINI_API_KEY) {
      return "medium"; // Default priority
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let prompt = `Analyze this community issue and suggest a priority level: "high", "medium", or "low".
    
    Consider:
    - High: Safety hazards, urgent public health issues, blocking infrastructure
    - Medium: Moderate impact on community, needs attention soon
    - Low: Minor issues, cosmetic problems, non-urgent matters
    
    Respond with ONLY one word: "high", "medium", or "low".`;

    const content = [prompt];

    if (imageUrl) {
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      const imageBase64 = Buffer.from(imageBuffer).toString("base64");
      const mimeType = imageResponse.headers.get("content-type") || "image/jpeg";

      content.push({
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      });
    }

    if (description && description.trim().length > 10) {
      prompt = `${prompt}\n\nIssue Description: "${description}"`;
      content[0] = prompt;
    }

    const result = await model.generateContent(content);
    const response = await result.response;
    const priority = response.text().trim().toLowerCase();

    // Validate and return priority
    if (priority.includes("high")) return "high";
    if (priority.includes("low")) return "low";
    return "medium"; // Default
  } catch (error) {
    console.error("Error suggesting priority with AI:", error);
    return "medium";
  }
};

/**
 * Assess severity and urgency of issue
 */
export const assessSeverityAI = async (imageUrl, description = "") => {
  try {
    if (!genAI || !process.env.GEMINI_API_KEY) {
      return {
        severity: "moderate",
        urgency: "medium",
        reasoning: "Unable to analyze. Please review manually.",
      };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let prompt = `Analyze this community issue in Rupandehi, Nepal and assess:
    1. Severity: "critical", "high", "moderate", "low"
    2. Urgency: "immediate", "urgent", "medium", "low"
    3. Brief reasoning (one sentence)
    
    Respond in JSON format:
    {
      "severity": "high|moderate|low|critical",
      "urgency": "immediate|urgent|medium|low",
      "reasoning": "brief explanation"
    }`;

    const content = [prompt];

    if (imageUrl) {
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      const imageBase64 = Buffer.from(imageBuffer).toString("base64");
      const mimeType = imageResponse.headers.get("content-type") || "image/jpeg";

      content.push({
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      });
    }

    if (description && description.trim().length > 10) {
      prompt = `${prompt}\n\nIssue Description: "${description}"`;
      content[0] = prompt;
    }

    const result = await model.generateContent(content);
    const response = await result.response;
    const text = response.text().trim();

    // Try to parse JSON response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const assessment = JSON.parse(jsonMatch[0]);
        return {
          severity: assessment.severity || "moderate",
          urgency: assessment.urgency || "medium",
          reasoning: assessment.reasoning || "AI analysis completed",
        };
      }
    } catch (parseError) {
      console.error("Error parsing AI severity assessment:", parseError);
    }

    // Fallback: extract severity and urgency from text
    const severity = text.toLowerCase().includes("critical") ? "critical" :
                    text.toLowerCase().includes("high") ? "high" :
                    text.toLowerCase().includes("low") ? "low" : "moderate";
    const urgency = text.toLowerCase().includes("immediate") ? "immediate" :
                   text.toLowerCase().includes("urgent") ? "urgent" :
                   text.toLowerCase().includes("low") ? "low" : "medium";

    return {
      severity,
      urgency,
      reasoning: text.substring(0, 200) || "AI analysis completed",
    };
  } catch (error) {
    console.error("Error assessing severity with AI:", error);
    return {
      severity: "moderate",
      urgency: "medium",
      reasoning: "Unable to analyze. Please review manually.",
    };
  }
};

/**
 * Auto-generate tags/keywords from image and description
 */
export const generateTagsAI = async (imageUrl, description = "", category = "") => {
  try {
    if (!genAI || !process.env.GEMINI_API_KEY) {
      return [];
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let prompt = `Analyze this community issue and generate 3-5 relevant tags/keywords.
    Tags should be short (1-2 words), specific, and useful for searching/filtering.
    
    Examples: "pothole", "broken pipe", "garbage dump", "street light", "water leak"
    
    Respond with ONLY a comma-separated list of tags, no other text.`;

    const content = [prompt];

    if (imageUrl) {
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      const imageBase64 = Buffer.from(imageBuffer).toString("base64");
      const mimeType = imageResponse.headers.get("content-type") || "image/jpeg";

      content.push({
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      });
    }

    if (description && description.trim().length > 10) {
      prompt = `${prompt}\n\nIssue Description: "${description}"`;
      content[0] = prompt;
    }

    if (category) {
      prompt = `${prompt}\n\nCategory: "${category}"`;
      content[0] = prompt;
    }

    const result = await model.generateContent(content);
    const response = await result.response;
    const tagsText = response.text().trim();

    // Parse tags from comma-separated string
    const tags = tagsText
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0 && tag.length < 30)
      .slice(0, 5); // Limit to 5 tags

    return tags;
  } catch (error) {
    console.error("Error generating tags with AI:", error);
    return [];
  }
};

/**
 * Predict resolution time based on similar historical issues
 */
export const predictResolutionTime = async (category, priority, description = "") => {
  try {
    if (!genAI || !process.env.GEMINI_API_KEY) {
      return {
        estimatedDays: 7,
        confidence: "low",
        reasoning: "Based on default estimates",
      };
    }

    const Issue = (await import("../models/Issue.js")).default;

    // Find similar resolved issues
    const similarIssues = await Issue.find({
      category: category,
      status: "resolved",
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("createdAt updatedAt");

    const averageResolutionTime =
      similarIssues.length > 0
        ? similarIssues.reduce((acc, issue) => {
            const resolutionTime =
              (new Date(issue.updatedAt) - new Date(issue.createdAt)) /
              (1000 * 60 * 60 * 24); // Convert to days
            return acc + resolutionTime;
          }, 0) / similarIssues.length
        : 7; // Default 7 days if no similar issues

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Based on the following information, predict resolution time:
    - Category: ${category}
    - Priority: ${priority}
    - Description: ${description || "Not provided"}
    - Historical average for similar issues: ${averageResolutionTime.toFixed(1)} days
    
    Consider:
    - High priority issues typically resolve faster
    - Complex issues may take longer
    - Common categories have established workflows
    
    Respond with JSON:
    {
      "estimatedDays": number,
      "confidence": "high|medium|low",
      "reasoning": "brief explanation"
    }`;

    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const text = response.text().trim();

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const prediction = JSON.parse(jsonMatch[0]);
        return {
          estimatedDays: Math.round(prediction.estimatedDays || averageResolutionTime),
          confidence: prediction.confidence || "medium",
          reasoning: prediction.reasoning || "Based on historical data",
        };
      }
    } catch (parseError) {
      console.error("Error parsing AI prediction:", parseError);
    }

    // Fallback calculation
    let estimatedDays = averageResolutionTime;
    if (priority === "high") estimatedDays *= 0.7;
    if (priority === "low") estimatedDays *= 1.3;

    return {
      estimatedDays: Math.round(estimatedDays),
      confidence: similarIssues.length > 5 ? "high" : "medium",
      reasoning: `Based on ${similarIssues.length} similar resolved issues`,
    };
  } catch (error) {
    console.error("Error predicting resolution time:", error);
    return {
      estimatedDays: 7,
      confidence: "low",
      reasoning: "Unable to predict. Based on default estimates.",
    };
  }
};

/**
 * Enhance user-written description with AI
 */
export const enhanceDescriptionAI = async (originalDescription) => {
  try {
    if (!genAI || !process.env.GEMINI_API_KEY || !originalDescription || originalDescription.trim().length < 10) {
      return originalDescription;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Improve and enhance this community issue description while keeping the original meaning and facts intact.
    
    Original Description: "${originalDescription}"
    
    Enhance by:
    - Making it more professional and clear
    - Adding relevant details that might be missing
    - Improving grammar and structure
    - Keeping it concise (under 300 words)
    - Maintaining factual accuracy
    
    Respond with ONLY the enhanced description, no other text.`;

    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const enhanced = response.text().trim();

    return enhanced || originalDescription;
  } catch (error) {
    console.error("Error enhancing description with AI:", error);
    return originalDescription;
  }
};

/**
 * Get multiple category suggestions with confidence scores
 */
export const suggestCategoriesAI = async (imageUrl, description = "") => {
  try {
    if (!genAI || !process.env.GEMINI_API_KEY) {
      return [{ category: "Other", confidence: 0.5 }];
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let prompt = `Analyze this community issue and suggest the top 3 most likely categories from:
    "Road Management", "Waste Management", "Electricity", "Water Supply", "Other"
    
    Respond in JSON array format:
    [
      {"category": "Category Name", "confidence": 0.0-1.0, "reasoning": "brief explanation"},
      ...
    ]
    
    Sort by confidence (highest first).`;

    const content = [prompt];

    if (imageUrl) {
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      const imageBase64 = Buffer.from(imageBuffer).toString("base64");
      const mimeType = imageResponse.headers.get("content-type") || "image/jpeg";

      content.push({
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      });
    }

    if (description && description.trim().length > 10) {
      prompt = `${prompt}\n\nIssue Description: "${description}"`;
      content[0] = prompt;
    }

    const result = await model.generateContent(content);
    const response = await result.response;
    const text = response.text().trim();

    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const suggestions = JSON.parse(jsonMatch[0]);
        const validCategories = [
          "Road Management",
          "Waste Management",
          "Electricity",
          "Water Supply",
          "Other",
        ];

        return suggestions
          .filter((s) => validCategories.includes(s.category))
          .slice(0, 3)
          .map((s) => ({
            category: s.category,
            confidence: Math.min(1, Math.max(0, s.confidence || 0.5)),
            reasoning: s.reasoning || "AI analysis",
          }));
      }
    } catch (parseError) {
      console.error("Error parsing category suggestions:", parseError);
    }

    // Fallback: single category
    const singleCategory = await analyzeImageCategory(imageUrl);
    return [{ category: singleCategory, confidence: 0.7, reasoning: "AI analysis" }];
  } catch (error) {
    console.error("Error suggesting categories with AI:", error);
    return [{ category: "Other", confidence: 0.5 }];
  }
};

/**
 * Find similar issues using AI semantic similarity
 */
export const findSimilarIssues = async (description, category, lat, lng, limit = 5) => {
  try {
    if (!genAI || !process.env.GEMINI_API_KEY || !description || description.trim().length < 10) {
      return [];
    }

    const Issue = (await import("../models/Issue.js")).default;

    // First, get issues with same category and nearby location (within 1km)
    const nearbyIssues = await Issue.find({
      category: category,
      lat: { $gte: lat - 0.01, $lte: lat + 0.01 },
      lng: { $gte: lng - 0.01, $lte: lng + 0.01 },
      status: { $ne: "resolved" }, // Only show unresolved similar issues
    })
      .limit(10)
      .sort({ createdAt: -1 })
      .populate("user", "fullName");

    if (nearbyIssues.length === 0) {
      return [];
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create a prompt to find semantically similar issues
    const issueDescriptions = nearbyIssues.map((issue, idx) => 
      `${idx + 1}. "${issue.description || issue.aiDescription || 'No description'}"`
    ).join('\n');

    const prompt = `Given this new issue description:
"${description}"

Compare it with these existing issues and rank them by similarity (1 = most similar):
${issueDescriptions}

Respond with JSON array of the top ${limit} most similar issue numbers:
{"similar": [1, 3, 5], "reasoning": "brief explanation"}

Only include issues that are actually similar (not just in same location).`;

    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const text = response.text().trim();

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        const similarIndices = analysis.similar || [];
        
        // Map indices to actual issues (convert to 0-based)
        const similarIssues = similarIndices
          .map(idx => nearbyIssues[idx - 1])
          .filter(Boolean)
          .slice(0, limit);

        return similarIssues.map(issue => ({
          id: issue._id,
          description: issue.description || issue.aiDescription,
          category: issue.category,
          locationName: issue.locationName,
          status: issue.status,
          createdAt: issue.createdAt,
          similarity: analysis.reasoning || "Similar issue found",
        }));
      }
    } catch (parseError) {
      console.error("Error parsing similar issues:", parseError);
    }

    // Fallback: return nearby issues of same category
    return nearbyIssues.slice(0, limit).map(issue => ({
      id: issue._id,
      description: issue.description || issue.aiDescription,
      category: issue.category,
      locationName: issue.locationName,
      status: issue.status,
      createdAt: issue.createdAt,
      similarity: "Nearby issue in same category",
    }));
  } catch (error) {
    console.error("Error finding similar issues:", error);
    return [];
  }
};

/**
 * Smart routing - suggest appropriate department for issue
 */
export const suggestDepartment = async (imageUrl, description, category) => {
  try {
    if (!genAI || !process.env.GEMINI_API_KEY) {
      return {
        department: "General Services",
        confidence: 0.5,
        reasoning: "Default routing",
      };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const departments = [
      "Public Works Department",
      "Environmental Services",
      "Electrical Department",
      "Water Supply Department",
      "Road Maintenance",
      "Waste Management",
      "Emergency Services",
      "General Services",
    ];

    let prompt = `Analyze this community issue and suggest the most appropriate department to handle it.
    
    Available departments: ${departments.join(", ")}
    
    Issue Category: ${category || "Not specified"}
    Description: ${description || "Not provided"}
    
    Consider:
    - Category and issue type
    - Urgency and severity
    - Department expertise and responsibilities
    
    Respond with JSON:
    {
      "department": "Department Name",
      "confidence": 0.0-1.0,
      "reasoning": "brief explanation",
      "alternativeDepartments": ["Dept1", "Dept2"]
    }`;

    const content = [prompt];

    if (imageUrl) {
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      const imageBase64 = Buffer.from(imageBuffer).toString("base64");
      const mimeType = imageResponse.headers.get("content-type") || "image/jpeg";

      content.push({
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      });
    }

    const result = await model.generateContent(content);
    const response = await result.response;
    const text = response.text().trim();

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const suggestion = JSON.parse(jsonMatch[0]);
        return {
          department: suggestion.department || "General Services",
          confidence: Math.min(1, Math.max(0, suggestion.confidence || 0.5)),
          reasoning: suggestion.reasoning || "AI analysis",
          alternativeDepartments: suggestion.alternativeDepartments || [],
        };
      }
    } catch (parseError) {
      console.error("Error parsing department suggestion:", parseError);
    }

    // Fallback: category-based routing
    const categoryRouting = {
      "Road Management": "Road Maintenance",
      "Waste Management": "Waste Management",
      "Electricity": "Electrical Department",
      "Water Supply": "Water Supply Department",
    };

    return {
      department: categoryRouting[category] || "General Services",
      confidence: 0.6,
      reasoning: `Based on category: ${category}`,
      alternativeDepartments: [],
    };
  } catch (error) {
    console.error("Error suggesting department:", error);
    return {
      department: "General Services",
      confidence: 0.5,
      reasoning: "Unable to analyze",
      alternativeDepartments: [],
    };
  }
};

/**
 * Analyze sentiment of comments/descriptions
 */
export const analyzeSentiment = async (text) => {
  try {
    if (!genAI || !process.env.GEMINI_API_KEY || !text || text.trim().length < 5) {
      return {
        sentiment: "neutral",
        score: 0,
        emotions: [],
      };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Analyze the sentiment of this text from a community issue reporting platform:
"${text}"

Respond with JSON:
{
  "sentiment": "positive|negative|neutral",
  "score": -1.0 to 1.0,
  "emotions": ["emotion1", "emotion2"],
  "urgency": "high|medium|low"
}`;

    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const textResponse = response.text().trim();

    try {
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return {
          sentiment: analysis.sentiment || "neutral",
          score: Math.min(1, Math.max(-1, analysis.score || 0)),
          emotions: analysis.emotions || [],
          urgency: analysis.urgency || "medium",
        };
      }
    } catch (parseError) {
      console.error("Error parsing sentiment:", parseError);
    }

    // Simple fallback sentiment analysis
    const lowerText = text.toLowerCase();
    const positiveWords = ["good", "great", "excellent", "thanks", "appreciate", "helpful"];
    const negativeWords = ["bad", "terrible", "awful", "urgent", "dangerous", "broken", "failed"];

    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

    let sentiment = "neutral";
    let score = 0;
    if (positiveCount > negativeCount) {
      sentiment = "positive";
      score = 0.5;
    } else if (negativeCount > positiveCount) {
      sentiment = "negative";
      score = -0.5;
    }

    return {
      sentiment,
      score,
      emotions: [],
      urgency: negativeCount > 2 ? "high" : "medium",
    };
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return {
      sentiment: "neutral",
      score: 0,
      emotions: [],
      urgency: "medium",
    };
  }
};

/**
 * Predict community impact of issue
 */
export const predictImpact = async (imageUrl, description, category, locationName) => {
  try {
    if (!genAI || !process.env.GEMINI_API_KEY) {
      return {
        impactLevel: "medium",
        affectedPeople: 50,
        economicImpact: "low",
        reasoning: "Default estimate",
      };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let prompt = `Analyze this community issue in Rupandehi, Nepal and predict its impact:

Category: ${category || "Not specified"}
Location: ${locationName || "Not specified"}
Description: ${description || "Not provided"}

Estimate:
1. Impact Level: "low", "medium", "high", "critical"
2. Estimated number of people affected (0-1000)
3. Economic impact: "low", "medium", "high"
4. Brief reasoning

Respond with JSON:
{
  "impactLevel": "low|medium|high|critical",
  "affectedPeople": number,
  "economicImpact": "low|medium|high",
  "reasoning": "brief explanation"
}`;

    const content = [prompt];

    if (imageUrl) {
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      const imageBase64 = Buffer.from(imageBuffer).toString("base64");
      const mimeType = imageResponse.headers.get("content-type") || "image/jpeg";

      content.push({
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      });
    }

    const result = await model.generateContent(content);
    const response = await result.response;
    const text = response.text().trim();

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const prediction = JSON.parse(jsonMatch[0]);
        return {
          impactLevel: prediction.impactLevel || "medium",
          affectedPeople: Math.min(1000, Math.max(0, prediction.affectedPeople || 50)),
          economicImpact: prediction.economicImpact || "low",
          reasoning: prediction.reasoning || "AI analysis",
        };
      }
    } catch (parseError) {
      console.error("Error parsing impact prediction:", parseError);
    }

    // Fallback
    return {
      impactLevel: "medium",
      affectedPeople: 50,
      economicImpact: "low",
      reasoning: "Based on default estimates",
    };
  } catch (error) {
    console.error("Error predicting impact:", error);
    return {
      impactLevel: "medium",
      affectedPeople: 50,
      economicImpact: "low",
      reasoning: "Unable to predict",
    };
  }
};

/**
 * Detect potential duplicate and return details
 */
export const detectDuplicateWithDetails = async (lat, lng, imageUrl, description) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return {
        isDuplicate: false,
        similarIssues: [],
      };
    }

    const Issue = (await import("../models/Issue.js")).default;

    // Check for issues within 100 meters
    const nearbyIssues = await Issue.find({
      lat: { $gte: lat - 0.001, $lte: lat + 0.001 },
      lng: { $gte: lng - 0.001, $lte: lng + 0.001 },
      status: { $ne: "resolved" },
    })
      .limit(10)
      .sort({ createdAt: -1 })
      .populate("user", "fullName");

    if (nearbyIssues.length === 0) {
      return {
        isDuplicate: false,
        similarIssues: [],
      };
    }

    // If image provided, use AI to compare visual similarity
    if (imageUrl && genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Compare with most recent nearby issue
        const mostRecentIssue = nearbyIssues[0];
        if (mostRecentIssue.image) {
          const [image1Response, image2Response] = await Promise.all([
            fetch(imageUrl),
            fetch(mostRecentIssue.image),
          ]);

          const [image1Buffer, image2Buffer] = await Promise.all([
            image1Response.arrayBuffer(),
            image2Response.arrayBuffer(),
          ]);

          const image1Base64 = Buffer.from(image1Buffer).toString("base64");
          const image2Base64 = Buffer.from(image2Buffer).toString("base64");
          const mimeType1 = image1Response.headers.get("content-type") || "image/jpeg";
          const mimeType2 = image2Response.headers.get("content-type") || "image/jpeg";

          const prompt = `Compare these two images. Are they showing the same issue/problem?
          Also check if the descriptions match:
          New: "${description || 'No description'}"
          Existing: "${mostRecentIssue.description || mostRecentIssue.aiDescription || 'No description'}"
          
          Respond with JSON:
          {
            "isDuplicate": true/false,
            "confidence": 0.0-1.0,
            "reasoning": "brief explanation"
          }`;

          const result = await model.generateContent([
            prompt,
            {
              inlineData: {
                data: image1Base64,
                mimeType: mimeType1,
              },
            },
            {
              inlineData: {
                data: image2Base64,
                mimeType: mimeType2,
              },
            },
          ]);

          const response = await result.response;
          const text = response.text().trim();

          try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const analysis = JSON.parse(jsonMatch[0]);
              return {
                isDuplicate: analysis.isDuplicate === true || analysis.isDuplicate === "true",
                confidence: analysis.confidence || 0.5,
                similarIssues: nearbyIssues.slice(0, 3).map(issue => ({
                  id: issue._id,
                  category: issue.category,
                  description: issue.description || issue.aiDescription,
                  locationName: issue.locationName,
                  createdAt: issue.createdAt,
                  similarity: analysis.reasoning || "Nearby similar issue",
                })),
              };
            }
          } catch (parseError) {
            console.error("Error parsing duplicate detection:", parseError);
          }
        }
      } catch (error) {
        console.error("Error comparing images:", error);
      }
    }

    // Fallback: return nearby issues
    return {
      isDuplicate: nearbyIssues.length > 0,
      confidence: 0.3,
      similarIssues: nearbyIssues.slice(0, 3).map(issue => ({
        id: issue._id,
        category: issue.category,
        description: issue.description || issue.aiDescription,
        locationName: issue.locationName,
        createdAt: issue.createdAt,
        similarity: "Nearby issue found",
      })),
    };
  } catch (error) {
    console.error("Error detecting duplicate:", error);
    return {
      isDuplicate: false,
      similarIssues: [],
    };
  }
};

/**
 * AI-powered budget allocation for issues
 * Analyzes issue details and historical data to automatically determine budget allocation
 */
export const allocateBudgetAI = async (issue, historicalBudgets = []) => {
  try {
    if (!genAI || !process.env.GEMINI_API_KEY) {
      // Fallback: use simple rule-based allocation
      return {
        allocatedAmount: 50000, // Default amount in NPR
        estimatedCost: 45000,
        confidence: 0.5,
        reasoning: "AI not available. Using default budget allocation.",
        factors: {
          category: issue.category || "General",
          priority: issue.severity || "medium",
        },
      };
    }

    const Issue = (await import("../models/Issue.js")).default;
    const Budget = (await import("../models/Budget.js")).default;

    // Get historical budget data for similar issues
    const similarResolvedIssues = await Issue.find({
      category: issue.category,
      status: "resolved",
    })
      .limit(10)
      .sort({ createdAt: -1 });

    const historicalData = await Budget.find({
      category: issue.category,
      status: { $in: ["completed", "in-progress"] },
    })
      .limit(10)
      .sort({ createdAt: -1 });

    // Calculate average historical costs
    const avgAllocated =
      historicalData.length > 0
        ? historicalData.reduce((sum, b) => sum + (b.allocatedAmount || 0), 0) /
          historicalData.length
        : 0;

    const avgSpent =
      historicalData.length > 0
        ? historicalData.reduce((sum, b) => sum + (b.spentAmount || 0), 0) /
          historicalData.length
        : 0;

    const avgResolutionTime =
      similarResolvedIssues.length > 0
        ? similarResolvedIssues.reduce((sum, issue) => {
            const time =
              (new Date(issue.updatedAt) - new Date(issue.createdAt)) /
              (1000 * 60 * 60 * 24); // Days
            return sum + time;
          }, 0) / similarResolvedIssues.length
        : 7;

    // Use gemini-pro-vision if image is available, otherwise gemini-pro
    const modelName = issue.image ? "gemini-pro-vision" : "gemini-pro";
    const model = genAI.getGenerativeModel({ model: modelName });

    // Prepare context for AI
    const description = issue.description || issue.aiDescription || "Not provided";
    const category = issue.category || "General";
    const priority = issue.severity || "medium";
    const location = issue.locationName || issue.municipality || "Not specified";
    const ward = issue.ward || "Not specified";
    
    // Calculate additional statistics
    const minAllocated = historicalData.length > 0 
      ? Math.min(...historicalData.map(b => b.allocatedAmount || 0))
      : 0;
    const maxAllocated = historicalData.length > 0 
      ? Math.max(...historicalData.map(b => b.allocatedAmount || 0))
      : 0;
    const medianAllocated = historicalData.length > 0
      ? historicalData.sort((a, b) => (a.allocatedAmount || 0) - (b.allocatedAmount || 0))[
          Math.floor(historicalData.length / 2)
        ]?.allocatedAmount || 0
      : 0;

    console.log(`🤖 AI Budget Analysis for Issue:`);
    console.log(`   Category: ${category}`);
    console.log(`   Priority: ${priority}`);
    console.log(`   Location: ${location} (Ward: ${ward})`);
    console.log(`   Historical Data: ${historicalData.length} similar budgets`);
    console.log(`   Historical Avg: NPR ${avgAllocated.toFixed(0)}, Median: NPR ${medianAllocated.toFixed(0)}`);

    const prompt = `You are an expert budget analyst for municipal infrastructure management in Nepal, specifically for Rupandehi District. Your task is to analyze this issue and determine an accurate budget allocation in Nepalese Rupees (NPR).

=== ISSUE DETAILS ===
Category: ${category}
Priority/Severity: ${priority}
Location: ${location}
Ward: ${ward}
Description: ${description.substring(0, 800)}
${issue.image ? "📷 Image: Available - Analyze the image to assess the actual damage/issue severity visually" : ""}

=== HISTORICAL BUDGET DATA (${category} Category) ===
- Number of similar cases analyzed: ${historicalData.length}
- Average allocated budget: NPR ${avgAllocated.toFixed(0)}
- Average actual spent: NPR ${avgSpent.toFixed(0)}
- Minimum allocated: NPR ${minAllocated.toFixed(0)}
- Maximum allocated: NPR ${maxAllocated.toFixed(0)}
- Median allocated: NPR ${medianAllocated.toFixed(0)}
- Average resolution time: ${avgResolutionTime.toFixed(1)} days
- Budget efficiency: ${avgAllocated > 0 ? ((avgSpent / avgAllocated) * 100).toFixed(1) : 0}% (spent vs allocated)

=== NEPAL MUNICIPAL BUDGET GUIDELINES ===
Based on typical costs in Nepal (Rupandehi District context):

SMALL ISSUES (Minor repairs, cosmetic fixes):
- Examples: Small potholes, minor leaks, single broken light, small garbage pile
- Budget Range: NPR 5,000 - 25,000
- Typical: NPR 15,000

MEDIUM ISSUES (Moderate infrastructure work):
- Examples: Medium road repairs, pipe replacements, multiple lights, waste collection setup
- Budget Range: NPR 25,000 - 100,000
- Typical: NPR 60,000

LARGE ISSUES (Major repairs, significant infrastructure):
- Examples: Major road reconstruction, large pipe network, electrical system upgrade, major cleanup
- Budget Range: NPR 100,000 - 500,000
- Typical: NPR 250,000

CRITICAL ISSUES (Safety hazards, major infrastructure):
- Examples: Dangerous road conditions, major water supply failure, electrical hazards, large-scale waste management
- Budget Range: NPR 500,000 - 2,000,000+
- Typical: NPR 1,000,000

=== COST BREAKDOWN CONSIDERATIONS ===
1. MATERIAL COSTS (Nepal market rates):
   - Cement: NPR 800-1000 per bag
   - Steel/Rebar: NPR 80-100 per kg
   - Sand/Gravel: NPR 1,500-2,500 per cubic meter
   - Pipes (water): NPR 200-500 per meter
   - Electrical materials: Varies by type
   - Labor: NPR 800-1,500 per day per worker

2. LABOR COSTS:
   - Skilled worker: NPR 1,200-2,000/day
   - Unskilled worker: NPR 800-1,200/day
   - Supervisor: NPR 2,000-3,000/day
   - Typical team: 2-5 workers for 1-7 days

3. EQUIPMENT & MACHINERY:
   - Excavator rental: NPR 8,000-15,000/day
   - Truck/Transport: NPR 3,000-6,000/day
   - Specialized equipment: As needed

4. CONTINGENCY & OVERHEAD:
   - Standard contingency: 10-15% of estimated cost
   - Administrative overhead: 5-8%
   - Total buffer: 15-20% above base estimate

=== ANALYSIS REQUIREMENTS ===
Carefully analyze:
1. SEVERITY ASSESSMENT: How critical is this issue? (critical/high/moderate/low)
   - Safety hazards = critical/high
   - Service disruption = high/moderate
   - Cosmetic/minor = low

2. COMPLEXITY ANALYSIS: How complex is the work? (simple/moderate/complex/very-complex)
   - Simple: Single point fix, minimal materials
   - Moderate: Multi-step process, standard materials
   - Complex: Requires planning, multiple trades, coordination
   - Very Complex: Major infrastructure, engineering required

3. SCOPE ESTIMATION: Based on description${issue.image ? " and image analysis" : ""}, estimate:
   - Area/Size affected
   - Materials needed
   - Labor required
   - Time to complete

4. URGENCY FACTOR: How urgent is resolution? (immediate/high/medium/low)
   - Immediate: Safety hazard, complete service failure
   - High: Significant impact, many affected
   - Medium: Moderate impact
   - Low: Minor inconvenience

5. HISTORICAL COMPARISON: Compare with similar past issues
   - Use historical average as baseline
   - Adjust based on current issue specifics
   - Consider if current issue is more/less severe

6. LOCATION FACTORS:
   - Urban areas: Higher labor/material costs
   - Rural areas: May need transport, different rates
   - Accessibility: Hard-to-reach areas cost more

=== RESPONSE FORMAT ===
Respond with ONLY valid JSON (no markdown, no code blocks, no explanations outside JSON):

{
  "allocatedAmount": <number in NPR, total budget including contingency>,
  "estimatedCost": <number in NPR, expected actual cost before contingency>,
  "confidence": <0.0-1.0, confidence level in this allocation>,
  "reasoning": "<detailed explanation of your analysis, including: why this amount, what factors influenced it, how it compares to historical data, what the budget covers>",
  "breakdown": {
    "materials": <estimated material cost in NPR>,
    "labor": <estimated labor cost in NPR>,
    "equipment": <estimated equipment/transport cost in NPR>,
    "contingency": <contingency buffer in NPR>
  },
  "factors": {
    "severity": "critical|high|moderate|low",
    "complexity": "simple|moderate|complex|very-complex",
    "urgency": "immediate|high|medium|low",
    "estimatedTime": <number of days to resolve>,
    "teamSize": <estimated number of workers needed>,
    "scope": "<brief description of work scope>"
  }
}

IMPORTANT: 
- allocatedAmount should be 15-20% higher than estimatedCost (includes contingency)
- Be realistic based on Nepal market rates
- If image is provided, use visual analysis to assess actual damage
- Provide detailed reasoning explaining your calculation`;

    const content = [prompt];

    // Include image if available for visual analysis
    if (issue.image) {
      try {
        const imageResponse = await fetch(issue.image);
        const imageBuffer = await imageResponse.arrayBuffer();
        const imageBase64 = Buffer.from(imageBuffer).toString("base64");
        const mimeType = imageResponse.headers.get("content-type") || "image/jpeg";

        content.push({
          inlineData: {
            data: imageBase64,
            mimeType: mimeType,
          },
        });
      } catch (imageError) {
        console.error("Error loading image for budget allocation:", imageError);
      }
    }

    console.log(`🤖 Sending request to Gemini AI (model: ${modelName})...`);
    const result = await model.generateContent(content);
    const response = await result.response;
    const text = response.text().trim();

    console.log(`🤖 AI Raw Response (first 500 chars):`, text.substring(0, 500));

    // Parse JSON response
    try {
      // Try to extract JSON from response (handle markdown code blocks or plain JSON)
      let jsonText = text;
      
      // Remove markdown code blocks if present
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Find JSON object
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const allocation = JSON.parse(jsonMatch[0]);

        console.log(`🤖 Parsed AI Allocation:`, {
          allocatedAmount: allocation.allocatedAmount,
          estimatedCost: allocation.estimatedCost,
          confidence: allocation.confidence,
          breakdown: allocation.breakdown,
          factors: allocation.factors
        });

        // Validate and sanitize amounts
        const allocatedAmount = Math.max(1000, Math.min(5000000, allocation.allocatedAmount || 50000));
        const estimatedCost = Math.max(1000, Math.min(5000000, allocation.estimatedCost || allocatedAmount * 0.85));

        // Ensure allocatedAmount includes contingency (should be >= estimatedCost)
        const finalAllocated = Math.max(allocatedAmount, estimatedCost * 1.1);

        const result = {
          allocatedAmount: Math.round(finalAllocated),
          estimatedCost: Math.round(estimatedCost),
          confidence: Math.min(1, Math.max(0, allocation.confidence || 0.7)),
          reasoning: allocation.reasoning || "AI-allocated based on issue analysis",
          breakdown: allocation.breakdown || {
            materials: Math.round(estimatedCost * 0.4),
            labor: Math.round(estimatedCost * 0.4),
            equipment: Math.round(estimatedCost * 0.15),
            contingency: Math.round(finalAllocated - estimatedCost),
          },
          factors: allocation.factors || {
            severity: priority,
            complexity: "moderate",
            urgency: priority === "critical" ? "immediate" : "medium",
            estimatedTime: avgResolutionTime,
            teamSize: 2,
            scope: "Standard issue resolution",
          },
        };

        console.log(`✅ AI Budget Allocation Result:`);
        console.log(`   Allocated: NPR ${result.allocatedAmount.toLocaleString()}`);
        console.log(`   Estimated Cost: NPR ${result.estimatedCost.toLocaleString()}`);
        console.log(`   Confidence: ${(result.confidence * 100).toFixed(1)}%`);
        console.log(`   Reasoning: ${result.reasoning.substring(0, 200)}...`);
        console.log(`   Breakdown:`, result.breakdown);
        console.log(`   Factors:`, result.factors);

        return result;
      } else {
        console.warn("⚠️  No JSON found in AI response, using fallback calculation");
      }
    } catch (parseError) {
      console.error("❌ Error parsing AI budget allocation:", parseError);
      console.error("Response text:", text.substring(0, 500));
    }

    // Fallback calculation based on priority and category
    let baseAmount = 50000; // Base amount in NPR

    // Adjust based on priority
    const priorityMultiplier = {
      critical: 3.0,
      high: 2.0,
      moderate: 1.0,
      low: 0.6,
    };
    baseAmount *= priorityMultiplier[priority] || 1.0;

    // Adjust based on category complexity
    const categoryMultiplier = {
      "Road Management": 1.5,
      "Water Supply": 1.3,
      "Electricity": 1.2,
      "Waste Management": 0.9,
      Other: 1.0,
    };
    baseAmount *= categoryMultiplier[category] || 1.0;

    // Use historical average if available
    if (avgAllocated > 0) {
      baseAmount = (baseAmount + avgAllocated) / 2;
    }

    return {
      allocatedAmount: Math.round(baseAmount),
      estimatedCost: Math.round(baseAmount * 0.9),
      confidence: historicalData.length > 0 ? 0.7 : 0.5,
      reasoning: `Based on priority (${priority}), category (${category}), and ${historicalData.length} historical cases`,
      factors: {
        severity: priority,
        complexity: "moderate",
        urgency: priority === "critical" ? "immediate" : "medium",
        estimatedTime: Math.round(avgResolutionTime),
      },
    };
  } catch (error) {
    console.error("Error allocating budget with AI:", error);
    
    // Safe fallback
    return {
      allocatedAmount: 50000,
      estimatedCost: 45000,
      confidence: 0.3,
      reasoning: "Error in AI allocation. Using default budget. Please review manually.",
      factors: {
        severity: issue.severity || "medium",
        complexity: "unknown",
        urgency: "medium",
        estimatedTime: 7,
      },
    };
  }
};
