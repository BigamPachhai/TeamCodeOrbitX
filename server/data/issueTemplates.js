/**
 * Issue Templates for Quick Reporting
 * Pre-filled templates for common issues in Nepal
 */

export const issueTemplates = [
  {
    id: "road_pothole",
    name: "Road Pothole",
    name_np: "सडकको खाडल",
    category: "Road Management",
    description: "Large pothole causing vehicle damage and traffic issues. Location needs immediate repair.",
    description_np: "ठूलो खाडलले गाडीको क्षति र यातायात समस्या उत्पन्न गर्दै। यो स्थान तुरुन्त मर्मतको आवश्यकता छ।",
    keywords: ["pothole", "road", "damage", "खाडल", "सडक"],
  },
  {
    id: "road_repair",
    name: "Road Needs Repair",
    name_np: "सडक मर्मत आवश्यक",
    category: "Road Management",
    description: "Road surface is damaged and requires repair work.",
    description_np: "सडकको सतह क्षतिग्रस्त छ र मर्मत कार्यको आवश्यकता छ।",
    keywords: ["road", "repair", "damage", "सडक", "मर्मत"],
  },
  {
    id: "waste_dumping",
    name: "Illegal Waste Dumping",
    name_np: "अवैध कचरा फाल्ने",
    category: "Waste",
    description: "Garbage and waste being dumped illegally in this area. Needs cleanup and monitoring.",
    description_np: "यस क्षेत्रमा कचरा र अपशिष्ट अवैध रूपमा फाल्दै। सफाइ र निगरानी आवश्यक छ।",
    keywords: ["waste", "garbage", "dumping", "कचरा"],
  },
  {
    id: "waste_collection",
    name: "Waste Collection Needed",
    name_np: "कचरा संकलन आवश्यक",
    category: "Waste",
    description: "Accumulated waste needs to be collected from this location.",
    description_np: "यस स्थानबाट संकलित कचरा संकलन गर्नुपर्छ।",
    keywords: ["waste", "collection", "garbage", "कचरा"],
  },
  {
    id: "electricity_outage",
    name: "Power Outage",
    name_np: "बिजुली बिच्छेदन",
    category: "Electricity",
    description: "Power outage in this area. Electricity supply needs to be restored.",
    description_np: "यस क्षेत्रमा बिजुली बिच्छेदन। बिजुली आपूर्ति पुनः स्थापित गर्नुपर्छ।",
    keywords: ["electricity", "power", "outage", "बिजुली"],
  },
  {
    id: "electricity_pole",
    name: "Damaged Electricity Pole",
    name_np: "क्षतिग्रस्त बिजुली खम्बा",
    category: "Electricity",
    description: "Electricity pole is damaged and poses safety risk. Needs immediate attention.",
    description_np: "बिजुली खम्बा क्षतिग्रस्त छ र सुरक्षा जोखिम उत्पन्न गर्दै। तुरुन्त ध्यान आवश्यक छ।",
    keywords: ["electricity", "pole", "damage", "बिजुली", "खम्बा"],
  },
  {
    id: "water_leak",
    name: "Water Pipe Leak",
    name_np: "पानीको पाइप चुहावट",
    category: "Water",
    description: "Water pipe is leaking, causing water waste and potential damage.",
    description_np: "पानीको पाइप चुहाउँदैछ, पानीको बर्बादी र सम्भावित क्षति उत्पन्न गर्दै।",
    keywords: ["water", "leak", "pipe", "पानी"],
  },
  {
    id: "water_supply",
    name: "No Water Supply",
    name_np: "पानी आपूर्ति छैन",
    category: "Water",
    description: "No water supply in this area. Water service needs to be restored.",
    description_np: "यस क्षेत्रमा पानी आपूर्ति छैन। पानी सेवा पुनः स्थापित गर्नुपर्छ।",
    keywords: ["water", "supply", "पानी"],
  },
  {
    id: "street_light",
    name: "Broken Street Light",
    name_np: "भाँचिएको सडक बत्ती",
    category: "Other",
    description: "Street light is not working. Needs repair or replacement.",
    description_np: "सडक बत्ती काम गरिरहेको छैन। मर्मत वा प्रतिस्थापन आवश्यक छ।",
    keywords: ["light", "street", "broken", "बत्ती"],
  },
  {
    id: "public_toilet",
    name: "Public Toilet Issue",
    name_np: "सार्वजनिक शौचालय समस्या",
    category: "Other",
    description: "Public toilet facility needs maintenance or repair.",
    description_np: "सार्वजनिक शौचालय सुविधामा मर्मत वा मर्मतको आवश्यकता छ।",
    keywords: ["toilet", "public", "maintenance", "शौचालय"],
  },
];

/**
 * Get template by ID
 */
export const getTemplateById = (id) => {
  return issueTemplates.find((t) => t.id === id);
};

/**
 * Get templates by category
 */
export const getTemplatesByCategory = (category) => {
  return issueTemplates.filter((t) => t.category === category);
};

/**
 * Search templates by keyword
 */
export const searchTemplates = (keyword) => {
  const lowerKeyword = keyword.toLowerCase();
  return issueTemplates.filter(
    (t) =>
      t.name.toLowerCase().includes(lowerKeyword) ||
      t.name_np.includes(keyword) ||
      t.keywords.some((k) => k.toLowerCase().includes(lowerKeyword))
  );
};

