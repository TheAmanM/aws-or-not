import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Home from "./pages/Home.tsx";
import { PostHogProvider } from "posthog-js/react";
import { BrowserRouter, Route, Routes } from "react-router";

import "./globals.css";
import type { PostHogConfig } from "posthog-js";
import Results from "./pages/Results.tsx";

const options: Partial<PostHogConfig> = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: "2025-05-24",
  cross_subdomain_cookie: false,
  __preview_disable_beacon: true,
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={options}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </BrowserRouter>
    </PostHogProvider>
  </StrictMode>
);
