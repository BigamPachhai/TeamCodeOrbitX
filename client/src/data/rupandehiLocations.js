// Rupandehi District, Nepal - Important Locations by Category

export const rupandehiLocations = {
  "📍 Main Locations (Popular)": [
    { name: "Traffic Chowk, Butwal", lat: 27.6878, lng: 83.4489 },
    { name: "Golpark, Butwal", lat: 27.6823, lng: 83.4534 },
    { name: "Butwal Bus Park", lat: 27.6956, lng: 83.4601 },
    { name: "Milanchowk, Butwal", lat: 27.6701, lng: 83.4623 },
    { name: "Kalikanagar, Butwal", lat: 27.6945, lng: 83.4367 },
    { name: "Bhairahawa (Siddharthanagar)", lat: 27.5089, lng: 83.4456 },
    { name: "Lumbini - Maya Devi Temple", lat: 27.4833, lng: 83.2767 },
    { name: "Butwal Multiple Campus", lat: 27.6947, lng: 83.4489 },
    { name: "Lumbini Provincial Hospital", lat: 27.6923, lng: 83.4489 },
    { name: "Manimukunda Park", lat: 27.6634, lng: 83.4967 },
    { name: "Siddhababa Temple", lat: 27.7123, lng: 83.4823 },
    { name: "Tilottama Municipality", lat: 27.6789, lng: 83.4534 },
    { name: "Devdaha (Buddha's Birthplace)", lat: 27.5934, lng: 83.4812 },
    { name: "Manigram", lat: 27.6756, lng: 83.5012 },
    { name: "Shankarnagar", lat: 27.6589, lng: 83.4789 },
  ],

  "Government Offices": [
    { name: "District Administration Office", lat: 27.6842, lng: 83.4323 },
    { name: "District Coordination Committee", lat: 27.6856, lng: 83.4298 },
    { name: "Land Revenue Office", lat: 27.6835, lng: 83.431 },
    { name: "District Police Office", lat: 27.689, lng: 83.435 },
    { name: "District Health Office", lat: 27.6801, lng: 83.4285 },
  ],

  "Educational Institutions": [
    { name: "Butwal Multiple Campus", lat: 27.6947, lng: 83.4489 },
    { name: "Kalika Secondary School", lat: 27.6875, lng: 83.4412 },
    { name: "Buddha Jyoti Secondary School", lat: 27.6923, lng: 83.4356 },
    { name: "Devdaha Public School", lat: 27.5912, lng: 83.4801 },
    { name: "Tilottama Campus", lat: 27.6778, lng: 83.4523 },
  ],

  "Healthcare Facilities": [
    { name: "Lumbini Provincial Hospital", lat: 27.6923, lng: 83.4489 },
    { name: "Butwal Hospital", lat: 27.6934, lng: 83.4512 },
    {
      name: "Universal College of Medical Sciences",
      lat: 27.5234,
      lng: 83.4567,
    },
    { name: "Bright Star Hospital", lat: 27.6889, lng: 83.4423 },
    { name: "Medicare National Hospital", lat: 27.6845, lng: 83.4467 },
  ],

  "Transportation Hubs": [
    { name: "Butwal Bus Park", lat: 27.6956, lng: 83.4601 },
    { name: "Traffic Chowk", lat: 27.6878, lng: 83.4489 },
    { name: "Golpark", lat: 27.6823, lng: 83.4534 },
    { name: "Milanchowk", lat: 27.6701, lng: 83.4623 },
    { name: "Kalikanagar Chowk", lat: 27.6934, lng: 83.4378 },
  ],

  "Markets & Commercial Areas": [
    { name: "Traffic Chowk Market", lat: 27.6867, lng: 83.4501 },
    { name: "Golpark Market Area", lat: 27.6812, lng: 83.4545 },
    { name: "Butwal Bazaar", lat: 27.6901, lng: 83.4456 },
    { name: "Manigram Market", lat: 27.6756, lng: 83.5012 },
    { name: "Shankarnagar Market", lat: 27.6589, lng: 83.4789 },
  ],

  "Religious Places": [
    { name: "Siddhababa Temple", lat: 27.7123, lng: 83.4823 },
    { name: "Manimukunda Park & Temple", lat: 27.6623, lng: 83.4956 },
    { name: "Maya Devi Temple (Lumbini)", lat: 27.4833, lng: 83.2767 },
    { name: "Tinau Mahadev Temple", lat: 27.689, lng: 83.4267 },
    { name: "Jama Masjid Butwal", lat: 27.6845, lng: 83.4423 },
  ],

  "Parks & Recreation": [
    { name: "Manimukunda Park", lat: 27.6634, lng: 83.4967 },
    { name: "Tinau Park", lat: 27.6912, lng: 83.4289 },
    { name: "Children's Park (Traffic)", lat: 27.6889, lng: 83.4478 },
    { name: "Bhairahawa Garden", lat: 27.5089, lng: 83.4456 },
  ],

  "Municipality Areas": [
    { name: "Butwal Sub-Metropolitan City Office", lat: 27.6867, lng: 83.4445 },
    { name: "Tilottama Municipality Office", lat: 27.6789, lng: 83.4534 },
    { name: "Devdaha Municipality Office", lat: 27.5934, lng: 83.4812 },
    { name: "Lumbini Sanskritik Municipality", lat: 27.4901, lng: 83.2823 },
    { name: "Sainamaina Municipality Office", lat: 27.5667, lng: 83.3234 },
  ],

  "Industrial Areas": [
    { name: "Butwal Industrial Corridor", lat: 27.6723, lng: 83.489 },
    { name: "Manigram Industrial Area", lat: 27.6745, lng: 83.5023 },
    { name: "Bhairahawa Industrial Estate", lat: 27.5234, lng: 83.4789 },
  ],

  "Residential Areas": [
    { name: "Kalikanagar", lat: 27.6945, lng: 83.4367 },
    { name: "Shankarnagar", lat: 27.6578, lng: 83.4778 },
    { name: "Nayabasti", lat: 27.6812, lng: 83.4612 },
    { name: "Amarpath", lat: 27.6689, lng: 83.4701 },
    { name: "Devinagar", lat: 27.6734, lng: 83.4823 },
  ],
};

// Get all categories
export const getCategories = () => Object.keys(rupandehiLocations);

// Get locations by category
export const getLocationsByCategory = (category) =>
  rupandehiLocations[category] || [];

// Get all locations as flat array
export const getAllLocations = () => {
  return Object.values(rupandehiLocations).flat();
};
