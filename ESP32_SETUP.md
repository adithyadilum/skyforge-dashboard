# ESP32 Setup Guide

## Quick Installation Steps

### 1. Hardware Requirements

- ESP32 Development Board (any variant)
- USB cable for programming
- Stable WiFi connection

### 2. Software Requirements

- Arduino IDE (1.8.x or 2.x)
- ESP32 Board Package
- ArduinoJson Library

### 3. Arduino IDE Setup

#### Install ESP32 Board Support:

1. Open Arduino IDE
2. Go to **File → Preferences**
3. Add this URL to "Additional Board Manager URLs":
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
4. Go to **Tools → Board → Board Manager**
5. Search for "ESP32" and install "ESP32 by Espressif Systems"

#### Install Required Library:

1. Go to **Tools → Manage Libraries**
2. Search for "ArduinoJson"
3. Install "ArduinoJson by Benoit Blanchon" (version 6.x)

### 4. Code Configuration

Open `esp32_sensor_code.ino` and modify these lines:

```cpp
// WiFi Configuration
const char* ssid = "YOUR_WIFI_SSID";           // Replace with your WiFi name
const char* password = "YOUR_WIFI_PASSWORD";   // Replace with your WiFi password
```

### 5. Upload Process

1. **Connect ESP32** to computer via USB
2. **Select Board**: Tools → Board → ESP32 Arduino → Select your ESP32 model
3. **Select Port**: Tools → Port → Select the COM port (Windows) or /dev/tty.\* (Mac/Linux)
4. **Upload Code**: Click the upload button (→) or Ctrl+U

### 6. Monitor Output

1. Open **Tools → Serial Monitor**
2. Set baud rate to **115200**
3. You should see:
   ```
   ESP32 Weather Station - Firebase Integration
   Connecting to WiFi....
   WiFi connected successfully!
   IP address: 192.168.1.xxx
   Time synchronized successfully
   ✅ Data uploaded successfully!
   ```

### 7. Troubleshooting

**Compilation Errors:**

- If you get "'SensorData' does not name a type" error, make sure you're using the latest version of the code
- Ensure all includes are at the top of the file
- Try closing and reopening Arduino IDE

**WiFi Connection Issues:**

- Double-check SSID and password
- Ensure WiFi network is 2.4GHz (ESP32 doesn't support 5GHz)
- Try moving closer to router

**Upload Errors:**

- Press and hold BOOT button while uploading
- Try different USB cable
- Check if correct COM port is selected

**Firebase Upload Errors:**

- Verify internet connection
- Check Firebase database URL in code
- Ensure Firebase database rules allow writes

### 8. Data Verification

Once ESP32 is running:

1. Check Serial Monitor for upload confirmations
2. Open your web dashboard
3. Navigate to Analytics tab
4. You should see new data appearing every 10 seconds

The ESP32 will automatically:

- Connect to WiFi on startup
- Sync time with NTP server
- Generate realistic sensor data
- Upload to Firebase every 10 seconds
- Handle connection errors and retry

## Expected Serial Output

```
ESP32 Weather Station - Firebase Integration
Connecting to WiFi.....
WiFi connected successfully!
IP address: 192.168.1.105
Waiting for time synchronization...
Time synchronized successfully
Monday, July 29 2025 10:30:45
Setup complete. Starting sensor data transmission...
✅ Data uploaded successfully!
Response code: 200
Timestamp: 1722249045000
Temperature: 28.5°C
Humidity: 65.2%
---
✅ Data uploaded successfully!
Response code: 200
Timestamp: 1722249055000
Temperature: 29.1°C
Humidity: 63.8%
---
```

## Next Steps

Once ESP32 is uploading data successfully:

1. Open the web dashboard
2. Check the Live tab for real-time readings
3. Use the Analytics tab to view historical data
4. Monitor the System tab for connection status

Your weather station is now fully operational! 🌟
