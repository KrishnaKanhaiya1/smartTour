import { NextResponse } from 'next/server';
import { RoutingService } from '@/lib/services/routing';

const PROFILES = new Set(['car', 'bike', 'foot']);

function parseRouteInput(input) {
  const startLat = Number(input.startLat);
  const startLng = Number(input.startLng);
  const endLat = Number(input.endLat);
  const endLng = Number(input.endLng);
  const profile = PROFILES.has(input.profile) ? input.profile : 'car';

  if (![startLat, startLng, endLat, endLng].every(Number.isFinite)) {
    return { error: 'Start and destination coordinates are required.' };
  }
  if (Math.abs(startLat) > 90 || Math.abs(endLat) > 90 || Math.abs(startLng) > 180 || Math.abs(endLng) > 180) {
    return { error: 'One or more route coordinates are outside the valid range.' };
  }
  return { startLat, startLng, endLat, endLng, profile };
}

async function getRoute(input) {
  const parsed = parseRouteInput(input);
  if (parsed.error) return { error: parsed.error, status: 400 };

  try {
    const data = await RoutingService.getDirections(
      parsed.startLat, parsed.startLng, parsed.endLat, parsed.endLng, parsed.profile
    );
    return { data };
  } catch (error) {
    console.error('Routing service failed:', error);
    return { error: 'Live routing is temporarily unavailable. Please try again shortly.', status: 502 };
  }
}

function response(result) {
  return NextResponse.json(
    result.data ? { success: true, data: result.data } : { success: false, error: result.error },
    { status: result.status || 200 }
  );
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  return response(await getRoute(Object.fromEntries(searchParams)));
}

export async function POST(request) {
  try {
    return response(await getRoute(await request.json()));
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid route request.' }, { status: 400 });
  }
}
