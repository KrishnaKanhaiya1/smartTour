# SmartTour - AI-Powered Agentic Travel Companion

An intelligent, location-aware travel concierge built with **Next.js** and orchestrated via **Google Gemini API**. It coordinates multiple specialized AI sub-agents to build, manage, and verify customized travel itineraries in real-time.

---

## 🎯 Key Features

* **Multi-Agent AI Orchestration**: Uses a dedicated `orchestrator.js` that delegates sub-tasks to specialized agent modules (Itinerary Planner, Food Expert, Guide Matcher, Safety Advisor, Translation Agent, User Context Agent).
* **High-Availability Zero-Cost Architecture**: Built to run efficiently on Gemini 2.5 Flash with automatic multi-key parallel racing (`Promise.any`), 60s rate-limit cooldown, and 403 permanent key blacklisting.
* **Smart Travel Discovery**: High-accuracy recommendations for attractions, authentic local cuisine, verified hotels, and local tour guides.
* **Map & Route Directions**: Integrated OpenStreetMap Leaflet map with auto-centering on searched cities, OSRM turn-by-turn routing, and fallback location geocoding.
* **Safety & SOS Hub**: Destination safety intelligence ratings, emergency hotlines database, and a quick-launch SOS modal.
* **On-The-Fly Translation**: Multilingual translation for 16+ languages with voice output support.
* **Budget Tracker**: Track trip expenses with category breakdowns and remaining budget progress bars.

---

## 🏗️ Project Architecture

```
├── app/
│   ├── api/
│   │   ├── agent/                 # Agent endpoints (journey, chat, safety, hotels, food, guides)
│   │   └── directions, places...  # Location & routing API handlers
│   └── page.js                    # Main application view & tab state manager
├── components/                    # Modular tab panels (Attractions, Food, Hotels, Guides, Safety, Map, Budget, Translate)
├── lib/
│   ├── gemini.js                  # Gemini REST client, multi-key parallel racer, & circuit breaker
│   ├── validation.js              # Zod request & response validation schemas
│   └── services/
│       ├── openstreetmap.js       # OSM Nominatim & Overpass integration with node/way fallbacks
│       └── agents/                # Core sub-agents (journeyCombo, recommendation, food, guide, safety)
└── tests/                         # Playwright end-to-end integration test suite
```

---

## ⚙️ Setup & Local Running

1. **Clone Repository**
   ```bash
   git clone https://github.com/KrishnaKanhaiya1/smartTour.git
   cd smarttour-test
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file:
   ```env
   GEMINI_API_KEYS=key1,key2,key3,key4
   ```

4. **Run Local Dev Server**
   ```bash
   npm run dev
   ```

5. **Run Integration Tests**
   ```bash
   npx playwright test
   ```
