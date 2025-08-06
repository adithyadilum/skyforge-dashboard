# Skyforge Dashboard - Project Structure

## 📁 Project Organization

This project has been organized into a clean, maintainable structure following React best practices:

```
skyforge-dashboard/
├── 📁 docs/                     # Documentation files
│   ├── README.md                # Main project documentation
│   ├── FIREBASE_SETUP.md        # Firebase configuration guide
│   ├── ESP32_SETUP.md           # Hardware setup instructions
│   └── TROUBLESHOOTING.md       # Common issues and solutions
│
├── 📁 hardware/                 # Arduino/ESP32 code
│   └── esp32_sensor_code.ino    # Main sensor firmware
│
├── 📁 scripts/                  # Utility scripts and tests
│   ├── test-field-mapping.js    # Database field testing
│   ├── check-database.js        # Database connectivity tests
│   ├── debug-start.bat          # Debug launcher
│   └── *.html                   # Test HTML files
│
├── 📁 src/                      # Main application source
│   ├── 📁 components/           # React components
│   │   ├── 📁 tabs/             # Main application tabs
│   │   │   ├── LiveTab.tsx      # Real-time data display
│   │   │   ├── SystemTab.tsx    # System monitoring
│   │   │   ├── AnalyticsTab.tsx # Data analytics
│   │   │   └── index.ts         # Tab exports
│   │   │
│   │   ├── 📁 auth/             # Authentication components
│   │   │   ├── LoginPage.tsx    # Login interface
│   │   │   ├── UserProfile.tsx  # User profile management
│   │   │   └── index.ts         # Auth exports
│   │   │
│   │   └── 📁 ui/               # Reusable UI components
│   │       ├── card.tsx         # Card component
│   │       ├── button.tsx       # Button component
│   │       ├── badge.tsx        # Badge component
│   │       ├── input.tsx        # Input component
│   │       └── UvGauge.tsx      # UV index gauge
│   │
│   ├── 📁 services/             # Business logic & APIs
│   │   ├── firebaseService.ts   # Firebase database operations
│   │   ├── authService.ts       # Authentication service
│   │   └── databaseInspector.ts # Database debugging tools
│   │
│   ├── 📁 config/               # Configuration files
│   │   └── firebase.ts          # Firebase configuration
│   │
│   ├── 📁 utils/                # Utility functions
│   │   └── utils.ts             # Common helper functions
│   │
│   ├── 📁 types/                # TypeScript type definitions
│   │   └── index.ts             # Global type definitions
│   │
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                 # Application entry point
│   ├── index.css                # Global styles
│   └── vite-env.d.ts           # Vite type definitions
│
├── 📁 dist/                     # Build output (auto-generated)
├── 📁 node_modules/             # Dependencies (auto-generated)
├── package.json                 # Project dependencies & scripts
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── firebase.json               # Firebase hosting configuration
```

## 🎯 Key Benefits of This Organization

### **1. Separation of Concerns**
- **Components**: Organized by feature (tabs, auth, ui)
- **Services**: Business logic separated from UI
- **Utils**: Reusable helper functions
- **Config**: Environment and setup files

### **2. Scalability**
- Easy to add new tabs in `components/tabs/`
- Auth components centralized in `components/auth/`
- Shared UI components in `components/ui/`

### **3. Maintainability**
- Clear import paths with index files
- Documentation centralized in `docs/`
- Scripts and tools in dedicated `scripts/` folder

### **4. Clean Imports**
```typescript
// Before reorganization
import LiveTab from "./components/LiveTab"
import SystemTab from "./components/SystemTab"
import LoginPage from "./components/LoginPage"

// After reorganization
import { LiveTab, SystemTab, AnalyticsTab } from "./components/tabs"
import { LoginPage, UserProfile } from "./components/auth"
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Deploy to Firebase**
   ```bash
   npm run deploy
   ```

## 📚 Documentation

- **Setup Guides**: Check the `docs/` folder for detailed setup instructions
- **Hardware Code**: ESP32 firmware is in the `hardware/` folder
- **Testing Scripts**: Database and connectivity tests are in `scripts/`

## 🔧 Development

- **Add New Tab**: Create component in `src/components/tabs/` and add to index
- **Add Auth Feature**: Create component in `src/components/auth/` 
- **Add Utility**: Create function in `src/utils/`
- **Update Types**: Modify `src/types/index.ts`

This organization makes the codebase more professional, maintainable, and easier to navigate for both current development and future enhancements.
