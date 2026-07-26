import { z } from 'zod';

export const JourneyRequestSchema = z.object({
  destination: z.string().min(1),
  tripDuration: z.number().int().min(1).max(21).default(3),
  budget: z.union([z.string(), z.number(), z.object({ tier: z.string() })]).optional(),
  interests: z.array(z.string()).optional(),
  travelStyle: z.string().optional(),
  mood: z.string().optional(),
});

export const ActivitySchema = z.object({
  name: z.string(),
  time: z.string(),
  duration: z.number().default(1),
  category: z.string().default('attraction'),
  cost: z.string().default('Free'),
  description: z.string(),
  location: z.object({
    name: z.string(),
    address: z.string().default(''),
    lat: z.number(),
    lng: z.number(),
  }),
  osmId: z.string(),
  verified: z.boolean().default(false),
  mapUrl: z.string().nullable().optional(),
  tips: z.string().nullable().optional(),
});

export const DaySchema = z.object({
  day: z.number().int(),
  theme: z.string(),
  duration: z.string().default('1 Day'),
  activities: z.array(ActivitySchema),
  meals: z.object({
    breakfast: z.string().default('Hotel / Local Cafe'),
    lunch: z.string().default('Local Restaurant'),
    dinner: z.string().default('Local Diner'),
  }).default({}),
});

export const ItinerarySchema = z.object({
  destination: z.string(),
  duration: z.number().int(),
  itinerary: z.object({
    days: z.array(DaySchema),
    totalEstimatedCost: z.string().default('N/A'),
    packingTips: z.array(z.string()).default([]),
    transportTips: z.string().default('Use public transport or registered cabs.'),
  }),
});
