import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import posthog from "posthog-js";
import App from "./App.jsx";
import Dashboard from "./Dashboard.jsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  person_profiles: "identified_only",
  capture_pageview: true,
  capture_pageleave: true,
});

const isDashboard = window.location.pathname === "/dashboard";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      {isDashboard ? <Dashboard /> : <App />}
    </ClerkProvider>
  </React.StrictMode>
);
