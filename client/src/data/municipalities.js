/**
 * Rupandehi District - Municipalities
 * Municipalities in Rupandehi District with their associated wards
 */

export const municipalities = {
  "Butwal": {
    name: "Butwal",
    name_np: "बुटवल",
    wards: ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5", "Ward 6", "Ward 7", "Ward 8"]
  },
  "Tilottama": {
    name: "Tilottama",
    name_np: "तिलोत्तमा",
    wards: ["Ward 5"] // Ward 5 is shared or primarily in Tilottama
  },
  "Devdaha": {
    name: "Devdaha",
    name_np: "देवदह",
    wards: ["Ward 11"]
  },
  "Siddharthanagar (Bhairahawa)": {
    name: "Siddharthanagar (Bhairahawa)",
    name_np: "सिद्धार्थनगर (भैरहवा)",
    wards: ["Ward 9"]
  },
  "Lumbini Sanskritik": {
    name: "Lumbini Sanskritik",
    name_np: "लुम्बिनी सांस्कृतिक",
    wards: ["Ward 10"]
  },
  "Sainamaina": {
    name: "Sainamaina",
    name_np: "सैनामैना",
    wards: ["Ward 12"]
  }
};

/**
 * Get all municipality names
 */
export const getAllMunicipalities = () => {
  return Object.keys(municipalities);
};

/**
 * Get municipality by name
 */
export const getMunicipalityByName = (name) => {
  return municipalities[name];
};

/**
 * Get wards for a municipality
 */
export const getWardsByMunicipality = (municipalityName) => {
  const municipality = municipalities[municipalityName];
  return municipality ? municipality.wards : [];
};

/**
 * Get municipality for a ward
 */
export const getMunicipalityByWard = (wardName) => {
  for (const [munName, munData] of Object.entries(municipalities)) {
    if (munData.wards.includes(wardName)) {
      return munName;
    }
  }
  return null;
};

