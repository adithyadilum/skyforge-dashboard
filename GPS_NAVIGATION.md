# GPS Navigation Feature Documentation

## Overview

The SKYFORGE dashboard now includes real-time GPS navigation calculations that automatically determine the drone's speed and course using two consecutive GPS readings.

## Features

### 🧭 Navigation Calculations
- **Speed Calculation**: Measures distance traveled between two GPS points and divides by time elapsed
- **Course Calculation**: Determines the bearing (direction) the drone is heading using GPS coordinates
- **Multiple Units**: Displays speed in m/s, km/h, and knots
- **Cardinal Directions**: Shows course as both degrees and cardinal directions (N, NE, E, etc.)

### 📍 GPS Tracking
- **Real-time Updates**: Automatically updates when new GPS data arrives from Firebase
- **Movement Validation**: Only calculates navigation for movements > 2 meters to avoid GPS noise
- **Time Filtering**: Requires minimum 5-second intervals between calculations
- **History Tracking**: Maintains up to 200 GPS position points for analysis

### 📊 Statistics & Analytics
- **Current Position**: Real-time latitude/longitude coordinates
- **Distance Tracking**: Total distance traveled in current session
- **Speed Analytics**: Current, average, and maximum speeds
- **Trail Visualization**: GPS movement history on interactive maps

## Implementation

### Core Components

1. **GPS Utils (`src/lib/gpsUtils.ts`)**
   - `calculateDistance()`: Haversine formula for GPS coordinate distance
   - `calculateBearing()`: Initial bearing calculation between two points
   - `calculateDroneNavigation()`: Main function combining speed and course calculations
   - `isValidGPSCoordinate()`: GPS coordinate validation

2. **GPS Tracking Hook (`src/hooks/useGPSTracking.ts`)**
   - React hook for managing GPS state and calculations
   - Automatic updates from weather data changes
   - Configurable tracking parameters (history size, intervals, distance thresholds)

3. **Navigation Display (`src/components/ui/GPSNavigationDisplay.tsx`)**
   - Visual component showing speed, course, and position data
   - Real-time status indicators and error handling
   - Responsive design with color-coded status

### Integration Points

The GPS navigation is integrated into all three main tabs:

- **Live Tab**: Real-time navigation display in right sidebar
- **System Tab**: GPS navigation with system telemetry data
- **Analytics Tab**: Historical navigation data with charts

## Mathematical Formulas

### Distance Calculation (Haversine Formula)
```
a = sin²(Δφ/2) + cos(φ1) × cos(φ2) × sin²(Δλ/2)
c = 2 × atan2(√a, √(1−a))
distance = R × c
```
Where:
- φ = latitude in radians
- λ = longitude in radians
- R = Earth's radius (6,371,000 meters)

### Bearing Calculation
```
y = sin(Δλ) × cos(φ2)
x = cos(φ1) × sin(φ2) − sin(φ1) × cos(φ2) × cos(Δλ)
bearing = atan2(y, x)
```

### Speed Calculation
```
speed = distance / time_elapsed
```

## Configuration

### GPS Tracking Options
```typescript
const gpsTracking = useGPSTracking({
  maxHistorySize: 200,        // Maximum GPS points to store
  minTimeInterval: 5,         // Minimum seconds between calculations
  minDistance: 2              // Minimum meters for valid movement
})
```

### Validation Parameters
- **Valid GPS Range**: Latitude [-90°, 90°], Longitude [-180°, 180°]
- **Null Island Filter**: Excludes (0°, 0°) coordinates
- **Movement Threshold**: 2-meter minimum to avoid GPS noise
- **Time Threshold**: 5-second minimum to prevent calculation spam

## Data Sources

The GPS navigation system works with your existing Firebase data structure:

```json
{
  "sensorData": {
    "location": {
      "latitude": 7.2906,
      "longitude": 80.6337,
      "altitude": 105
    },
    "timestamp": "2025-08-12T10:30:00Z"
  }
}
```

## Error Handling

- **Invalid Coordinates**: Shows error message and skips calculation
- **Insufficient Movement**: Maintains previous navigation data
- **Time Intervals**: Filters updates that are too frequent
- **Missing Data**: Graceful degradation with clear status indicators

## Future Enhancements

- **GPS Trail Animation**: Animated playback of movement history
- **Speed Alerts**: Configurable speed threshold notifications
- **Course Prediction**: Estimated arrival times and destinations
- **Flight Path Analysis**: Advanced analytics for flight patterns
- **Waypoint Navigation**: Target destinations and route planning

## Usage Example

The GPS navigation automatically activates when:
1. User is authenticated and connected to Firebase
2. Valid GPS data is received from the ESP32
3. Drone moves more than 2 meters between readings
4. Time interval between readings is at least 5 seconds

No manual configuration required - the system works seamlessly with your existing sensor data flow.
