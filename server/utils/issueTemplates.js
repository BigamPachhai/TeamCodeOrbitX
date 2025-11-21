/**
 * Issue templates for common issue types
 */
export const issueTemplates = {
  "Road Management": {
    title: "Road Issue Template",
    description: `Road Issue Details:

Location: [Specific location/street name]
Issue Type: [ ] Pothole [ ] Crack [ ] Broken pavement [ ] Missing road sign
Severity: [ ] Low [ ] Medium [ ] High [ ] Critical

Description:
- Size/Dimensions: _______________
- Traffic Impact: _______________
- Safety Concerns: _______________
- Additional Notes: _______________

Expected Action: Please repair/address this road issue for community safety.`,
    category: "Road Management",
  },
  "Waste Management": {
    title: "Waste Management Issue Template",
    description: `Waste Management Issue Details:

Location: [Specific location]
Issue Type: [ ] Garbage dump [ ] Overflowing bin [ ] Littered area [ ] Broken container
Severity: [ ] Low [ ] Medium [ ] High [ ] Critical

Description:
- Type of waste: _______________
- Volume/Quantity: _______________
- Health/Safety Impact: _______________
- Duration: _______________
- Additional Notes: _______________

Expected Action: Please address waste management issue to maintain cleanliness.`,
    category: "Waste Management",
  },
  "Electricity": {
    title: "Electrical Issue Template",
    description: `Electrical Issue Details:

Location: [Specific location]
Issue Type: [ ] Broken street light [ ] Exposed wires [ ] Electrical hazard [ ] Power outage area
Severity: [ ] Low [ ] Medium [ ] High [ ] Critical ⚠️ (URGENT if safety hazard)

Description:
- Safety Hazard: [ ] Yes [ ] No
- Affected Area: _______________
- Number of lights/units affected: _______________
- Additional Notes: _______________

Expected Action: Please address electrical issue urgently for public safety.`,
    category: "Electricity",
  },
  "Water Supply": {
    title: "Water Supply Issue Template",
    description: `Water Supply Issue Details:

Location: [Specific location]
Issue Type: [ ] Leak/breakage [ ] No water supply [ ] Contaminated water [ ] Low pressure
Severity: [ ] Low [ ] Medium [ ] High [ ] Critical

Description:
- Duration of issue: _______________
- Number of households affected: _______________
- Water quality concerns: _______________
- Additional Notes: _______________

Expected Action: Please restore water supply and address water quality concerns.`,
    category: "Water Supply",
  },
  "Other": {
    title: "General Issue Template",
    description: `Community Issue Details:

Location: [Specific location]
Category: [Select category]
Severity: [ ] Low [ ] Medium [ ] High [ ] Critical

Description:
- Issue Type: _______________
- Impact on Community: _______________
- Duration: _______________
- Additional Notes: _______________

Expected Action: Please address this community issue.`,
    category: "Other",
  },
};

export const getTemplate = (category) => {
  return issueTemplates[category] || issueTemplates["Other"];
};

export const getAllTemplates = () => {
  return Object.values(issueTemplates);
};

