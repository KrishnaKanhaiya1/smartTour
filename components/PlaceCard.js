'use client';

import { useState } from 'react';

export default function PlaceCard({ place, onSelect }) {
  const [expanded, setExpanded] = useState(false);

  const defaultRating = Math.floor(Math.random() * 2) + 4; // Random between 4-5

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-4 cursor-pointer border-l-4 border-blue-500"
      onClick={() => {
        setExpanded(!expanded);
        onSelect?.(place);
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 mb-1">
            {place.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {place.address || 'Address not available'}
          </p>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {place.type || 'Place'}
            </span>
            {place.rating && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="text-sm font-semibold text-gray-700">
                  {place.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl mb-2">
            {place.type === 'restaurant' || place.type === 'cafe'
              ? '🍽️'
              : place.type === 'hotel'
              ? '🏨'
              : '📍'}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {place.phone && (
            <p className="text-sm text-gray-600 mb-2">
              <strong>📞 Phone:</strong> {place.phone}
            </p>
          )}
          {place.cuisine && (
            <p className="text-sm text-gray-600 mb-2">
              <strong>Cuisine:</strong> {place.cuisine}
            </p>
          )}
          {place.website && (
            <p className="text-sm text-blue-600 mb-2">
              <strong>Website:</strong>{' '}
              <a href={place.website} target="_blank" rel="noopener noreferrer">
                Visit Website
              </a>
            </p>
          )}
          <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            View Details
          </button>
        </div>
      )}
    </div>
  );
}
