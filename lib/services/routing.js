// lib/services/routing.js

export class RoutingService {
  // Get directions between two points
  static async getDirections(startLat, startLng, endLat, endLng, profile = 'car') {
    try {
      // Using OSRM (Open Source Routing Machine)
      const url = `https://router.project-osrm.org/route/v1/${profile}/${startLng},${startLat};${endLng},${endLat}?overview=full&steps=true&geometries=geojson`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        throw new Error('No route found');
      }

      const route = data.routes[0];
      const legs = route.legs || [];

      return {
        distance: route.distance, // in meters
        duration: route.duration, // in seconds
        geometry: route.geometry,
        summary: this.generateSummary(legs),
        instructions: this.extractInstructions(legs),
        profile
      };
    } catch (error) {
      console.error('Routing API Error:', error);
      throw error;
    }
  }

  // Get multiple route alternatives
  static async getAlternativeRoutes(startLat, startLng, endLat, endLng, profile = 'car') {
    try {
      const url = `https://router.project-osrm.org/route/v1/${profile}/${startLng},${startLat};${endLng},${endLat}?alternatives=true&overview=full&geometries=geojson`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.code !== 'Ok' || !data.routes) {
        throw new Error('No routes found');
      }

      return data.routes.map(route => ({
        distance: route.distance,
        duration: route.duration,
        geometry: route.geometry,
        summary: `${(route.distance / 1000).toFixed(2)} km, ${this.formatDuration(route.duration)}`
      }));
    } catch (error) {
      console.error('Alternative Routes Error:', error);
      throw error;
    }
  }

  // Extract turn-by-turn instructions
  static extractInstructions(legs) {
    const instructions = [];

    legs.forEach(leg => {
      if (leg.steps) {
        leg.steps.forEach(step => {
          if (step.maneuver) {
            const maneuver = step.maneuver;
            instructions.push({
              instruction: step.name || 'Continue',
              direction: maneuver.type,
              modifier: maneuver.modifier,
              distance: step.distance,
              duration: step.duration,
              coordinates: step.geometry.coordinates
            });
          }
        });
      }
    });

    return instructions;
  }

  // Generate route summary
  static generateSummary(legs) {
    if (!legs || legs.length === 0) return '';
    return legs.map(leg => leg.summary || 'Route segment').join(' -> ');
  }

  // Format duration in human-readable format
  static formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  // Calculate route matrix for multiple points
  static async getDistanceMatrix(coordinates) {
    try {
      const coordString = coordinates.map(c => `${c.lng},${c.lat}`).join(';');
      const url = `https://router.project-osrm.org/table/v1/car/${coordString}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        distances: data.distances, // matrix of distances in meters
        durations: data.durations, // matrix of durations in seconds
        sources: data.sources,
        destinations: data.destinations
      };
    } catch (error) {
      console.error('Distance Matrix Error:', error);
      throw error;
    }
  }
}
