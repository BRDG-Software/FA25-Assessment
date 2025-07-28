"use client";

import { GoogleAnalytics } from "nextjs-google-analytics";

export const GoogleAnalytic = () => {
  return (
    <>
      <GoogleAnalytics
        trackPageViews
        gaMeasurementId={process.env.TRACKINGI_ID} // Optional, can be set in .env
        debugMode={false} // Enable for debugging
      />
    </>
  );
};
