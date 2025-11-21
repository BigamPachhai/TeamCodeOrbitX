/**
 * Issue Categories and Department Mapping
 * Categories: Road Management, Waste, Electricity, Water, Other
 */

export const categories = [
  "Road Management",
  "Waste",
  "Electricity",
  "Water",
  "Other"
];

/**
 * Department mapping for each category
 */
export const categoryDepartments = {
  "Road Management": "Road Department",
  "Waste": "Waste Management Department",
  "Electricity": "Electricity Department",
  "Water": "Water Supply Department",
  "Other": "General Administration"
};

/**
 * Get department for a category
 */
export const getDepartmentForCategory = (category) => {
  return categoryDepartments[category] || "General Administration";
};

/**
 * Get all departments
 */
export const getAllDepartments = () => {
  return Object.values(categoryDepartments);
};

