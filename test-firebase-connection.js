// Test Firebase Database Connection and Data Retrieval
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, query, orderByKey, limitToLast, onValue } from 'firebase/database';

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDvHo9LnSRl_LWJxUqflwCQTR4c-W5ZTn0",
    authDomain: "skyforge-4606b.firebaseapp.com",
    databaseURL: "https://skyforge-4606b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "skyforge-4606b",
    storageBucket: "skyforge-4606b.firebasestorage.app",
    messagingSenderId: "536827728653",
    appId: "1:536827728653:web:d8d2b6cc4a7e7f5aae87e7",
    measurementId: "G-05JVPK4Z5N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function testFirebaseData() {
    console.log('🔥 Testing Firebase database connection...');

    const sensorDataRef = ref(db, 'sensor_data');
    const testQuery = query(sensorDataRef, orderByKey(), limitToLast(5));

    onValue(testQuery, (snapshot) => {
        const data = snapshot.val();
        console.log('📊 Raw Firebase data structure:');
        console.log(JSON.stringify(data, null, 2));

        if (data) {
            console.log('\n📋 Records found:');
            Object.entries(data).forEach(([key, record]) => {
                console.log(`\n🔑 Key: ${key}`);
                console.log(`📅 Record:`, record);

                if (record && typeof record === 'object') {
                    const r = record;
                    console.log(`   - Temperature: ${r.temperature}°C`);
                    console.log(`   - Humidity: ${r.humidity}%`);
                    console.log(`   - CO2: ${r.co2} ppm`);
                    console.log(`   - Pressure: ${r.pressure} hPa`);
                    console.log(`   - UV Index: ${r.uvIndex}`);
                    console.log(`   - Timestamp: ${r.timestamp}`);
                    console.log(`   - Human Time: ${new Date(r.timestamp * 1000).toLocaleString()}`);
                }
            });
        } else {
            console.log('❌ No data found in sensor_data node');
        }

        process.exit(0);
    }, (error) => {
        console.error('🚨 Firebase read error:', error);
        process.exit(1);
    });
}

testFirebaseData().catch(console.error);
