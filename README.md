# 🌟 Skyforge Dashboard - ESP32 Weather Station

A real-time weather monitoring dashboard built with React and Firebase, integrated with ESP32 sensors for live environmental data collection.

![Dashboard Preview](https://img.shields.io/badge/Status-Active%20Development-green)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue)
![Firebase](https://img.shields.io/badge/Firebase-Realtime%20DB-orange)
![ESP32](https://img.shields.io/badge/ESP32-IoT%20Device-red)

## 📋 Project Overview

The Skyforge Dashboard is a comprehensive IoT weather monitoring system that combines:

- **ESP32 microcontroller** for sensor data collection
- **Firebase Realtime Database** for data storage and synchronization
- **React web application** for real-time data visualization
- **Real-time analytics** with customizable refresh intervals

## 🏗️ System Architecture

```
ESP32 Sensors → WiFi → Firebase Realtime DB → React Web App
     ↓              ↓           ↓                ↓
  Mock Data    HTTP POST    Real-time      Live Dashboard
  Generation   Requests     Sync           & Analytics
```

## 🚀 Features

### 📱 Web Dashboard

- **3 Navigation Tabs**: Live, System, Analytics
- **Real-time Data Display**: Temperature, humidity, pressure, UV, CO2, wind, GPS
- **Connection Status Monitoring**: Live/Offline indicator based on data freshness
- **Smooth UI Components**: Enhanced shadows and responsive design
- **User Profile**: Real-time date/time display

### 📊 Analytics Tab

- **Historical Data Visualization**: Interactive charts and graphs
- **Auto-refresh Functionality**: Configurable intervals (5s, 10s, 15s, 30s, 1m)
- **Record Limit Control**: Display last 25, 50, 100, or 200 records
- **Real-time Chart Updates**: All charts automatically sync with Firebase
- **Error Handling**: Clear error messages and retry logic
- **Performance Optimized**: Memoized components and efficient state management

### 🔄 System Tab

- **System Monitoring**: Firebase connection status
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
- [x] Connection monitoring (20-second tolerance)
- [x] Historical data fetching with limits

#### Phase 5: Real-time Analytics (Completed)

- [x] Auto-refresh toggle functionality
- [x] Configurable refresh intervals (5s-1m)
- [x] Record limit selector (25-200 records)
- [x] Real-time chart updates
- [x] Loading indicators and error handling
- [x] Performance optimization with memoization

#### Phase 6: ESP32 Code Development (Completed)

- [x] WiFi connection handling
- [x] NTP time synchronization
- [x] Mock sensor data generation
- [x] Firebase HTTP POST integration
- [x] Error handling and retry logic
- [x] Proper timestamp formatting

### 🔄 Current Status

- **Development Phase**: ESP32 Integration Testing
- **Last Updated**: July 29, 2025
- **Active Branch**: `firebase-connection`

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

### Data Visualization

- **Recharts** - Chart library
- **React-Leaflet** - Map integration

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
- **Connection timeout**: 20 seconds
- **Refresh check interval**: 3 seconds

## 📊 Data Flow

1. **ESP32** generates mock sensor data every 10 seconds
2. **WiFi connection** sends HTTP POST to Firebase
3. **Firebase Realtime Database** stores data with push IDs
4. **React web app** subscribes to database changes
5. **Real-time updates** refresh charts and displays
6. **Connection monitoring** tracks data freshness

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
3. **Monitor Live tab** - Real-time sensor readings
4. **Check System tab** - Connection status and health
5. **Analyze data** - Historical trends in Analytics tab

## 🚧 Roadmap

### Phase 7: Production Deployment (Planned)

- [ ] Production Firebase setup
- [ ] Environment-specific configurations
- [ ] Performance monitoring
- [ ] Error tracking and logging

### Phase 8: Enhanced Features (Planned)

- [ ] Data export functionality (CSV, JSON)
- [ ] Email/SMS alerts for threshold breaches
- [ ] Multi-device support
- [ ] Data backup and archival

### Phase 9: Mobile App (Future)

- [ ] React Native mobile application
- [ ] Push notifications
- [ ] Offline data viewing
- [ ] Location-based features

## 🐛 Known Issues

- Timestamp accuracy depends on NTP server availability
- Large datasets may cause performance issues
- Firebase connection requires stable internet

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

**Last Updated**: July 29, 2025  
**Version**: 1.0.0  
**Status**: Active Development  
**Branch**: firebase-connection
