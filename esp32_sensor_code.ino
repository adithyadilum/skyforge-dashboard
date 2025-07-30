/*
 * ESP32 Weather Station - Firebase Real-time Database Integration
 *
 * This code sends mock sensor data to Firebase Realtime Database
 * with proper timestamps for the Skyforge Dashboard web application.
 *
 * Hardware Requirements:
 * - ESP32 Development Board
 * - WiFi Connection
 *
 * Firebase Database Structure:
 * sensor_data/
 *   └── {push_id}/
 *       ├── timestamp: (Unix timestamp in milliseconds)
 *       ├── temperature: (°C)
 *       ├── humidity: (%)
 *       ├── pressure: (hPa)
 *       ├── uvIndex: (0-12)
 *       ├── co2: (ppm)
 *       ├── windSpeed: (km/h)
 *       ├── windDirection: (degrees)
 *       ├── altitude: (meters)
 *       ├── latitude: (decimal degrees)
 *       └── longitude: (decimal degrees)
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <time.h>

// Sensor Data Structure
struct SensorData
{
    float temperature;
    float humidity;
    float pressure;
    float uvIndex;
    int co2;
    float windSpeed;
    int windDirection;
    float altitude;
    float latitude;
    float longitude;
};

// WiFi Configuration
const char *ssid = "YOUR_WIFI_SSID";         // Replace with your WiFi SSID
const char *password = "YOUR_WIFI_PASSWORD"; // Replace with your WiFi password

// Firebase Configuration
const char *firebaseHost = "https://skyforge-4606b-default-rtdb.asia-southeast1.firebasedatabase.app";
const char *firebasePath = "/sensor_data.json";
const char *firebaseAuth = "YOUR_FIREBASE_AUTH_TOKEN"; // Optional: Add your Firebase auth token

// NTP Server Configuration for accurate timestamps
const char *ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 0;     // GMT offset in seconds (0 for UTC)
const int daylightOffset_sec = 0; // Daylight saving offset

// Sensor Data Upload Interval
const unsigned long uploadInterval = 10000; // 10 seconds (matches web app expectation)
unsigned long lastUpload = 0;

// Mock GPS Location (Replace with actual GPS coordinates if available)
const float fixedLatitude = 6.9271; // Colombo, Sri Lanka
const float fixedLongitude = 79.8612;
const float baseAltitude = 7.0; // Base altitude in meters

// Function declarations
void connectToWiFi();
void uploadSensorData();
unsigned long long getCurrentTimestamp();
SensorData generateMockSensorData();
void printCurrentTime();

void setup()
{
    Serial.begin(115200);
    Serial.println("ESP32 Weather Station - Firebase Integration");

    // Initialize WiFi
    connectToWiFi();

    // Initialize time synchronization
    configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
    Serial.println("Waiting for time synchronization...");

    // Wait for time to be set
    struct tm timeinfo;
    if (!getLocalTime(&timeinfo))
    {
        Serial.println("Failed to obtain time");
    }
    else
    {
        Serial.println("Time synchronized successfully");
        Serial.println(&timeinfo, "%A, %B %d %Y %H:%M:%S");
    }

    Serial.println("Setup complete. Starting sensor data transmission...");
}

void loop()
{
    // Check WiFi connection
    if (WiFi.status() != WL_CONNECTED)
    {
        Serial.println("WiFi disconnected. Reconnecting...");
        connectToWiFi();
    }

    // Upload sensor data at specified interval
    if (millis() - lastUpload >= uploadInterval)
    {
        uploadSensorData();
        lastUpload = millis();
    }

    delay(1000); // Small delay to prevent excessive CPU usage
}

void connectToWiFi()
{
    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi");

    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 30)
    {
        delay(1000);
        Serial.print(".");
        attempts++;
    }

    if (WiFi.status() == WL_CONNECTED)
    {
        Serial.println();
        Serial.println("WiFi connected successfully!");
        Serial.print("IP address: ");
        Serial.println(WiFi.localIP());
    }
    else
    {
        Serial.println();
        Serial.println("Failed to connect to WiFi. Please check credentials.");
    }
}

void uploadSensorData()
{
    if (WiFi.status() != WL_CONNECTED)
    {
        Serial.println("WiFi not connected. Skipping upload.");
        return;
    }

    // Get current timestamp in milliseconds
    unsigned long long timestamp = getCurrentTimestamp();

    // Generate mock sensor data
    SensorData data = generateMockSensorData();

    // Create JSON payload
    DynamicJsonDocument doc(1024);
    doc["timestamp"] = timestamp;
    doc["temperature"] = data.temperature;
    doc["humidity"] = data.humidity;
    doc["pressure"] = data.pressure;
    doc["uvIndex"] = data.uvIndex;
    doc["co2"] = data.co2;
    doc["windSpeed"] = data.windSpeed;
    doc["windDirection"] = data.windDirection;
    doc["altitude"] = data.altitude;
    doc["latitude"] = data.latitude;
    doc["longitude"] = data.longitude;

    String jsonString;
    serializeJson(doc, jsonString);

    // Send data to Firebase
    HTTPClient http;
    http.begin(String(firebaseHost) + firebasePath);
    http.addHeader("Content-Type", "application/json");

    // Add authentication if token is provided
    if (strlen(firebaseAuth) > 0)
    {
        http.addHeader("Authorization", String("Bearer ") + firebaseAuth);
    }

    int httpResponseCode = http.POST(jsonString);

    if (httpResponseCode > 0)
    {
        String response = http.getString();
        Serial.println("✅ Data uploaded successfully!");
        Serial.println("Response code: " + String(httpResponseCode));
        Serial.println("Timestamp: " + String((unsigned long)timestamp));
        Serial.println("Temperature: " + String(data.temperature) + "°C");
        Serial.println("Humidity: " + String(data.humidity) + "%");
        Serial.println("---");
    }
    else
    {
        Serial.println("❌ Error uploading data");
        Serial.println("HTTP Error code: " + String(httpResponseCode));
        Serial.println("Error: " + http.errorToString(httpResponseCode));
    }

    http.end();
}

unsigned long long getCurrentTimestamp()
{
    struct tm timeinfo;
    if (!getLocalTime(&timeinfo))
    {
        Serial.println("Failed to obtain time, using millis() as fallback");
        // Fallback: use millis() + epoch offset (not accurate but better than nothing)
        return (unsigned long long)(millis() + 1640995200000ULL); // Rough epoch offset
    }

    // Convert to Unix timestamp in milliseconds
    time_t now = mktime(&timeinfo);
    return (unsigned long long)now * 1000;
}

SensorData generateMockSensorData()
{
    SensorData data;

    // Generate realistic mock sensor data with some variation
    static float tempBase = 28.0;     // Base temperature around 28°C
    static float humidityBase = 65.0; // Base humidity around 65%
    static unsigned long seed = millis();

    // Use simple pseudo-random variations
    float tempVariation = (sin(seed * 0.001) * 5.0) + (cos(seed * 0.0007) * 2.0);
    float humidityVariation = (sin(seed * 0.0013) * 15.0) + (cos(seed * 0.0009) * 8.0);

    data.temperature = tempBase + tempVariation;
    data.humidity = humidityBase + humidityVariation;

    // Ensure humidity stays within realistic bounds
    if (data.humidity < 30)
        data.humidity = 30;
    if (data.humidity > 95)
        data.humidity = 95;

    // Generate other sensor values
    data.pressure = 1013.25 + (sin(seed * 0.0005) * 20.0);             // Atmospheric pressure variation
    data.uvIndex = abs((int)(sin(seed * 0.002) * 8.0)) + 2;            // UV index 2-10
    data.co2 = 400 + abs((int)(sin(seed * 0.0008) * 200.0));           // CO2 400-600 ppm
    data.windSpeed = abs(sin(seed * 0.0012) * 25.0);                   // Wind speed 0-25 km/h
    data.windDirection = abs((int)(sin(seed * 0.0015) * 360.0)) % 360; // Wind direction 0-359°
    data.altitude = baseAltitude + (sin(seed * 0.0003) * 3.0);         // Small altitude variations

    // Fixed GPS coordinates (replace with actual GPS if available)
    data.latitude = fixedLatitude + (sin(seed * 0.00001) * 0.001); // Small GPS variations
    data.longitude = fixedLongitude + (cos(seed * 0.00001) * 0.001);

    return data;
}

// Helper function to print current time (for debugging)
void printCurrentTime()
{
    struct tm timeinfo;
    if (getLocalTime(&timeinfo))
    {
        Serial.println(&timeinfo, "Current time: %A, %B %d %Y %H:%M:%S");
    }
}

/*
 * INSTALLATION INSTRUCTIONS:
 *
 * 1. Install Required Libraries:
 *    - ArduinoJson library (via Arduino IDE Library Manager)
 *    - ESP32 Board Support (via Board Manager)
 *
 * 2. Configuration:
 *    - Replace YOUR_WIFI_SSID with your WiFi network name
 *    - Replace YOUR_WIFI_PASSWORD with your WiFi password
 *    - Optionally add Firebase authentication token
 *
 * 3. Upload to ESP32:
 *    - Select appropriate ESP32 board in Arduino IDE
 *    - Upload the code to your ESP32 device
 *
 * 4. Monitor Serial Output:
 *    - Open Serial Monitor (115200 baud rate)
 *    - Verify WiFi connection and data uploads
 *
 * The code will automatically:
 * - Connect to WiFi
 * - Synchronize time with NTP server
 * - Generate realistic mock sensor data
 * - Upload data to Firebase every 10 seconds
 * - Handle connection errors and retries
 */
