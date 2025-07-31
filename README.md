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

### 📱 Web Dashboard

- **3 Navigation Tabs**: Live, System, Analytics
- **Real-time Data Display**: Temperature, humidity, pressure, UV, CO2, wind, GPS
- **Intelligent Connection Monitoring**: 3-second timeout with automatic status switching
- **Interactive Maps**: Live GPS tracking with OpenStreetMap integration
- **Smooth UI Components**: Enhanced shadows and responsive design
- **User Profile**: Real-time date/time display

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
- **Error Handling**: Clear error messages and retry logic
- **Performance Optimized**: Memoized components and efficient state management

### 🔄 System Tab

- **System Monitoring**: Firebase connection status with intelligent timeout
- **Live GPS Tracking**: Interactive map with real-time position updates
- **Telemetry Data**: Real-time system metrics
- **Connection Health**: Database connectivity indicators

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

#### Phase 7: ESP32 Code Development (Completed)

- [x] WiFi connection handling
- [x] NTP time synchronization
- [x] Mock sensor data generation
- [x] Firebase HTTP POST integration
- [x] Error handling and retry logic
- [x] Proper timestamp formatting

### 🔄 Current Status

- **Development Phase**: Production Ready
- **Last Updated**: July 31, 2025
- **Active Branch**: `firebase-connection`
- **New Features**: Interactive Leaflet maps, intelligent connection monitoring

## 🛠️ Technology Stack

### Frontend

- **React 18.3.1** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool and dev server
- **Lucide React** - Icons

### Backend & Database

- **Firebase Realtime Database** - Real-time data storage
- **Firebase SDK** - JavaScript client

### Data Visualization & Maps

- **Recharts** - Chart library
- **React-Leaflet** - Interactive maps
- **Leaflet** - Core mapping library
- **OpenStreetMap** - Map tile provider

### Hardware

- **ESP32** - Microcontroller
- **WiFi Module** - Connectivity
- **Sensors** - Environmental data (simulated)

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

4. **Start development server**
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
3. **Monitor Live tab** - Real-time sensor readings with interactive GPS map
4. **Check System tab** - Connection status, health, and live position tracking
5. **Analyze data** - Historical trends and GPS trail in Analytics tab
6. **Interact with maps** - Zoom, pan, and click markers for detailed information

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

### Phase 8: Production Deployment (In Progress)

- [ ] Production Firebase setup
- [ ] Environment-specific configurations
- [ ] Performance monitoring
- [ ] Error tracking and logging

### Phase 9: Enhanced Features (Planned)

- [ ] Data export functionality (CSV, JSON)
- [ ] Email/SMS alerts for threshold breaches
- [ ] Multi-device support
- [ ] Data backup and archival
- [ ] GPS trail playback and animation
- [ ] Custom map markers and themes

### Phase 10: Mobile App (Future)

- [ ] React Native mobile application
- [ ] Push notifications
- [ ] Offline data viewing
- [ ] Location-based features
- [ ] Mobile-optimized maps

## 🐛 Known Issues

- Timestamp accuracy depends on NTP server availability
- Large datasets may cause performance issues in older browsers
- Firebase connection requires stable internet
- Map rendering requires modern browser with good WebGL support

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

**Last Updated**: July 31, 2025  
**Version**: 2.0.0  
**Status**: Production Ready  
**Branch**: firebase-connection  
**New Features**: Interactive Leaflet maps, intelligent connection monitoring, GPS trail visualization
