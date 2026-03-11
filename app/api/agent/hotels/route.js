// app/api/agent/hotels/route.js
import { NextResponse } from 'next/server';
import { askGeminiJSON } from '@/lib/gemini';

const SYSTEM_PROMPT = `You are the Hotel Recommendation Agent for SmartTour.
You recommend real, specific hotels and accommodations for any destination.
Include a mix of budget, mid-range, and luxury options.
Always return valid JSON with accurate, helpful information.`;

export async function POST(request) {
  try {
    const body = await request.json();
    const { destination, budget, nights } = body;

    if (!destination) {
      return NextResponse.json({ success: false, error: 'Destination is required' }, { status: 400 });
    }

    const prompt = `Recommend 5 real hotels in ${destination} for a ${nights || 3}-night stay, ${budget || 'moderate'} budget.

Return JSON:
{
  "destination": "${destination}",
  "hotels": [{ "name": string, "neighborhood": string, "stars": number (1-5), "pricePerNight": number (USD), "totalPrice": number, "description": string (1-2 sentences), "amenities": string[] (3 items), "bookingTip": string, "type": string (Budget/Boutique/Mid-Range/Luxury/Resort/Hostel), "recommended": boolean }],
  "bookingAdvice": string
}`;

    try {
      const result = await askGeminiJSON(SYSTEM_PROMPT, prompt);
      return NextResponse.json({ success: true, data: result });
    } catch (apiError) {
      console.warn('Hotels API Fallback Triggered:', apiError);
      return NextResponse.json({
        success: true,
        data: {
          destination,
          hotels: [
            {
              name: "Local Boutique Hotel (Fallback)",
              neighborhood: "City Center",
              stars: 4,
              pricePerNight: 120,
              totalPrice: 120 * parseInt(nights || 3, 10),
              description: "AI generation is temporarily paused due to rate limits. Here is an example hotel.",
              amenities: ["Free WiFi", "Breakfast Included", "Pool"],
              bookingTip: "Book direct for better rates.",
              type: "Boutique",
              recommended: true
            },
            {
              name: "Global Chain Hotel (Fallback)",
              neighborhood: "Business District",
              stars: 3,
              pricePerNight: 85,
              totalPrice: 85 * parseInt(nights || 3, 10),
              description: "A reliable temporary fallback option.",
              amenities: ["Gym", "24/7 Desk"],
              bookingTip: "Look for loyalty discounts.",
              type: "Mid-Range",
              recommended: false
            }
          ],
          bookingAdvice: "Peak seasons see price hikes; always book early."
        }
      });
    }
  } catch (error) {
    console.error('Hotels Agent Route Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error while processing hotels.' }, { status: 500 });
  }
}
