# SkyForge Dashboard Troubleshooting

## Dashboard Shows Nothing / Empty Screen

### Quick Fix Steps:

1. **Check if the development server is running:**
   ```bash
   npm run dev
   ```
   - Should show something like: `Local: http://localhost:5173/`

2. **Open your browser and go to:**
   - `http://localhost:5173`
   - Make sure you're using the correct port number

3. **Check browser console for errors:**
   - Press F12 to open developer tools
   - Look for any red error messages in the Console tab

4. **Verify dependencies are installed:**
   ```bash
   npm install
   ```

### Common Issues:

**Issue: "Module not found" errors**
- Solution: Run `npm install` to install all dependencies

**Issue: "Cannot read properties of undefined"**
- Solution: Check if all component files exist in the correct locations

**Issue: Port already in use**
- Solution: Try a different port: `npm run dev -- --port 3000`

**Issue: Blank white screen**
- Check browser console for JavaScript errors
- Verify all imports in App.tsx are correct
- Make sure all component files exist

### File Structure Check:
Ensure these files exist:
```
src/
├── App.tsx
├── main.tsx
├── index.css
├── components/
│   ├── LiveTab.tsx
│   ├── SystemTab.tsx
│   ├── AnalyticsTab.tsx
│   └── ui/
│       ├── card.tsx
│       ├── button.tsx
│       └── UvGauge.tsx
├── types/
│   └── index.ts
└── lib/
    └── utils.ts
```

### Development Server Logs:
When you run `npm run dev`, you should see:
```
> vite

  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Firebase Connection (Optional):
- Dashboard works with mock data even without Firebase
- Connection status shows "Mock Data" when Firebase is not configured
- This is normal and expected behavior

### Need Help?
1. Check the browser console (F12) for errors
2. Verify the development server is running
3. Make sure you're accessing the correct URL
4. Try refreshing the page (Ctrl+F5)
