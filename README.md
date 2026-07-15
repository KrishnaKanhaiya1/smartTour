# smartTour – AI-Powered Multi-Agent Travel Planner

An intelligent, location-aware travel concierge built with **Next.js** and orchestrated via **Google Gemini API**. It coordinates multiple specialized AI sub-agents to build, manage, and verify customized travel itineraries in real-time.

---

## 🎯 Key Features

* **AI Agent Orchestration**: Uses a dedicated `orchestrator.js` that splits user requests and delegates sub-tasks to distinct agent files (e.g., itinerary planning, translations, safety, and dining recommendation agents).
* **Interactive Dynamic Itineraries**: Adapts itineraries dynamically on user feedback or environmental signals.
* **Geospatial & Safety Integration**: Integrates OpenStreetMap and weather APIs, pairing recommendations with localized safety warnings (via a dedicated `safetyAgent.js`).
* **Food & Lodging Matching**: Scrapes and analyzes restaurant data to offer contextual dining maps.
* **On-the-fly Translation**: Translation agent that enables communication support.

---

## 🏗️ Architecture

```
├── app/
│   ├── api/
│   │   ├── agent/                 # Agent endpoints (chat, safety, hotels, journey)
│   │   └── places, weather, ...   # External integration APIs
│   └── page.js                    # Main view
├── components/                    # Tabbed panels (Map, Budget, Translate, SOS)
└── lib/
    ├── gemini.js                  # Model config
    └── services/
        └── agents/                # Agent source logic (itinerary, safety, translation, orchestrator)
```

---

## ⚙️ How to Setup

1. **Clone the Repo**
   ```bash
   git clone https://github.com/KrishnaKanhaiya1/smartTour.git
   cd smartTour
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Start Dev Server**
   ```bash
   npm run dev
   ```

---

## 💡 Engineering Takeaways

* **Decoupled Architecture**: Dividing task handling into specialized sub-agents instead of a single prompt monolithic model drastically improved latency and response accuracy.
* **State Syncing**: Synchronized leaf state components (maps, itinerary cards) smoothly using modular Next.js route handlers.
