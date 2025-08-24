import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import ErrorBoundary from "./components/ErrorBoundary"
import "./index.css"

const rootEl = document.getElementById("root")
if (!rootEl) console.error('Root element #root not found in index.html')

ReactDOM.createRoot(rootEl as HTMLElement).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)
