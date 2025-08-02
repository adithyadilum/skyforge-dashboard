# 🌟 Skyforge Dashboard - ESP32 Weather Station

A real-time weather monitoring dashboard built with React and Firebase, integrated with ESP32 sensors for live environmental data collection with interactive maps and intelligent connection monitoring.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue)
![Firebase](https://img.shields.io/badge/Firebase-Realtime%20DB-orange)
![ESP32](https://img.shields.io/badge/ESP32-IoT%20Device-red)
![Leaflet](https://img.shields.io/badge/Leaflet-Maps-green)

## 📋 Project Overview

The Skyforge Dashboard is a comprehensive IoT weather monitoring system that combines:

- **ESP32 microcontroller** for sensor data collection
- **Firebase Realtime Database** for data storage and synchronization
- **React web application** with interactive maps for real-time data visualization
- **Real-time analytics** with intelligent connection monitoring
- **Interactive Leaflet maps** for GPS tracking and location visualization

## 🏗️ System Architecture

```
ESP32 Sensors → WiFi → Firebase Realtime DB → React Web App → Interactive Maps
     ↓              ↓           ↓                ↓              ↓
  Mock Data    HTTP POST    Real-time      Live Dashboard   GPS Tracking
  Generation   Requests     Sync           & Analytics      & Visualization
```

## 🚀 Features

### � Google Authentication (NEW)

- **Secure Google Sign-In**: OAuth2 authentication using Firebase Auth
- **User Profile Display**: Shows Google account name and profile picture in top-right corner
- **Session Management**: Automatic sign-in persistence and secure sign-out functionality
- **Protected Dashboard**: Only authenticated users can access the weather monitoring dashboard
- **Profile Dropdown**: Interactive dropdown with user information and sign-out option
- **Elegant Login Interface**: Clean, professional sign-in page with Google branding

### �📱 Web Dashboard

- **3 Navigation Tabs**: Live, System, Analytics
- **Real-time Data Display**: Temperature, humidity, pressure, UV, CO2, wind, GPS
- **Intelligent Connection Monitoring**: 3-second timeout with automatic status switching
- **Interactive Maps**: Live GPS tracking with OpenStreetMap integration
- **Smooth UI Components**: Enhanced shadows and responsive design
- **User Authentication**: Secure Google login with profile management

### 🗺️ Interactive Maps (NEW)

- **Live Tab**: Real-time GPS location with interactive Leaflet map
- **System Tab**: Current position tracking with marker popups
- **Analytics Tab**: GPS trail visualization with historical coordinates
- **OpenStreetMap Integration**: High-quality map tiles with zoom/pan functionality
- **Location Markers**: Detailed coordinate displays with latitude/longitude popups

### 📊 Analytics Tab

- **Historical Data Visualization**: Interactive charts and graphs
- **Auto-refresh Functionality**: Configurable intervals (5s, 10s, 15s, 30s, 1m)
- **Record Limit Control**: Display last 25, 50, 100, or 200 records
- **Real-time Chart Updates**: All charts automatically sync with Firebase
- **GPS Trail Mapping**: Interactive map showing movement history
- **PDF Report Generation**: Professional PDF reports with jsPDF integration
- **Data Export**: CSV and PDF export functionality with formatted layouts
- **Error Handling**: Clear error messages and retry logic
- **Performance Optimized**: Memoized components and efficient state management

### 🔄 System Tab

- **System Monitoring**: Firebase connection status with intelligent timeout
- **Live GPS Tracking**: Interactive map with real-time position updates
- **Dynamic Sensor Status**: Real-time monitoring of all 8 sensors (MPU6050, BME280, UV Sensor, BH1750, VL53L0X Array, GPS Module, AHT21, ENS160)
- **Intelligent Status Detection**: Sensors show "OK" when receiving valid data, "NO" when offline or faulty
- **Connection Health**: Database connectivity indicators with automatic status switching
- **Telemetry Data**: Real-time system metrics and sensor health monitoring
- **Power & Signal Monitoring**: Battery voltage, NRF link status, and communication channels

### 🛠️ ESP32 Integration

- **WiFi Connectivity**: Automatic connection and reconnection
- **NTP Time Sync**: Accurate timestamp generation
- **Mock Sensor Data**: Realistic environmental data simulation
- **Firebase Upload**: HTTP POST requests every 10 seconds
- **Error Recovery**: Automatic retry on connection failures

## 📈 Project Progress

### ✅ Completed Features

#### Phase 1: UI Foundation (Completed)

- [x] Navigation system with 3 tabs (Live, System, Analytics)
- [x] Real-time date/time display in header
- [x] User profile section
- [x] Smooth shadow effects on components
- [x] Responsive design with Tailwind CSS

#### Phase 2: System Tab Implementation (Completed)

- [x] System monitoring interface
- [x] Firebase connection status display
- [x] Telemetry data visualization
- [x] Real-time system metrics

#### Phase 3: Analytics Tab Development (Completed)

- [x] Historical data charts (Temperature, Humidity, UV, CO2, Wind, Altitude)
- [x] Interactive data visualization with Recharts
- [x] Map integration with React-Leaflet
- [x] Data insights and statistics
- [x] Export functionality (CSV, PDF)
- [x] PDF report generation with jsPDF integration
- [x] Professional PDF formatting with multi-page support

#### Phase 4: Firebase Integration (Completed)

- [x] Firebase Realtime Database setup
- [x] Environment configuration (.env file)
- [x] Real-time data synchronization
- [x] Data transformation and processing
- [x] Intelligent connection monitoring (3-second timeout)
- [x] Historical data fetching with limits
- [x] Robust timestamp handling (seconds vs milliseconds)
- [x] Connection status switching optimization

#### Phase 5: Real-time Analytics (Completed)

- [x] Auto-refresh toggle functionality
- [x] Configurable refresh intervals (5s-1m)
- [x] Record limit selector (25-200 records)
- [x] Real-time chart updates
- [x] Loading indicators and error handling
- [x] Performance optimization with memoization
- [x] Chart flickering fixes with React.memo

#### Phase 6: Interactive Maps Integration (Completed)

- [x] React-Leaflet integration across all tabs
- [x] OpenStreetMap tile layer implementation
- [x] Real-time GPS marker positioning
- [x] Interactive popups with coordinate display
- [x] GPS trail visualization in Analytics tab
- [x] Responsive map design with proper z-index handling
- [x] Live GPS status indicators

- [x] Auto-refresh toggle functionality
- [x] Configurable refresh intervals (5s-1m)
- [x] Record limit selector (25-200 records)
- [x] Real-time chart updates
- [x] Loading indicators and error handling
- [x] Performance optimization with memoization

#### Phase 7: Google Authentication Integration (Completed)

- [x] Firebase Authentication setup with Google provider
- [x] Secure Google OAuth2 sign-in implementation
- [x] User profile display with name and profile picture
- [x] Protected routes - dashboard only accessible to authenticated users
- [x] Interactive profile dropdown with user information
- [x] Session persistence across browser sessions
- [x] Elegant login page with Google branding
- [x] Secure sign-out functionality

#### Phase 8: ESP32 Code Development (Completed)

- [x] WiFi connection handling
- [x] NTP time synchronization
- [x] Mock sensor data generation
- [x] Firebase HTTP POST integration
- [x] Error handling and retry logic
- [x] Proper timestamp formatting

#### Phase 9: System Enhancement & Sensor Monitoring (Completed)

- [x] Dynamic sensor status monitoring for all 8 sensors
- [x] Real-time sensor health detection (OK/NO status)
- [x] Intelligent data validation for each sensor type
- [x] AHT21 temperature/humidity sensor integration
- [x] ENS160 air quality sensor integration
- [x] MPU6050 accelerometer/gyroscope monitoring
- [x] BME280 pressure sensor validation
- [x] UV sensor data verification
- [x] BH1750 light sensor monitoring
- [x] VL53L0X distance sensor array status
- [x] GPS module connectivity verification
- [x] PDF report generation fixes with proper formatting

### 🔄 Current Status

- **Development Phase**: Production Ready
- **Last Updated**: August 2, 2025
- **Active Branch**: `GoogleLogin`
- **New Features**: Dynamic sensor monitoring, PDF report generation, intelligent sensor status detection

## 🛠️ Technology Stack

### Frontend

- **React 18.3.1** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool and dev server
- **Lucide React** - Icons

### Backend & Database

- **Firebase Realtime Database** - Real-time data storage
- **Firebase Authentication** - Google OAuth2 sign-in
- **Firebase SDK** - JavaScript client

### Data Visualization & Maps

- **Recharts** - Chart library
- **React-Leaflet** - Interactive maps
- **Leaflet** - Core mapping library
- **OpenStreetMap** - Map tile provider
- **jsPDF** - PDF report generation

### Hardware

- **ESP32** - Microcontroller
- **WiFi Module** - Connectivity
- **Sensors** - Environmental data collection:
  - **AHT21** - Temperature and humidity sensor
  - **ENS160** - Air quality and CO2 sensor
  - **MPU6050** - Accelerometer and gyroscope
  - **BME280** - Pressure sensor
  - **UV Sensor** - Ultraviolet radiation measurement
  - **BH1750** - Light intensity sensor
  - **VL53L0X Array** - Distance measurement sensors (4 units)
  - **GPS Module** - Location and positioning

## 📦 Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- ESP32 development environment (Arduino IDE)

### Frontend Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/adithyadilum/skyforge-dashboard.git
   cd skyforge-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   Required packages include:
   - react-leaflet (interactive maps)
   - leaflet (mapping library)
   - @types/leaflet (TypeScript support)
   - recharts (data visualization)
   - firebase (database integration)
   - jspdf (PDF report generation)

3. **Configure environment variables**
   Create a `.env` file in the root directory:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.region.firebasedatabase.app
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Enable Google Authentication in Firebase Console**:
   - Go to Authentication → Sign-in method
   - Enable Google provider
   - Add authorized domains (localhost, your production domain)

5. **Start development server**
   ```bash
   npm run dev
   ```

### ESP32 Setup

1. **Install Arduino IDE** and ESP32 board support
2. **Install required libraries**:

   - ArduinoJson
   - WiFi (built-in)
   - HTTPClient (built-in)

3. **Configure the ESP32 code**:
   - Open `esp32_sensor_code.ino`
   - Replace WiFi credentials
   - Upload to ESP32 board

## 🔧 Configuration

### Firebase Database Structure

```json
{
  "sensor_data": {
    "{push_id}": {
      "timestamp": 1690000000000,
      "temperature": 28.5,
      "humidity": 65.2,
      "pressure": 1013.25,
      "uvIndex": 5.2,
      "co2": 450,
      "windSpeed": 12.5,
      "windDirection": 180,
      "altitude": 10.2,
      "latitude": 6.9271,
      "longitude": 79.8612
    }
  }
}
```

### Web App Configuration

- **Auto-refresh intervals**: 5s, 10s, 15s, 30s, 1m
- **Record limits**: 25, 50, 100, 200 records
- **Connection timeout**: 3 seconds (intelligent monitoring)
- **Refresh check interval**: Real-time Firebase listeners
- **Map zoom level**: 13 (optimal for GPS tracking)
- **Map tiles**: OpenStreetMap (free, high-quality)

## 📊 Data Flow

1. **ESP32** generates mock sensor data every 10 seconds
2. **WiFi connection** sends HTTP POST to Firebase
3. **Firebase Realtime Database** stores data with push IDs
4. **React web app** subscribes to database changes via real-time listeners
5. **Real-time updates** refresh charts, maps, and displays
6. **Intelligent connection monitoring** tracks data freshness with 3-second timeout
7. **Interactive maps** update GPS markers and trails automatically

## 🔍 Monitoring & Debugging

### Web App

- Browser console shows Firebase connection status
- Network tab displays database requests
- Analytics tab shows data loading status

### ESP32

- Serial monitor (115200 baud) shows:
  - WiFi connection status
  - Data upload confirmations
  - Error messages and retries
  - Timestamp synchronization

## 📱 Usage

1. **Power on ESP32** - Starts sending sensor data
2. **Open web dashboard** - Navigate to `http://localhost:5173`
3. **Sign in with Google** - Click "Continue with Google" and authenticate
4. **Monitor Live tab** - Real-time sensor readings with interactive GPS map
5. **Check System tab** - Connection status, health, and live position tracking
6. **Analyze data** - Historical trends and GPS trail in Analytics tab
7. **Interact with maps** - Zoom, pan, and click markers for detailed information
8. **Sign out** - Click your profile picture and select "Sign out"

## 🗺️ Map Features

### Live Tab
- Real-time GPS position marker
- Coordinate display in popup
- Live GPS status indicator

### System Tab
- Current position with interactive map
- GPS status overlay
- Coordinate information panel

### Analytics Tab
- GPS trail visualization
- Historical movement tracking
- Trail statistics and endpoints

## 🚧 Roadmap

### Phase 10: Production Deployment (In Progress)

- [ ] Production Firebase setup
- [ ] Environment-specific configurations
- [ ] Performance monitoring
- [ ] Error tracking and logging

### Phase 11: Enhanced Features (Planned)

- [ ] Advanced sensor fault detection and diagnostics
- [ ] Email/SMS alerts for sensor failures and threshold breaches
- [ ] Multi-device support with device management
- [ ] Data backup and archival with cloud storage
- [ ] GPS trail playback and animation
- [ ] Custom map markers and themes
- [ ] Historical data comparison and trending analysis
- [ ] Sensor calibration and configuration interface

### Phase 12: Mobile App (Future)

- [ ] React Native mobile application
- [ ] Push notifications for sensor alerts
- [ ] Offline data viewing
- [ ] Location-based features
- [ ] Mobile-optimized maps

## 🐛 Known Issues

- Timestamp accuracy depends on NTP server availability
- Large datasets may cause performance issues in older browsers
- Firebase connection requires stable internet
- Map rendering requires modern browser with good WebGL support
- Sensor status depends on actual hardware connectivity and data validation

## 🔧 Troubleshooting

### Map Not Loading
- Check internet connection
- Verify Leaflet CSS is properly imported
- Ensure GPS coordinates are valid numbers

### Connection Issues
- Verify Firebase credentials in .env file
- Check Firebase database rules
- Monitor browser console for errors
- Ensure ESP32 has stable WiFi connection

### Authentication Issues
- Verify Firebase Authentication is enabled in Firebase Console
- Check Google OAuth2 configuration and authorized domains
- Ensure VITE_FIREBASE_AUTH_DOMAIN is correctly set in .env file
- Monitor browser console for authentication errors

### Sensor Status Issues
- Verify sensor connections and wiring
- Check that sensors are providing valid data ranges
- Monitor browser console for sensor validation logs
- Ensure ESP32 is properly configured for all sensors

### PDF Report Issues
- Ensure jsPDF library is properly installed
- Check browser compatibility for PDF generation
- Verify data is available before generating reports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

For questions or issues:

- Open a GitHub issue
- Check the troubleshooting section
- Review ESP32 serial output for debugging

---

**Last Updated**: August 2, 2025  
**Version**: 3.1.0  
**Status**: Production Ready  
**Branch**: GoogleLogin  
**Latest Features**: Dynamic sensor monitoring system, PDF report generation, intelligent sensor fault detection, enhanced system health monitoring
