/**
 * Rupandehi District - Ward Offices
 * Rupandehi has multiple municipalities with wards
 */

export const rupandehiWards = {
  "Ward 1": {
    name: "Ward 1",
    office: { name: "Ward 1 Office, Butwal", lat: 27.6878, lng: 83.4489 },
    locations: [
      { name: "Traffic Chowk, Butwal", lat: 27.6878, lng: 83.4489 },
      { name: "Golpark, Butwal", lat: 27.6823, lng: 83.4534 },
      { name: "Kalikanagar, Butwal", lat: 27.6945, lng: 83.4367 },
    ]
  },
  "Ward 2": {
    name: "Ward 2",
    office: { name: "Ward 2 Office, Butwal", lat: 27.6956, lng: 83.4601 },
    locations: [
      { name: "Butwal Bus Park", lat: 27.6956, lng: 83.4601 },
      { name: "Milanchowk, Butwal", lat: 27.6701, lng: 83.4623 },
      { name: "Butwal Multiple Campus", lat: 27.6947, lng: 83.4489 },
    ]
  },
  "Ward 3": {
    name: "Ward 3",
    office: { name: "Ward 3 Office, Butwal", lat: 27.6842, lng: 83.4323 },
    locations: [
      { name: "District Administration Office", lat: 27.6842, lng: 83.4323 },
      { name: "District Coordination Committee", lat: 27.6856, lng: 83.4298 },
      { name: "Land Revenue Office", lat: 27.6835, lng: 83.431 },
    ]
  },
  "Ward 4": {
    name: "Ward 4",
    office: { name: "Ward 4 Office, Butwal", lat: 27.6923, lng: 83.4489 },
    locations: [
      { name: "Lumbini Provincial Hospital", lat: 27.6923, lng: 83.4489 },
      { name: "Butwal Hospital", lat: 27.6934, lng: 83.4512 },
      { name: "Bright Star Hospital", lat: 27.6889, lng: 83.4423 },
    ]
  },
  "Ward 5": {
    name: "Ward 5",
    office: { name: "Ward 5 Office, Butwal", lat: 27.6789, lng: 83.4534 },
    locations: [
      { name: "Tilottama Municipality Office", lat: 27.6789, lng: 83.4534 },
      { name: "Tilottama Campus", lat: 27.6778, lng: 83.4523 },
      { name: "Manimukunda Park", lat: 27.6634, lng: 83.4967 },
    ]
  },
  "Ward 6": {
    name: "Ward 6",
    office: { name: "Ward 6 Office, Butwal", lat: 27.7123, lng: 83.4823 },
    locations: [
      { name: "Siddhababa Temple", lat: 27.7123, lng: 83.4823 },
      { name: "Tinau Mahadev Temple", lat: 27.689, lng: 83.4267 },
      { name: "Tinau Park", lat: 27.6912, lng: 83.4289 },
    ]
  },
  "Ward 7": {
    name: "Ward 7",
    office: { name: "Ward 7 Office, Butwal", lat: 27.6756, lng: 83.5012 },
    locations: [
      { name: "Manigram", lat: 27.6756, lng: 83.5012 },
      { name: "Manigram Market", lat: 27.6756, lng: 83.5012 },
      { name: "Manigram Industrial Area", lat: 27.6745, lng: 83.5023 },
    ]
  },
  "Ward 8": {
    name: "Ward 8",
    office: { name: "Ward 8 Office, Butwal", lat: 27.6589, lng: 83.4789 },
    locations: [
      { name: "Shankarnagar", lat: 27.6589, lng: 83.4789 },
      { name: "Shankarnagar Market", lat: 27.6589, lng: 83.4789 },
      { name: "Nayabasti", lat: 27.6812, lng: 83.4612 },
    ]
  },
  "Ward 9": {
    name: "Ward 9",
    office: { name: "Ward 9 Office, Bhairahawa", lat: 27.5089, lng: 83.4456 },
    locations: [
      { name: "Bhairahawa (Siddharthanagar)", lat: 27.5089, lng: 83.4456 },
      { name: "Universal College of Medical Sciences", lat: 27.5234, lng: 83.4567 },
      { name: "Bhairahawa Industrial Estate", lat: 27.5234, lng: 83.4789 },
    ]
  },
  "Ward 10": {
    name: "Ward 10",
    office: { name: "Ward 10 Office, Lumbini", lat: 27.4833, lng: 83.2767 },
    locations: [
      { name: "Lumbini - Maya Devi Temple", lat: 27.4833, lng: 83.2767 },
      { name: "Lumbini Sanskritik Municipality", lat: 27.4901, lng: 83.2823 },
      { name: "Bhairahawa Garden", lat: 27.5089, lng: 83.4456 },
    ]
  },
  "Ward 11": {
    name: "Ward 11",
    office: { name: "Ward 11 Office, Devdaha", lat: 27.5934, lng: 83.4812 },
    locations: [
      { name: "Devdaha (Buddha's Birthplace)", lat: 27.5934, lng: 83.4812 },
      { name: "Devdaha Municipality Office", lat: 27.5934, lng: 83.4812 },
      { name: "Devdaha Public School", lat: 27.5912, lng: 83.4801 },
    ]
  },
  "Ward 12": {
    name: "Ward 12",
    office: { name: "Ward 12 Office, Sainamaina", lat: 27.5667, lng: 83.3234 },
    locations: [
      { name: "Sainamaina Municipality Office", lat: 27.5667, lng: 83.3234 },
      { name: "Amarpath", lat: 27.6689, lng: 83.4701 },
      { name: "Devinagar", lat: 27.6734, lng: 83.4823 },
    ]
  },
};

/**
 * Get all ward names
 */
export const getAllWards = () => {
  return Object.keys(rupandehiWards);
};

/**
 * Get ward by name
 */
export const getWardByName = (wardName) => {
  return rupandehiWards[wardName];
};

/**
 * Get all locations for a ward
 */
export const getLocationsByWard = (wardName) => {
  const ward = rupandehiWards[wardName];
  return ward ? [ward.office, ...ward.locations] : [];
};

/**
 * Get all locations as flat array
 */
export const getAllWardLocations = () => {
  return Object.values(rupandehiWards).flatMap(ward => [
    ward.office,
    ...ward.locations
  ]);
};

