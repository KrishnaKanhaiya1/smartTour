import test from 'node:test';
import assert from 'node:assert/strict';
import { buildVerifiedJourney } from '../lib/services/itineraryBuilder.mjs';

test('buildVerifiedJourney creates a real itinerary from verified places', () => {
  const destination = 'Munnar';
  const center = { lat: 10.089, lng: 77.059 };
  const attractions = [
    {
      name: 'Eravikulam National Park',
      category: 'attraction',
      osmId: 'node/1',
      location: { lat: 10.12, lng: 77.06 },
      address: 'Munnar, Kerala',
      verified: true,
      mapUrl: 'https://maps.example/1',
    },
  ];
  const restaurants = [
    {
      name: 'Mountain View Cafe',
      cuisine: 'South Indian',
      osmId: 'node/2',
      location: { lat: 10.09, lng: 77.06 },
      address: 'Munnar',
      verified: true,
      mapUrl: 'https://maps.example/2',
    },
  ];
  const hotels = [
    {
      name: 'Cloud House',
      osmId: 'node/3',
      location: { lat: 10.09, lng: 77.05 },
      address: 'Munnar',
      verified: true,
      mapUrl: 'https://maps.example/3',
    },
  ];

  const result = buildVerifiedJourney({
    destination,
    center,
    attractions,
    restaurants,
    hotels,
    duration: 2,
    budget: 'moderate',
    style: 'balanced',
    interests: ['Nature', 'Food'],
    groupSize: 2,
  });

  assert.equal(result.destination, destination);
  assert.equal(result.itinerary.days.length, 2);
  assert.equal(result.itinerary.days[0].activities[0].verified, true);
  assert.ok(result.itinerary.days[0].activities[0].name.includes('Eravikulam'));
  assert.ok(!result.food.topRestaurants[0].name.includes('Fallback'));
  assert.ok(result.food.topRestaurants[0].verified);
  assert.ok(result.locations.length >= 2);
});
