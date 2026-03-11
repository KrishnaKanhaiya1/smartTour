// lib/services/weather.js

export class WeatherService {
  // Get weather for a location
  static async getWeather(lat, lng) {
    try {
      // Using Open-Meteo API (free, no key required)
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,relative_humidity_2m,apparent_temperature,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const dailyTimes = data.daily.time || [];
      const dailyMaxTemps = data.daily.temperature_2m_max || [];
      const dailyMinTemps = data.daily.temperature_2m_min || [];
      const dailyWeatherCodes = data.daily.weather_code || [];

      return {
        location: {
          lat,
          lng,
          timezone: data.timezone
        },
        current: {
          temperature: data.current.temperature_2m,
          apparentTemperature: data.current.apparent_temperature,
          weatherCode: data.current.weather_code,
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          description: this.getWeatherDescription(data.current.weather_code)
        },
        daily: dailyTimes.slice(0, 7).map((date, index) => ({
          date,
          maxTemp: dailyMaxTemps[index],
          minTemp: dailyMinTemps[index],
          weatherCode: dailyWeatherCodes[index],
          description: this.getWeatherDescription(dailyWeatherCodes[index])
        }))
      };
    } catch (error) {
      console.error('Weather API Error:', error);
      throw error;
    }
  }

  // Weather code descriptions (WMO codes)
  static getWeatherDescription(code) {
    const descriptions = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Foggy',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with hail',
      99: 'Thunderstorm with hail'
    };
    return descriptions[code] || 'Unknown';
  }

  // Get weather alerts for a location
  static async getWeatherAlerts(lat, lng) {
    try {
      // Using weather alerts API
      const response = await fetch(`https://api.weatherapi.com/v1/alerts.json?key=demo&q=${lat},${lng}`);
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      return data.alerts?.alert || [];
    } catch (error) {
      console.error('Weather Alerts Error:', error);
      return [];
    }
  }
}
