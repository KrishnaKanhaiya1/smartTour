# 🗺️ smartTour — AI-Powered Autonomous Multi-Agent Travel Assistant

[![Next.js](https://img.shields.io/badge/Next.js-v14.x-black.svg?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-v18.x-61DAFB.svg?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3.x-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini API](https://img.shields.io/badge/Gemini_API-Multi--Agent-orange.svg?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-success.svg?style=for-the-badge&logo=vercel)](https://smarttour-test.vercel.app/)

> **An intelligent, location-aware travel concierge built with Next.js App Router and orchestrated via Google Gemini API.** Coordinates a suite of specialized autonomous sub-agents to deliver real-time custom itineraries, culinary recommendations, accommodation guidance, translation, and localized safety alerts.

---

## 🌐 Live Application
👉 **[Launch smartTour Live App](https://smarttour-test.vercel.app/)**

---

## 💡 Multi-Agent System Architecture

```mermaid
sequenceDiagram
    autonumber
    actor User as Traveler / User
    participant Router as Orchestrator Agent
    participant Itinerary as Itinerary Planner Agent
    participant Safety as Local Safety Protocols Agent
    participant Food as Culinary Recs Agent
    participant Gemini as Google Gemini API

    User->>Router: "Plan 3 days in Tokyo with safety advice"
    Router->>Itinerary: Delegate schedule generation
    Itinerary->>Gemini: Prompt structured JSON schedule
    Gemini-->>Itinerary: Return Day 1-3 Itinerary
    Router->>Safety: Delegate travel advisory check
    Safety->>Gemini: Fetch hyperlocal safety & embassy info
    Gemini-->>Safety: Return safety guidelines
    Router-->>User: Synthesized interactive dashboard
```

---

## ✨ UI Features & Functionality Inventory

| UI Feature Module | Interactive Functionality | Real User Flow |
| :--- | :--- | :--- |
| **Day-by-Day Itinerary Planner** | Generates hour-by-hour schedules based on destination, travel duration, and budget. | Input destination $\rightarrow$ Click "Generate Itinerary" $\rightarrow$ View interactive day timeline. |
| **Food & Culinary Recs Tab** | Recommends authentic local dishes, top-rated restaurants, and dietary filters. | Switch to Culinary tab $\rightarrow$ Filter by dietary preferences $\rightarrow$ View restaurant map cards. |
| **Local Safety Advisor** | Provides emergency contact numbers, embassy locations, and neighborhood safety scores. | Open Safety tab $\rightarrow$ Search target district $\rightarrow$ View safety alerts & SOS contact buttons. |
| **Real-time Language Translator** | Instant bidirectional translation for essential travel phrases and menu items. | Enter foreign text/phrase $\rightarrow$ Select target language $\rightarrow$ View phonetic translation. |
| **Local Guide Matcher** | Matches travelers with verified local guides based on spoken languages and interest tags. | Browse guides list $\rightarrow$ Filter by language/niche $\rightarrow$ Request booking profile. |
| **OpenStreetMap Navigation** | Interactive embedded map displaying places of interest, food spots, and hotels. | Click any itinerary location $\rightarrow$ Map automatically centers and highlights location pin. |

---

## 🛠️ Local Developer Setup

```bash
# Clone the repository
git clone https://github.com/KrishnaKanhaiya1/smartTour.git
cd smartTour/smarttour-test

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Run development server
npm run dev
```
