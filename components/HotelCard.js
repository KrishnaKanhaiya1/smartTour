'use client';

import { useState } from 'react';

export default function HotelCard({ hotel, onBook }) {
  const [expanded, setExpanded] = useState(false);

  const starRating = hotel.stars ? parseInt(hotel.stars) : Math.floor(Math.random() * 3) + 3;

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden cursor-pointer border-l-4 border-green-500"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg text-gray-900">
              {hotel.name}
            </h3>
            <div className="flex gap-1 mt-1">
              {[...Array(starRating)].map((_, i) => (
                <span key={i} className="text-yellow-500">★</span>
              ))}
            </div>
          </div>
          <div className="text-3xl">🏨</div>
        </div>

        <p className="text-sm text-gray-600 mb-2">
          {hotel.address || 'Address not available'}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            Hotel
          </span>
          {hotel.website && (
            <span className="text-xs text-blue-600 flex items-center gap-1">
              🌐 Has website
            </span>
          )}
        </div>

        {hotel.phone && (
          <p className="text-sm text-gray-600 mb-2">
            📞 {hotel.phone}
          </p>
        )}

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Rating</p>
                <p className="font-semibold">{starRating}/5 Stars</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Avg Price</p>
                <p className="font-semibold">₹3,500-5,000</p>
              </div>
            </div>

            {hotel.website && (
              <a
                href={hotel.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm hover:underline mb-3 inline-block"
              >
                Visit Website ↗
              </a>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onBook?.(hotel);
              }}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition transition font-semibold"
            >
              Book Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
