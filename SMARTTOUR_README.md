# SmartTour - AI-Powered Intelligent Tourist Companion

## 🌍 Overview

SmartTour is a comprehensive AI-powered intelligent tourist companion designed to enhance the travel experience by providing personalized guidance, real-time assistance, and smart recommendations. The system leverages Agentic AI architecture where multiple autonomous AI agents collaborate to deliver tailored services.

## 🎯 Project Description

SmartTour addresses common challenges faced by tourists such as:

- Discovering attractions and interesting places
- Finding local food and restaurants
- Overcoming language barriers
- Booking local guides
- Ensuring safety in unfamiliar locations
- Planning optimal itineraries

## 🤖 AI Agents Architecture

The system includes six specialized autonomous AI agents coordinated by an Orchestrator:

### 1. **User Context Agent** 👤

- Analyzes and understands traveler preferences
- Builds comprehensive user profiles
- Tracks preferences based on interests, budget, and travel style
- Calculates personalization scores (adventure, comfort, cultural interest)
- Updates preferences based on user feedback

### 2. **Itinerary Planning Agent** 📅

- Generates optimized travel schedules
- Plans daily activities based on user interests and energy levels
- Allocates meals throughout the day
- Optimizes routes using routing algorithms
- Provides activity availability information

### 3. **Food Recommendation Agent** 🍽️

- Recommends local restaurants and food experiences
- Filters by dietary restrictions (vegetarian, vegan, halal, etc.)
- Suggests breakfast, lunch, dinner, and snacks
- Analyzes cuisine preferences
- Provides quick food search for nearby restaurants

### 4. **Translation Agent** 🌐

- Real-time language detection
- Multi-language translation support
- Provides common phrases in multiple languages (Hindi, Malayalam, etc.)
- Supports conversation mode for real-time communication
- Helps overcome language barriers

### 5. **Guide Matching Agent** 👨‍🏫

- Finds and scores local guides based on user compatibility
- Considers language preferences, specialties, budget
- Provides guide reviews and ratings
- Handles guide booking and confirmation
- Tracks availability and certification

### 6. **Safety Agent** 🛡️

- Assesses location safety and provides risk levels
- Provides emergency contacts and hotlines
- Offers health tips and vaccination recommendations
- Gives travel advisories and local law information
- Locates nearby hospitals and medical facilities

### **Orchestrator Agent** 🎭

- Coordinates all agents for seamless decision-making
- Plans complete user journeys
- Provides immediate assistance on demand
- Optimizes itineraries based on constraints
- Ensures all agents work together efficiently

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 16+ with React 19+
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect)
- **UI Components**: Custom React components

### Backend

- **Runtime**: Node.js with Next.js API Routes
- **APIs**: RESTful endpoints for all features

### External Services Integration

- **Maps**: OpenStreetMap (FREE, No API key required)
- **Routing**: OSRM (Open Source Routing Machine)
- **Weather**: Open-Meteo API
- **Places**: Overpass API
- **Translation**: MyMemory Translated.net (fallback)

### Architecture

- API-First Design
- Microservices-style agent architecture
- Stateless API endpoints
- Modular services

## 📁 Project Structure

```
smarttour-test/
├── app/
│   ├── api/
│   │   ├── agent/                 # AI Agent APIs
│   │   │   ├── journey/          # Journey planning
│   │   │   ├── guides/           # Guide matching
│   │   │   ├── food/             # Food recommendations
│   │   │   ├── safety/           # Safety info
│   │   │   └── translate/        # Translation
│   │   ├── directions/           # Routing API
│   │   ├── foursquare/           # Places search
│   │   ├── hotels/               # Hotel search
│   │   ├── places/               # Places search
│   │   ├── restaurants/          # Restaurant search
│   │   └── weather/              # Weather API
│   ├── globals.css               # Global styles
│   ├── layout.js                 # Root layout
│   └── page.js                   # Homepage with dashboard
├── components/
│   ├── Map.js                    # Interactive map explorer
│   ├── PlaceCard.js              # Place display component
│   ├── HotelCard.js              # Hotel display component
│   └── DirectionsPanel.js        # Directions component
├── lib/
│   └── services/
│       ├── openstreetmap.js      # OSM service
│       ├── routing.js            # OSRM routing service
│       ├── weather.js            # Weather service
│       └── agents/
│           ├── orchestrator.js               # Orchestrator
│           ├── userContextAgent.js           # User profiling
│           ├── itineraryPlannerAgent.js      # Trip planning
│           ├── foodRecommendationAgent.js    # Food recs
│           ├── translationAgent.js           # Translation
│           ├── guideMatchingAgent.js         # Guide matching
│           └── safetyAgent.js                # Safety info
└── package.json
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js 18+ or higher
- npm or yarn package manager

### Installation Steps

1. **Navigate to project directory**

```bash
cd smarttour-test
```

2. **Install dependencies**

```bash
npm install
```

3. **Run development server**

```bash
npm run dev
```

4. **Open in browser**

```
http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## 📊 API Endpoints

### Journey Planning

- **POST** `/api/agent/journey` - Plan complete user journey
- **GET** `/api/agent/journey?mode=template` - Get journey template

### Food Recommendations

- **POST** `/api/agent/food` - Get food recommendations
- **GET** `/api/agent/food?action=quick&lat=X&lng=Y` - Quick food search

### Guide Matching

- **POST** `/api/agent/guides` - Find matching guides
- **GET** `/api/agent/guides?id=GUIDE_ID&action=reviews` - Get guide reviews

### Safety Information

- **POST** `/api/agent/safety` - Assess location safety
- **GET** `/api/agent/safety?lat=X&lng=Y` - Get safety info
- **GET** `/api/agent/safety?lat=X&lng=Y&action=emergency` - Emergency contacts
- **GET** `/api/agent/safety?lat=X&lng=Y&action=health` - Health tips

### Translation

- **POST** `/api/agent/translate` - Translate text
- **GET** `/api/agent/translate?action=detect&text=HELLO` - Detect language
- **GET** `/api/agent/translate?action=phrases&lang=hi` - Get common phrases

### Maps & Places

- **GET** `/api/hotels?lat=X&lng=Y&radius=5000` - Find hotels
- **GET** `/api/restaurants?lat=X&lng=Y&radius=3000` - Find restaurants
- **GET** `/api/places?q=QUERY` - Search places
- **GET** `/api/foursquare?lat=X&lng=Y&q=QUERY` - Search nearby places
- **GET** `/api/weather?lat=X&lng=Y` - Get weather

### Directions & Routing

- **GET** `/api/directions?startLat=X&startLng=Y&endLat=A&endLng=B&profile=car` - Get directions
- **POST** `/api/directions` - Get alternative routes

## 🎨 Features & Functionality

### 1. Dashboard

- Welcome screen with agent descriptions
- One-click journey planning
- Overview of all features

### 2. Map Explorer

- Interactive place discovery
- Hotel, restaurant, and attraction search
- Location-based search
- Nearby places discovery

### 3. Itinerary Planning

- Auto-generated daily schedules
- Activity suggestions
- Meal planning
- 3-7 day trip support

### 4. Guide Matching

- Smart guide recommendations
- Language preference matching
- Specialty matching
- Rating and reviews system
- Direct booking

### 5. Weather Forecast

- Current weather conditions
- 7-day forecast
- Weather alerts
- Temperature, humidity, wind info

### 6. Safety Center

- Emergency contact numbers
- Location safety assessment
- Health tips
- Hospital locator
- Travel advisories

### 7. Translation Tool

- Real-time text translation
- Multi-language support
- Common phrases library
- Language detection

### 8. Directions

- Turn-by-turn navigation
- Multiple route alternatives
- Distance and time estimation
- Travel mode selection (car, bike, walking)

## 🎓 Team Members

1. **Aditya Aman** (Roll no: 9)
2. **Aditya Anand** (Roll no: 10)
3. **Alan John** (Roll no: 22)
4. **Ankit Kumar** (Roll no: 26)
5. **Krishna Kanhaiya** (Roll no: 62)

**Project Guide**: Ms. Rini Fernandez

## 🌟 Key Features Implemented

✅ Complete Agentic AI Architecture  
✅ User Context & Profiling  
✅ Automated Itinerary Generation  
✅ Food Recommendations with Dietary Support  
✅ Real-time Translation  
✅ Smart Guide Matching  
✅ Safety & Emergency Information  
✅ Weather Integration  
✅ Routing & Directions  
✅ Interactive Dashboard  
✅ RESTful API Architecture  
✅ Responsive UI Design  
✅ Mobile-friendly Interface

## 🔄 Data Flow

```
User Input
    ↓
Orchestrator Agent
    ↓
    ├── User Context Agent (Profile Analysis)
    ├── Itinerary Planner Agent (Schedule Creation)
    ├── Food Agent (Recommendations)
    ├── Translation Agent (Language Support)
    ├── Guide Matching Agent (Local Experts)
    └── Safety Agent (Emergency & Health)
    ↓
Integrated Response
    ↓
Frontend Display
```

## 🔐 Safety & Privacy

- No sensitive data stored locally
- All external API calls are secure
- Emergency contacts validated
- Privacy-first design approach

## 📱 Browser Support

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile browsers

## 🚀 Future Enhancements

1. **AR Monument Scanning** - Identify landmarks using AR camera
2. **Offline Support** - Work without internet in critical areas
3. **Crowd Prediction** - Predict crowds at attractions
4. **Weather Alerts** - Real-time weather notifications
5. **Budget Tracking** - Expense tracking during trip
6. **Social Features** - Share itineraries with friends
7. **Video Guides** - HD video tours of attractions
8. **Live Chat Support** - Real-time chat with local experts
9. **Blockchain Payments** - Secure crypto payments
10. **VR Experience** - Virtual tour previews

## 📝 License

This project is developed as an academic project under the guidance of Ms. Rini Fernandez.

## 🤝 Contributing

This is a complete implementation. For future versions, community contributions are welcome.

## 📧 Support

For issues and support, please contact the development team through the project repository.

---

### 🎉 SmartTour - Making Travel Smart, Safe, and Personalized!

**Transform Your Travel Experience with AI-Powered Intelligence**

Developed with ❤️ for travelers around the world.
