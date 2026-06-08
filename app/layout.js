import "./globals.css";

export const metadata = {
  title: "SmartTour — AI-Powered Travel Companion",
  description: "SmartTour is an AI-powered travel companion with personalised itineraries, local guide matching, real-time translation, weather forecasts and safety assistance — built with Agentic AI.",
  keywords: "AI travel, smart tour, itinerary planner, travel guide, translation, safety",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800&f[]=satoshi@300,400,500,700,900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
