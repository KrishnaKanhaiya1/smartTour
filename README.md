# smartTour — Multi-Agent Travel Assistant

[![CI Build](https://github.com/KrishnaKanhaiya1/smartTour/actions/workflows/ci.yml/badge.svg)](https://github.com/KrishnaKanhaiya1/smartTour/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-success.svg?style=for-the-badge&logo=vercel)](https://smarttour-test.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-v14.x-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-v18.x-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3.x-38B2AC.svg)](https://tailwindcss.com/)
[![Google Gemini API](https://img.shields.io/badge/Gemini_API-Multi--Agent-orange.svg)](https://deepmind.google/technologies/gemini/)

An intelligent, location-aware travel concierge built with **Next.js App Router** and orchestrated via **Google Gemini API**. Coordinates a suite of specialized autonomous sub-agents to deliver real-time custom itineraries, culinary recommendations, accommodation guidance, and localized safety alerts.

---

## 🌐 Live Application
👉 **[Access Live Web App](https://smarttour-test.vercel.app/)**

---

## 🧠 Multi-Agent Delegation Architecture

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Router as Orchestrator Agent
    participant Itinerary as Itinerary Planner Agent
    participant Safety as Safety Protocols Agent
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

## 🛠️ Installation & Local Setup

```bash
git clone https://github.com/KrishnaKanhaiya1/smartTour.git
cd smartTour
cp .env.example .env.local
npm install
npm run dev
```
