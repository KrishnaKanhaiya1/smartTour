// lib/services/agents/userContextAgent.js

export class UserContextAgent {
  // Analyze user preferences and build profile
  async analyzePreferences(userData) {
    try {
      const profile = {
        userId: userData.userId || 'anonymous',
        name: userData.name || 'Tourist',
        language: userData.language || 'en',
        interests: this.categorizeInterests(userData.interests || []),
        budget: this.categorizeBudget(userData.budget || 'medium'),
        travelStyle: userData.travelStyle || 'balanced',
        mobilityNeeds: userData.mobilityNeeds || 'standard',
        dietaryRestrictions: userData.dietaryRestrictions || [],
        accessibility: userData.accessibility || {},
        preferredActivities: this.getActivityPreferences(userData),
        visitHistory: userData.visitHistory || [],
        preferredPace: userData.preferredPace || 'moderate',
        groupSize: userData.groupSize || 1,
        tripDuration: userData.tripDuration || 3,
        timeOfYear: userData.seasonPreference || 'any'
      };

      profile.adventureScore = this.calculateAdventureScore(profile);
      profile.comfortScore = this.calculateComfortScore(profile);
      profile.culturalScore = this.calculateCulturalScore(profile);

      return profile;
    } catch (error) {
      console.error('User Context Analysis Error:', error);
      throw error;
    }
  }

  // Categorize interests
  categorizeInterests(interests) {
    const categories = {
      cultural: ['museum', 'temple', 'historical', 'heritage', 'art', 'architecture'],
      adventure: ['hiking', 'trekking', 'camping', 'water sports', 'extreme sports'],
      food: ['cuisine', 'restaurant', 'street food', 'cooking', 'wine tasting'],
      nature: ['beach', 'forest', 'mountains', 'wildlife', 'national park'],
      nightlife: ['club', 'bar', 'music', 'entertainment', 'pub'],
      shopping: ['market', 'shopping', 'mall', 'boutique', 'souvenir'],
      relaxation: ['spa', 'yoga', 'meditation', 'retreat', 'wellness']
    };

    const categorized = {};
    interests.forEach(interest => {
      const lower = interest.toLowerCase();
      Object.entries(categories).forEach(([category, keywords]) => {
        if (keywords.some(keyword => lower.includes(keyword))) {
          categorized[category] = (categorized[category] || 0) + 1;
        }
      });
    });

    return categorized;
  }

  // Categorize budget
  categorizeBudget(budget) {
    // If budget is already an object (e.g. { tier: 'moderate', range: [...] }), return as-is
    if (budget && typeof budget === 'object') return budget;

    const budgetMap = {
      'low': { range: [0, 100], tier: 'budget' },
      'budget': { range: [0, 100], tier: 'budget' },
      'medium': { range: [100, 250], tier: 'moderate' },
      'moderate': { range: [100, 250], tier: 'moderate' },
      'high': { range: [250, 500], tier: 'premium' },
      'premium': { range: [250, 500], tier: 'premium' },
      'luxury': { range: [500, Infinity], tier: 'luxury' }
    };

    const key = (typeof budget === 'string') ? budget.toLowerCase() : 'medium';
    return budgetMap[key] || budgetMap.medium;
  }

  // Get activity preferences
  getActivityPreferences(userData) {
    return {
      indoor: userData.preferences?.indoor || false,
      outdoor: userData.preferences?.outdoor || true,
      familyFriendly: userData.preferences?.familyFriendly || false,
      petFriendly: userData.preferences?.petFriendly || false,
      groupActivities: userData.preferences?.groupActivities || true,
      soloPossible: userData.preferences?.soloPossible || true
    };
  }

  // Calculate adventure score (0-100)
  calculateAdventureScore(profile) {
    let score = 0;
    
    if (profile.interests.adventure) score += profile.interests.adventure * 25;
    if (profile.travelStyle === 'adventure') score += 30;
    if (profile.preferredPace === 'fast') score += 20;
    
    return Math.min(100, score);
  }

  // Calculate comfort score (0-100)
  calculateComfortScore(profile) {
    let score = 0;
    
    if (profile.budget.tier === 'luxury') score += 50;
    if (profile.travelStyle === 'luxury') score += 30;
    if (profile.preferredPace === 'slow') score += 20;
    
    return Math.min(100, score);
  }

  // Calculate cultural interest score (0-100)
  calculateCulturalScore(profile) {
    let score = 0;
    
    if (profile.interests.cultural) score += profile.interests.cultural * 20;
    if (profile.travelStyle === 'cultural') score += 40;
    
    return Math.min(100, score);
  }

  // Update user preferences based on feedback
  async updatePreferences(userId, feedback) {
    return {
      userId,
      feedbackProcessed: true,
      timestamp: new Date(),
      updatedPreferences: feedback
    };
  }
}
