# Location Selection Feature - Documentation

## Overview

The Report Issue page now includes three ways to select a location in Rupandehi, Nepal:

### 1. **Choose from Categorized List**

- Select from pre-defined categories (Government Offices, Schools, Hospitals, etc.)
- Choose specific locations within each category
- Automatically fills in coordinates and location name

### 2. **Use Current Location (GPS)**

- Click "📍 Use My Current Location" button
- Browser will request location permission
- Automatically centers map on your current location
- Fetches readable address using reverse geocoding

### 3. **Manual Map Selection**

- Click anywhere on the map to place a marker
- Drag the marker to adjust the exact position
- Automatically updates coordinates and fetches address name
- Supports zoom and pan for precise location selection

## Features Implemented

### Location Data (`src/data/rupandehiLocations.js`)

- 10 categories with 50+ locations in Rupandehi district
- Categories include:
  - Government Offices
  - Educational Institutions
  - Healthcare Facilities
  - Transportation Hubs
  - Markets & Commercial Areas
  - Religious Places
  - Parks & Recreation
  - Municipality Areas
  - Industrial Areas
  - Residential Areas

### Enhanced MapPicker Component (`src/components/MapPicker.jsx`)

**New Features:**

- ✅ Current location detection via browser Geolocation API
- ✅ Draggable marker for precise positioning
- ✅ Click-to-place marker anywhere on map
- ✅ Reverse geocoding to get human-readable addresses
- ✅ Auto-centering when location is selected
- ✅ Loading states and error handling

**Props:**

- `lat`: Current latitude value
- `lng`: Current longitude value
- `setLat`: Function to update latitude
- `setLng`: Function to update longitude
- `setLocationName`: Function to update location name (optional)

### Updated ReportIssue Page (`src/pages/ReportIssue.jsx`)

**UI Improvements:**

- Tab-based interface to switch between list and map selection
- Category dropdown with 10 categories
- Location dropdown filtered by selected category
- Visual feedback for selected location
- Real-time coordinate display
- Editable location fields for manual entry

## User Flow

### Option 1: Select from List

1. Click "🏢 Choose from List" tab
2. Select a category from dropdown
3. Select a specific location
4. Coordinates and name auto-fill

### Option 2: Use Map with GPS

1. Click "🗺️ Use Map" tab
2. Click "📍 Use My Current Location"
3. Grant location permission
4. Map centers on your location
5. Address is automatically fetched

### Option 3: Manual Map Selection

1. Click "🗺️ Use Map" tab
2. Click anywhere on the map OR
3. Drag the marker to desired location
4. Address is automatically fetched

## Technical Details

### Dependencies Used

- `react-leaflet`: Interactive map component
- `leaflet`: Mapping library
- OpenStreetMap tiles for map display
- Nominatim API for reverse geocoding

### Browser Permissions

- Location access required for "Use Current Location" feature
- User will see browser permission prompt
- Works without location permission if using other methods

### API Integration

- Uses OpenStreetMap Nominatim API for reverse geocoding
- No API key required (open source)
- Respects usage policy with appropriate delays

## Testing Checklist

- [ ] Category dropdown loads all 10 categories
- [ ] Location dropdown updates when category changes
- [ ] Selecting location updates all fields (name, lat, lng)
- [ ] Current location button requests permission
- [ ] Current location button updates map and fields
- [ ] Clicking map places marker and updates fields
- [ ] Dragging marker updates coordinates in real-time
- [ ] Manual coordinate entry updates map marker
- [ ] Form validation requires all fields
- [ ] Submit works with all location selection methods

## Future Enhancements

- Add search functionality for locations
- Cache frequently used locations
- Add custom location categories
- Implement offline map support
- Add location history
