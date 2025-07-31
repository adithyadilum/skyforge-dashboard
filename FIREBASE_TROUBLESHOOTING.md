# 🔥 Firebase Connection Troubleshooting Guide

## Issue: Firebase credentials added but not working

### ✅ Fix Applied:
- **Environment variable spacing fixed** - removed leading spaces from .env file
- **Enhanced debugging** added to track connection status

### 🔍 Common Issues & Solutions:

## 1. **Environment Variables Not Loading**
**Problem**: .env file has leading spaces or incorrect format
**Solution**: ✅ **FIXED** - Environment variables now start at line beginning

## 2. **Firebase Realtime Database Rules**
**Most Common Issue**: Database rules might be blocking reads

### Check your Firebase Console:
1. Go to Firebase Console → Realtime Database → Rules
2. Current rules might be:
```json
{
  "rules": {
    ".read": false,
    ".write": false
  }
}
```

### **SOLUTION**: Change to (for testing):
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

## 3. **No Data in Database**
**Problem**: Database is empty
**Solution**: Add test data using the testData.js script

### Run Test Data Script:
```bash
cd "d:\Level 01 Sem02\Hardware Project\skyforge-dashboard"
node testData.js
```

## 4. **Wrong Database Region**
**Problem**: Database URL region mismatch
**Current**: asia-southeast1
**Verify**: Check Firebase Console → Realtime Database → URL

## 5. **Network/Firewall Issues**
**Problem**: Corporate firewall blocking Firebase
**Solution**: Test from different network or configure firewall

## 🔧 **Debugging Steps:**

### Step 1: Check Console Logs
Open browser developer tools → Console tab
Look for:
- ✅ Firebase configuration messages
- 🔴 Connection errors
- 📊 Data received messages

### Step 2: Test Connection
```javascript
// Run in browser console:
import('./src/debug/firebaseTest.js')
```

### Step 3: Verify Database Content
1. Go to Firebase Console
2. Realtime Database → Data tab
3. Check if `sensorData` and `systemData` nodes exist

## 🎯 **Expected Results:**
When working correctly, you should see:
- 🟢 "Live Data" indicator (green dot)
- Real sensor values instead of mock data
- Console logs: "📊 Real-time Firebase data received"

## 📋 **Database Structure Required:**
```json
{
  "sensorData": {
    "temperature": 25.6,
    "humidity": 60.2,
    "pressure": 1013.25,
    "uvIndex": 3.2,
    "co2": 420,
    "gps": {
      "latitude": 7.2906,
      "longitude": 80.6337
    }
  },
  "systemData": {
    "batteryVoltage": 12.4,
    "esp32Temperature": 38.5,
    "uptime": "02:15:30"
  }
}
```

## 🚨 **Emergency Fallback:**
If still not working, the app will show mock data with red "Mock Data" indicator.
This ensures the dashboard remains functional while debugging Firebase.
