// Simple test to check what's in the database
// Run this in the browser console at http://localhost:5174

// Test Firebase connection manually
console.log('🔬 Manual Firebase Test');

// Check if Firebase is loaded
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // Import Firebase modules (this should work if the app loads)
  import('firebase/app').then(({ initializeApp }) => {
    import('firebase/database').then(({ getDatabase, ref, onValue, query, orderByKey, limitToLast }) => {
      
      const firebaseConfig = {
        apiKey: "AIzaSyA5IRjwAdvgSQ8K9sTkfdjEgFO_P1K-PdM",
        authDomain: "skyforge-4606b.firebaseapp.com",
        databaseURL: "https://skyforge-4606b-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "skyforge-4606b",
        storageBucket: "skyforge-4606b.firebasestorage.app",
        messagingSenderId: "113983013806",
        appId: "1:113983013806:web:b37570450de08e7a147e3f",
      };

      const app = initializeApp(firebaseConfig, 'test-app');
      const db = getDatabase(app);

      console.log('✅ Firebase initialized for testing');

      // Test connection
      const connectedRef = ref(db, '.info/connected');
      onValue(connectedRef, (snapshot) => {
        console.log('🌐 Connected:', snapshot.val());
      });

      // Check root structure
      const rootRef = ref(db);
      onValue(rootRef, (snapshot) => {
        const data = snapshot.val();
        console.log('🏗️ Root structure:', data ? Object.keys(data) : 'No data');
      }, { onlyOnce: true });

      // Check telemetry specifically
      const telemetryRef = ref(db, 'telemetry');
      const latestQuery = query(telemetryRef, orderByKey(), limitToLast(3));

      onValue(latestQuery, (snapshot) => {
        const data = snapshot.val();
        console.log('📊 Telemetry data (last 3):', data);
        
        if (data) {
          const keys = Object.keys(data);
          console.log('📊 Keys:', keys);
          
          keys.forEach(key => {
            console.log(`📊 Record ${key}:`, data[key]);
          });
        }
      }, { onlyOnce: true });

    }).catch(console.error);
  }).catch(console.error);
}
