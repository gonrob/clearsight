import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.jsx";
import Dashboard from "./Dashboard.jsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// PostHog - optional analytics
const PH_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
const PH_HOST = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;
if (PH_KEY && PH_HOST) {
  import("posthog-js").then(({ default: posthog }) => {
    posthog.init(PH_KEY, {
      api_host: PH_HOST,
      person_profiles: "identified_only",
      capture_pageview: true,
    });
  }).catch(() => {});
}

const isDashboard = window.location.pathname === "/dashboard";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      {isDashboard ? <Dashboard /> : <App />}
    </ClerkProvider>
  </React.StrictMode>
);
