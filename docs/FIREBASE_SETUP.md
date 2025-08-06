# Firebase Setup Guide for SkyForge Dashboard

## Overview
This guide will help you connect your SkyForge dashboard to Firebase Realtime Database to display live sensor data.

## Prerequisites
1. Firebase project created
2. Realtime Database enabled
3. Firebase credentials

## Setup Steps

### 1. Environment Configuration
Create a `.env` file in your project root with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=AIzaSyA5IRjwAdvgSQ8K9sTkfdjEgFO_P1K-PdM
VITE_FIREBASE_AUTH_DOMAIN="skyforge-4606b.firebaseapp.com"
VITE_FIREBASE_DB_URL=https://skyforge-4606b-default-rtdb.asia-southeast1.firebasedatabase.app/
VITE_FIREBASE_PROJECT_ID=skyforge-4606b
VITE_FIREBASE_STORAGE_BUCKET=skyforge-4606b.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=113983013806
VITE_FIREBASE_APP_ID=1:113983013806:web:b37570450de08e7a147e3f
```

### 2. Firebase Database Structure
Your Firebase Realtime Database should have this structure:

```json
{
  "sensorData": {
    "temperature": 25.5,
    "humidity": 65,
    "pressure": 1013,
    "altitude": 105,
    "uvIndex": 1,
    "co2": 450,
    "gas": 285,
    "airQuality": 78,
    "lightIntensity": 550,
    "gps": {
      "latitude": 7.2901,
      "longitude": 80.6337
    },
    "windSpeed": 5.2,
    "windDirection": 238,
    "satellites": 8,
    "timestamp": "2025-07-23T10:30:00Z"
  },
  "systemData": {
    "batteryVoltage": 11.7,
    "nrfConnected": true,
    "uplinkActive": true,
    "uptime": "00:13:22",
    "sensors": {
      "mpu6050": true,
      "bme280": true,
      "uvSensor": true,
      "ccs811": true,
      "vl53l0x": true,
      "gps": true
    },
    "esp32Temperature": 39.2
  }
}
```

### 3. Firebase Rules (for testing)
Set these rules in your Firebase Console for testing:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

⚠️ **Warning**: These rules allow public access. For production, implement proper authentication and authorization.

### 4. Connection Status
The dashboard will show:
- 🟢 **Live Data**: Connected to Firebase and receiving real-time data
- 🟡 **Connecting...**: Attempting to connect to Firebase
- 🔴 **Mock Data**: Using fallback data (Firebase not configured or connection failed)

### 5. Data Mapping
The Firebase service maps your sensor data to the dashboard:

| Firebase Field | Dashboard Display |
|----------------|------------------|
| `temperature` | Temperature (°C/°F) |
| `humidity` | Humidity (%) |
| `pressure` | Pressure (hPa/inHg) |
| `uvIndex` | UV Index with level |
| `co2`, `gas` | Air Quality readings |
| `lightIntensity` | Light intensity (lux) |
| `gps.latitude/longitude` | GPS coordinates |
| `windSpeed/windDirection` | Wind data |
| `altitude` | Altitude (m/ft) |

### 6. Real-time Updates
The dashboard automatically updates when Firebase data changes. No manual refresh needed!

### 7. Troubleshooting

**Issue**: Connection shows "Mock Data"
- Check `.env` file has correct Firebase credentials
- Verify Firebase project is active
- Check browser console for errors

**Issue**: Data not updating
- Verify Firebase database rules allow read access
- Check if data structure matches expected format
- Monitor browser network tab for Firebase requests

**Issue**: Build errors
- Ensure all environment variables start with `VITE_`
- Restart development server after adding `.env` file

### 8. Testing Your Setup
1. Add test data to Firebase Realtime Database
2. Watch the dashboard update in real-time
3. Check connection status indicator in header
4. Monitor browser console for Firebase logs

## Security Notes
- Never commit `.env` file to version control
- Use Firebase security rules in production
- Consider implementing user authentication
- Monitor Firebase usage quotas

## Support
If you encounter issues:
1. Check browser console for error messages
2. Verify Firebase project settings
3. Test Firebase connection independently
4. Review environment variable configuration
