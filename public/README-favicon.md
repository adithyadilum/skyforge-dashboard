# Favicon Files

This directory contains various favicon formats for the SKYFORGE Dashboard:

## 🚁 **Icon Files**

- **`favicon.svg`** - Main 32x32 SVG favicon (modern browsers)
- **`favicon-16.svg`** - Simplified 16x16 SVG for small displays
- **`drone-icon.svg`** - Detailed 100x100 drone icon
- **`apple-touch-icon.svg`** - 180x180 icon for iOS home screen with branding
- **`manifest.json`** - Web app manifest for PWA support

## 🎨 **Design Features**

The drone icon includes:
- **White body** (#f8fafc) with light gray outlines for clean appearance
- **Gray arms and motors** (#64748b, #475569) for subtle contrast
- **Light gray propellers** (#cbd5e1, #e2e8f0) with transparency for motion effect
- **White LED indicators** (#f1f5f9, #e2e8f0) for status
- **White antenna** (#f8fafc) for communication
- **Dark camera gimbal** (#64748b) for drone authenticity
- **Dark background** for Apple touch icon contrast

## 📱 **Browser Support**

- **Modern browsers**: SVG favicons with crisp scaling
- **Safari**: Apple touch icon for iOS home screen
- **PWA**: Manifest for installable web app
- **Legacy browsers**: Fallback to alternate icons

## 🔧 **Implementation**

All icons are referenced in `index.html`:
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
<link rel="manifest" href="/manifest.json" />
```

The icons will automatically appear in:
- Browser tabs
- Bookmarks
- iOS/Android home screens (when added)
- Desktop shortcuts
