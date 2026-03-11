(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/smartTour/smarttour-test/components/Map.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Map
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/smartTour/smarttour-test/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/smartTour/smarttour-test/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function Map() {
    _s();
    const [location, setLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [places, setPlaces] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedType, setSelectedType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const searchPlaces = async (e)=>{
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setLoading(true);
        setError('');
        try {
            const resp = await fetch(`/api/places?q=${encodeURIComponent(searchQuery)}`);
            const data = await resp.json();
            if (data.success) {
                setPlaces(data.data);
                if (data.data.length === 0) setError('No places found for that search.');
            } else {
                setError(data.error || 'Search failed');
            }
        } catch (err) {
            setError('Network error: ' + err.message);
        } finally{
            setLoading(false);
        }
    };
    const getNearbyPlaces = async (type)=>{
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }
        setLoading(true);
        setError('');
        setPlaces([]);
        navigator.geolocation.getCurrentPosition(async (pos)=>{
            const { latitude, longitude } = pos.coords;
            setLocation({
                lat: latitude,
                lng: longitude
            });
            setSelectedType(type);
            try {
                const endpointMap = {
                    hotels: '/api/hotels',
                    restaurants: '/api/restaurants',
                    places: '/api/foursquare'
                };
                const endpoint = endpointMap[type] || '/api/foursquare';
                const resp = await fetch(`${endpoint}?lat=${latitude}&lng=${longitude}`);
                const data = await resp.json();
                if (data.success) {
                    setPlaces(data.data || []);
                    if ((data.data || []).length === 0) setError('No results found nearby.');
                } else {
                    setError(data.error || 'Failed to fetch places');
                }
            } catch (err) {
                setError('Error fetching places: ' + err.message);
            } finally{
                setLoading(false);
            }
        }, (err)=>{
            const msgs = {
                1: 'Location permission denied. Please allow location access.',
                2: 'Location unavailable. Try again.',
                3: 'Location request timed out.'
            };
            setError(msgs[err.code] || 'Geolocation error.');
            setLoading(false);
        }, {
            timeout: 10000
        });
    };
    const typeIcons = {
        hotels: '🏨',
        restaurants: '🍽️',
        places: '📍'
    };
    const typeColors = {
        hotels: 'rgba(16,185,129,0.15)',
        restaurants: 'rgba(245,158,11,0.15)',
        places: 'rgba(139,92,246,0.15)'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            height: '600px',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '20px',
                    borderBottom: '1px solid var(--border)',
                    backgroundColor: 'var(--bg-card-2)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: 10,
                            marginBottom: 14,
                            flexWrap: 'wrap'
                        },
                        children: [
                            {
                                type: 'hotels',
                                label: '🏨 Nearby Hotels'
                            },
                            {
                                type: 'restaurants',
                                label: '🍽️ Restaurants'
                            },
                            {
                                type: 'places',
                                label: '📍 Attractions'
                            }
                        ].map(({ type, label })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>getNearbyPlaces(type),
                                disabled: loading,
                                style: {
                                    padding: '9px 18px',
                                    borderRadius: 10,
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    border: selectedType === type ? '1px solid var(--accent)' : '1px solid var(--border)',
                                    background: selectedType === type ? 'var(--gradient-accent)' : 'var(--bg-card)',
                                    color: 'var(--text-primary)',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.6 : 1,
                                    transition: 'all 0.2s'
                                },
                                children: label
                            }, type, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
                                lineNumber: 101,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
                        lineNumber: 95,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: searchPlaces,
                        style: {
                            display: 'flex',
                            gap: 10
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: searchQuery,
                                onChange: (e)=>setSearchQuery(e.target.value),
                                placeholder: "Search for any place...",
                                className: "input-field",
                                style: {
                                    flex: 1
                                }
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
                                lineNumber: 124,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: loading,
                                className: "btn-primary",
                                style: {
                                    flexShrink: 0
                                },
                                children: loading ? '...' : '🔍 Search'
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
                                lineNumber: 132,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
                        lineNumber: 123,
                        columnNumber: 9
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginTop: 10,
                            padding: '10px 14px',
                            borderRadius: 8,
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            color: '#f87171',
                            fontSize: '0.85rem'
                        },
                        children: [
                            "⚠️ ",
                            error
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
                        lineNumber: 143,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
                lineNumber: 94,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    overflow: 'auto'
                },
                children: [
                    location && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '10px 20px',
                            borderBottom: '1px solid var(--border)',
                            background: 'rgba(99,102,241,0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            fontSize: '0.8rem',
                            color: 'var(--text-secondary)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "📍"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
                                lineNumber: 171,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Your location: ",
                                    location.lat.toFixed(4),
                                    ", ",
                                    location.lng.toFixed(4)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
                                lineNumber: 172,
                                columnNumber: 13
                            }, this),
                            selectedType && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "pill pill-blue",
                                style: {
                                    marginLeft: 'auto'
                                },
                                children: [
                                    typeIcons[selectedType],
                                    " Showing ",
                                    selectedType
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
                                lineNumber: 174,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
                        lineNumber: 161,
                        columnNumber: 11
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            gap: 14,
                            padding: 40
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "animate-spin",
                                style: {
                                    width: 36,
                                    height: 36,
                                    border: '3px solid var(--border)',
                                    borderTopColor: 'var(--accent)',
                                    borderRadius: '50%'
                                }
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
                                lineNumber: 184,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color: 'var(--text-muted)',
                                    fontSize: '0.875rem'
                                },
                                children: "Searching nearby places..."
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
                                lineNumber: 185,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
                        lineNumber: 183,
                        columnNumber: 11
                    }, this) : places.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '16px 20px',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                            gap: 12
                        },
                        children: places.map((place, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: 'var(--bg-card-2)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 12,
                                    padding: 14,
                                    transition: 'all 0.2s',
                                    cursor: 'pointer'
                                },
                                onMouseEnter: (e)=>{
                                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
                                    e.currentTarget.style.background = 'rgba(99,102,241,0.06)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                },
                                onMouseLeave: (e)=>{
                                    e.currentTarget.style.borderColor = 'var(--border)';
                                    e.currentTarget.style.background = 'var(--bg-card-2)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 700,
                                            fontSize: '0.875rem',
                                            color: 'var(--text-primary)',
                                            marginBottom: 6,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        },
                                        children: place.name
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
                                        lineNumber: 211,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '0.78rem',
                                            color: 'var(--text-muted)',
                                            marginBottom: 8,
                                            lineHeight: 1.4,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        },
                                        children: place.address || place.fullAddress || place.cuisine || place.type || 'No description'
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
                                        lineNumber: 214,
                                        columnNumber: 17
                                    }, this),
                                    place.phone && place.phone !== 'N/A' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '0.75rem',
                                            color: 'var(--text-secondary)'
                                        },
                                        children: [
                                            "📞 ",
                                            place.phone
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
                                        lineNumber: 218,
                                        columnNumber: 19
                                    }, this),
                                    place.rating && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '0.78rem',
                                            color: '#fbbf24',
                                            marginTop: 4
                                        },
                                        children: [
                                            "★ ",
                                            place.rating
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
                                        lineNumber: 221,
                                        columnNumber: 19
                                    }, this),
                                    place.type && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 8
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "pill pill-blue",
                                            style: {
                                                fontSize: '0.7rem'
                                            },
                                            children: place.type
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
                                            lineNumber: 225,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
                                        lineNumber: 224,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, place.id || i, true, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
                                lineNumber: 190,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
                        lineNumber: 188,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            gap: 12,
                            padding: 40,
                            textAlign: 'center'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '2.5rem',
                                    opacity: 0.4
                                },
                                children: "🗺️"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
                                lineNumber: 233,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontWeight: 700,
                                    color: 'var(--text-primary)',
                                    fontSize: '0.95rem'
                                },
                                children: "Explore Places Around You"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
                                lineNumber: 234,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color: 'var(--text-muted)',
                                    fontSize: '0.85rem',
                                    maxWidth: 300
                                },
                                children: "Click a category button above to find nearby hotels, restaurants and attractions, or search for a specific location."
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
                                lineNumber: 235,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
                        lineNumber: 232,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
                lineNumber: 158,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/smartTour/smarttour-test/components/Map.js",
        lineNumber: 92,
        columnNumber: 5
    }, this);
}
_s(Map, "wBIxpfjU6LpNFurnUlEyhvv04ws=");
_c = Map;
var _c;
__turbopack_context__.k.register(_c, "Map");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DirectionsPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/smartTour/smarttour-test/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/smartTour/smarttour-test/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function DirectionsPanel() {
    _s();
    const [startLocation, setStartLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [endLocation, setEndLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('car');
    const [directions, setDirections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const getDirections = async (e)=>{
        e.preventDefault();
        setError('');
        setDirections(null);
        setLoading(true);
        try {
            // Using hardcoded demo coordinates (Kochi → Bangalore)
            const demoStart = {
                lat: 8.5241,
                lng: 76.9366
            }; // Kochi, Kerala
            const demoEnd = {
                lat: 12.9716,
                lng: 77.5946
            }; // Bangalore
            const resp = await fetch('/api/directions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    startLat: demoStart.lat,
                    startLng: demoStart.lng,
                    endLat: demoEnd.lat,
                    endLng: demoEnd.lng,
                    profile: mode
                })
            });
            const data = await resp.json();
            if (data.success && data.data) {
                // POST returns getAlternativeRoutes which returns an array
                const route = Array.isArray(data.data) ? data.data[0] : data.data;
                setDirections(route);
            } else {
                setError(data.error || 'Failed to get directions');
            }
        } catch (err) {
            setError('Network error: ' + err.message);
        } finally{
            setLoading(false);
        }
    };
    const fmtDist = (m)=>m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;
    const fmtDur = (s)=>{
        const h = Math.floor(s / 3600);
        const m = Math.floor(s % 3600 / 60);
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };
    const modeConfig = {
        car: {
            icon: '🚗',
            label: 'Car',
            color: 'var(--accent)'
        },
        bike: {
            icon: '🏍️',
            label: 'Bike',
            color: 'var(--orange)'
        },
        foot: {
            icon: '🚶',
            label: 'Walking',
            color: 'var(--green)'
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '28px',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: getDirections,
                style: {
                    marginBottom: 24
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 16,
                            marginBottom: 20
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "input-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "input-label",
                                        children: "Start Location"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                        lineNumber: 70,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: startLocation,
                                        onChange: (e)=>setStartLocation(e.target.value),
                                        placeholder: "e.g. Kochi, Kerala",
                                        className: "input-field"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                        lineNumber: 71,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '0.75rem',
                                            color: 'var(--text-muted)',
                                            marginTop: 4
                                        },
                                        children: "📍 Demo uses Kochi, Kerala"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                        lineNumber: 78,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                lineNumber: 69,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "input-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "input-label",
                                        children: "Destination"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                        lineNumber: 83,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: endLocation,
                                        onChange: (e)=>setEndLocation(e.target.value),
                                        placeholder: "e.g. Bangalore",
                                        className: "input-field"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                        lineNumber: 84,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '0.75rem',
                                            color: 'var(--text-muted)',
                                            marginTop: 4
                                        },
                                        children: "🏁 Demo uses Bangalore"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                        lineNumber: 91,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                lineNumber: 82,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: 20
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "input-label",
                                style: {
                                    marginBottom: 12
                                },
                                children: "Travel Mode"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                lineNumber: 98,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: 10
                                },
                                children: Object.entries(modeConfig).map(([key, cfg])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            cursor: 'pointer',
                                            padding: '10px 18px',
                                            borderRadius: 10,
                                            border: mode === key ? `1px solid var(--accent)` : '1px solid var(--border)',
                                            background: mode === key ? 'rgba(99,102,241,0.1)' : 'var(--bg-card-2)',
                                            transition: 'all 0.2s'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "radio",
                                                name: "mode",
                                                value: key,
                                                checked: mode === key,
                                                onChange: ()=>setMode(key),
                                                style: {
                                                    display: 'none'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                                lineNumber: 115,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '1.1rem'
                                                },
                                                children: cfg.icon
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                                lineNumber: 123,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                    color: mode === key ? 'var(--accent)' : 'var(--text-secondary)'
                                                },
                                                children: cfg.label
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                                lineNumber: 124,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, key, true, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                        lineNumber: 101,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                lineNumber: 99,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        disabled: loading,
                        className: "btn-primary",
                        style: {
                            width: '100%',
                            justifyContent: 'center',
                            display: 'flex',
                            gap: 8,
                            alignItems: 'center'
                        },
                        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "spinner",
                                    style: {
                                        width: 16,
                                        height: 16
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                    lineNumber: 134,
                                    columnNumber: 17
                                }, this),
                                " Finding best route..."
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "🧭"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                    lineNumber: 135,
                                    columnNumber: 17
                                }, this),
                                " Get Directions"
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '12px 16px',
                    borderRadius: 10,
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    color: '#f87171',
                    fontSize: '0.875rem',
                    marginBottom: 20
                },
                children: [
                    "⚠️ ",
                    error
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                lineNumber: 141,
                columnNumber: 9
            }, this),
            directions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    animation: 'fadeUp 0.4s ease forwards'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            borderRadius: 16,
                            padding: 24,
                            background: 'var(--bg-card-2)',
                            border: '1px solid rgba(99,102,241,0.3)',
                            marginBottom: 20
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    color: 'var(--text-muted)',
                                    marginBottom: 16
                                },
                                children: "Route Summary"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                lineNumber: 164,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: 16,
                                    marginBottom: 16
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '0.78rem',
                                                    color: 'var(--text-muted)',
                                                    marginBottom: 4
                                                },
                                                children: "Total Distance"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                                lineNumber: 169,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '2rem',
                                                    fontWeight: 800,
                                                    color: 'var(--accent)',
                                                    fontFamily: "'Syne', sans-serif"
                                                },
                                                children: fmtDist(directions.distance || 0)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                                lineNumber: 170,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                        lineNumber: 168,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '0.78rem',
                                                    color: 'var(--text-muted)',
                                                    marginBottom: 4
                                                },
                                                children: "Estimated Time"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                                lineNumber: 175,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '2rem',
                                                    fontWeight: 800,
                                                    color: 'var(--green)',
                                                    fontFamily: "'Syne', sans-serif"
                                                },
                                                children: fmtDur(directions.duration || 0)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                                lineNumber: 176,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                        lineNumber: 174,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                lineNumber: 167,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: 8,
                                    flexWrap: 'wrap'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "pill pill-blue",
                                        children: [
                                            modeConfig[mode]?.icon,
                                            " ",
                                            modeConfig[mode]?.label
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                        lineNumber: 182,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "pill pill-green",
                                        children: "🛣️ Optimised Route"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                        lineNumber: 185,
                                        columnNumber: 15
                                    }, this),
                                    directions.summary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "pill pill-purple",
                                        style: {
                                            fontSize: '0.7rem',
                                            maxWidth: 200,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        },
                                        children: directions.summary
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                        lineNumber: 187,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                lineNumber: 181,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                        lineNumber: 157,
                        columnNumber: 11
                    }, this),
                    directions.instructions && directions.instructions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: 'var(--bg-card-2)',
                            border: '1px solid var(--border)',
                            borderRadius: 16,
                            padding: 20
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    color: 'var(--text-primary)',
                                    marginBottom: 16
                                },
                                children: "📋 Turn-by-Turn Instructions"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                lineNumber: 197,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    directions.instructions.slice(0, 8).map((step, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "direction-step",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "step-number",
                                                    children: i + 1
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                                    lineNumber: 203,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "step-text",
                                                            children: [
                                                                step.direction ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    style: {
                                                                        color: 'var(--accent)'
                                                                    },
                                                                    children: [
                                                                        step.direction,
                                                                        " "
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                                                    lineNumber: 206,
                                                                    columnNumber: 43
                                                                }, this) : null,
                                                                step.instruction || 'Continue'
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                                            lineNumber: 205,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "step-meta",
                                                            children: [
                                                                fmtDist(step.distance || 0),
                                                                " · ",
                                                                fmtDur(step.duration || 0)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                                            lineNumber: 209,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                                    lineNumber: 204,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, i, true, {
                                            fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                            lineNumber: 202,
                                            columnNumber: 19
                                        }, this)),
                                    directions.instructions.length > 8 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            textAlign: 'center',
                                            padding: '12px 0',
                                            fontSize: '0.8rem',
                                            color: 'var(--text-muted)',
                                            fontStyle: 'italic'
                                        },
                                        children: [
                                            "+ ",
                                            directions.instructions.length - 8,
                                            " more steps"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                        lineNumber: 216,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                                lineNumber: 200,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                        lineNumber: 196,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                lineNumber: 155,
                columnNumber: 9
            }, this),
            !directions && !loading && !error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    textAlign: 'center',
                    padding: '48px 24px',
                    background: 'var(--bg-card-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 16
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: '2.5rem',
                            marginBottom: 12,
                            opacity: 0.5
                        },
                        children: "🧭"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                        lineNumber: 234,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            marginBottom: 8
                        },
                        children: "Ready to Navigate"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                        lineNumber: 235,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            color: 'var(--text-muted)',
                            fontSize: '0.875rem'
                        },
                        children: 'Click "Get Directions" to find the best route from Kochi to Bangalore using the OSRM routing engine.'
                    }, void 0, false, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                        lineNumber: 236,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
                lineNumber: 227,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_s(DirectionsPanel, "Y8+qfFWmbewMt7JvQJMvzDKmcqQ=");
_c = DirectionsPanel;
var _c;
__turbopack_context__.k.register(_c, "DirectionsPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/smartTour/smarttour-test/app/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/smartTour/smarttour-test/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/smartTour/smarttour-test/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$components$2f$Map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/smartTour/smarttour-test/components/Map.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$components$2f$DirectionsPanel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/smartTour/smarttour-test/components/DirectionsPanel.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const TABS = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: '🏠'
    },
    {
        id: 'itinerary',
        label: 'Itinerary',
        icon: '📅'
    },
    {
        id: 'guides',
        label: 'Guides',
        icon: '👨‍🏫'
    },
    {
        id: 'food',
        label: 'Food',
        icon: '🍽️'
    },
    {
        id: 'weather',
        label: 'Weather',
        icon: '🌤️'
    },
    {
        id: 'safety',
        label: 'Safety',
        icon: '🛡️'
    },
    {
        id: 'translate',
        label: 'Translate',
        icon: '🌐'
    },
    {
        id: 'map',
        label: 'Map',
        icon: '🗺️'
    },
    {
        id: 'directions',
        label: 'Directions',
        icon: '🧭'
    }
];
const FEATURES = [
    {
        icon: '🤖',
        title: 'Context Agent',
        desc: 'Learns your travel preferences and style'
    },
    {
        icon: '📅',
        title: 'AI Itinerary',
        desc: 'Generates optimised day-by-day plans'
    },
    {
        icon: '🍽️',
        title: 'Food Expert',
        desc: 'Curates authentic local cuisine picks'
    },
    {
        icon: '🌐',
        title: 'Translator',
        desc: 'Real-time language assistance'
    },
    {
        icon: '👨‍🏫',
        title: 'Guide Matcher',
        desc: 'Connects you with verified local guides'
    },
    {
        icon: '🛡️',
        title: 'Safety Advisor',
        desc: 'Emergency info & real-time safety'
    }
];
function Home() {
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('dashboard');
    const [journey, setJourney] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [guides, setGuides] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [weather, setWeather] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [translation, setTranslation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [safetyInfo, setSafetyInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [successMessage, setSuccessMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const clearMessages = ()=>{
        setError('');
        setSuccessMessage('');
    };
    const showError = (msg)=>{
        setError(msg);
        setTimeout(()=>setError(''), 6000);
    };
    const showSuccess = (msg)=>{
        setSuccessMessage(msg);
        setTimeout(()=>setSuccessMessage(''), 5000);
    };
    const planJourney = async ()=>{
        clearMessages();
        setLoading(true);
        try {
            const userData = {
                userId: 'user_' + Date.now(),
                name: 'Smart Tourist',
                language: 'en',
                interests: [
                    'cultural',
                    'nature',
                    'food',
                    'adventure'
                ],
                budget: 'medium',
                travelStyle: 'balanced',
                tripDuration: 3,
                groupSize: 2,
                dietaryRestrictions: []
            };
            const resp = await fetch('/api/agent/journey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            const data = await resp.json();
            if (data.success) {
                setJourney(data.data);
                showSuccess('Journey planned successfully!');
                const gResp = await fetch('/api/agent/guides', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data.data.userProfile)
                });
                const gData = await gResp.json();
                if (gData.success) setGuides(gData.data);
            } else {
                showError(data.error || 'Failed to plan journey');
            }
        } catch (e) {
            showError('Network error: ' + e.message);
        } finally{
            setLoading(false);
        }
    };
    const getWeather = async ()=>{
        clearMessages();
        setLoading(true);
        try {
            const resp = await fetch('/api/weather?lat=8.5241&lng=76.9366');
            const data = await resp.json();
            if (data.success) {
                setWeather(data.data);
                showSuccess('Weather data loaded!');
            } else showError(data.error || 'Failed to fetch weather');
        } catch (e) {
            showError('Error: ' + e.message);
        } finally{
            setLoading(false);
        }
    };
    const translateText = async ()=>{
        clearMessages();
        setLoading(true);
        try {
            const resp = await fetch('/api/agent/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: 'Hello! I am looking for a restaurant. Can you help me?',
                    targetLanguage: 'hi'
                })
            });
            const data = await resp.json();
            if (data.success) {
                setTranslation(data.data);
                showSuccess('Translation complete!');
            } else showError(data.error || 'Failed to translate');
        } catch (e) {
            showError('Error: ' + e.message);
        } finally{
            setLoading(false);
        }
    };
    const getSafetyInfo = async ()=>{
        clearMessages();
        setLoading(true);
        try {
            const resp = await fetch('/api/agent/safety?lat=8.5241&lng=76.9366&action=emergency');
            const data = await resp.json();
            if (data.success) {
                setSafetyInfo(data.data);
                showSuccess('Safety information loaded!');
            } else showError(data.error || 'Failed to fetch safety info');
        } catch (e) {
            showError('Error: ' + e.message);
        } finally{
            setLoading(false);
        }
    };
    const switchTab = (id)=>{
        clearMessages();
        setActiveTab(id);
    };
    const weatherEmoji = (code)=>{
        if (code === 0 || code === 1) return '☀️';
        if (code === 2 || code === 3) return '⛅';
        if (code >= 45 && code <= 48) return '🌫️';
        if (code >= 51 && code <= 67) return '🌧️';
        if (code >= 71 && code <= 77) return '❄️';
        if (code >= 80 && code <= 82) return '🌦️';
        if (code >= 95) return '⛈️';
        return '🌡️';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            minHeight: '100vh'
        },
        children: [
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "toast toast-error",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "⚠️"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                        lineNumber: 162,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                        lineNumber: 163,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                lineNumber: 161,
                columnNumber: 9
            }, this),
            successMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "toast toast-success",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "✅"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                        lineNumber: 168,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: successMessage
                    }, void 0, false, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                        lineNumber: 169,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                lineNumber: 167,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "header",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "header-inner",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-3",
                            style: {
                                alignItems: 'center'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "animate-float",
                                    style: {
                                        fontSize: '1.8rem'
                                    },
                                    children: "🌍"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                    lineNumber: 177,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "logo-mark",
                                            children: "SmartTour"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                            lineNumber: 179,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: '0.7rem',
                                                color: 'var(--text-muted)',
                                                marginTop: '-2px'
                                            },
                                            children: "AI Travel Companion"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                            lineNumber: 180,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                    lineNumber: 178,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                            lineNumber: 176,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-3",
                            style: {
                                alignItems: 'center'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "badge-ai",
                                    children: "Agentic AI"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                    lineNumber: 184,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: planJourney,
                                    disabled: loading,
                                    className: "btn-primary",
                                    style: {
                                        padding: '9px 20px',
                                        fontSize: '0.8rem'
                                    },
                                    children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "spinner",
                                                style: {
                                                    width: 14,
                                                    height: 14
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 191,
                                                columnNumber: 28
                                            }, this),
                                            " Planning..."
                                        ]
                                    }, void 0, true) : '🚀 Plan Journey'
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                    lineNumber: 185,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                            lineNumber: 183,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                    lineNumber: 175,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                lineNumber: 174,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "nav-tabs",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "nav-tabs-inner",
                    children: TABS.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>switchTab(tab.id),
                            className: `tab-btn${activeTab === tab.id ? ' active' : ''}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: tab.icon
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                    lineNumber: 206,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: tab.label
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                    lineNumber: 207,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, tab.id, true, {
                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                            lineNumber: 201,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                    lineNumber: 199,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                lineNumber: 198,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "main-content",
                children: [
                    activeTab === 'dashboard' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-fade-up",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hero",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hero-eyebrow",
                                        children: "✨ Powered by Multi-Agent AI"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 221,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "hero-title",
                                        children: [
                                            "Your ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "highlight",
                                                children: "Perfect Journey"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 223,
                                                columnNumber: 22
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 223,
                                                columnNumber: 72
                                            }, this),
                                            "Starts Here"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 222,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "hero-description",
                                        children: "Discover personalised itineraries, local guides, authentic cuisine, real-time translation and safety insights — all orchestrated by AI agents working in harmony."
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 225,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-3",
                                        style: {
                                            flexWrap: 'wrap'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: planJourney,
                                                disabled: loading,
                                                className: "hero-btn",
                                                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "spinner",
                                                            style: {
                                                                width: 16,
                                                                height: 16
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                            lineNumber: 236,
                                                            columnNumber: 25
                                                        }, this),
                                                        " Planning your journey..."
                                                    ]
                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "🚀"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                            lineNumber: 237,
                                                            columnNumber: 25
                                                        }, this),
                                                        " Plan My Journey"
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 230,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>switchTab('map'),
                                                className: "btn-ghost",
                                                children: "Explore Map →"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 240,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 229,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 220,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "section-title",
                                        children: "AI Agent Network"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 248,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "section-subtitle",
                                        children: "Six specialised agents working in real-time to make your travel seamless"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 249,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "feature-grid",
                                        children: FEATURES.map((f, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "feature-card",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "feature-icon",
                                                        children: f.icon
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 253,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "feature-title",
                                                        children: f.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 254,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "feature-desc",
                                                        children: f.desc
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 255,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 252,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 250,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 247,
                                columnNumber: 13
                            }, this),
                            journey && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "journey-result animate-fade-up",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-between mb-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "section-title",
                                                style: {
                                                    marginBottom: 0
                                                },
                                                children: "✨ Your Journey Plan"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 265,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "pill pill-green",
                                                children: "Active"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 266,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 264,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "stats-row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "stat-card",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "stat-value",
                                                        children: journey.itinerary?.duration || 3
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 271,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "stat-label",
                                                        children: "Days Planned"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 272,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 270,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "stat-card",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "stat-value",
                                                        children: journey.userProfile?.adventureScore || 75
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 275,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "stat-label",
                                                        children: "Adventure Score"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 276,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 274,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "stat-card",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "stat-value",
                                                        style: {
                                                            fontSize: '1.2rem',
                                                            textTransform: 'capitalize'
                                                        },
                                                        children: journey.userProfile?.travelStyle
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 279,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "stat-label",
                                                        children: "Travel Style"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 280,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 278,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "stat-card",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "stat-value",
                                                        children: journey.userProfile?.groupSize
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 283,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "stat-label",
                                                        children: "Travellers"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 284,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 282,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 269,
                                        columnNumber: 17
                                    }, this),
                                    journey.itinerary?.days && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                style: {
                                                    fontWeight: 700,
                                                    color: 'var(--text-primary)',
                                                    marginBottom: 16,
                                                    fontSize: '1rem'
                                                },
                                                children: "Daily Schedule"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 290,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3",
                                                children: journey.itinerary.days.map((d, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "journey-day-card",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex gap-3",
                                                                style: {
                                                                    alignItems: 'center'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            width: 36,
                                                                            height: 36,
                                                                            borderRadius: 10,
                                                                            background: 'var(--gradient-accent)',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            fontWeight: 800,
                                                                            fontSize: '0.9rem',
                                                                            color: 'white'
                                                                        },
                                                                        children: d.day
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                        lineNumber: 297,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                style: {
                                                                                    fontWeight: 600,
                                                                                    fontSize: '0.9rem',
                                                                                    color: 'var(--text-primary)'
                                                                                },
                                                                                children: [
                                                                                    "Day ",
                                                                                    d.day,
                                                                                    " — ",
                                                                                    d.theme || 'Exploration'
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                                lineNumber: 305,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                style: {
                                                                                    fontSize: '0.78rem',
                                                                                    color: 'var(--text-muted)'
                                                                                },
                                                                                children: [
                                                                                    d.duration || '8 hours',
                                                                                    " • ",
                                                                                    d.activities?.length || 0,
                                                                                    " activities"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                                lineNumber: 308,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                        lineNumber: 304,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 296,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "pill pill-blue",
                                                                        children: [
                                                                            d.activities?.length || 0,
                                                                            " acts"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                        lineNumber: 314,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>switchTab('itinerary'),
                                                                        className: "btn-ghost",
                                                                        style: {
                                                                            padding: '6px 14px',
                                                                            fontSize: '0.78rem'
                                                                        },
                                                                        children: "View"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                        lineNumber: 315,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 313,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, i, true, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 295,
                                                        columnNumber: 25
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 293,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 289,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 263,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                        lineNumber: 218,
                        columnNumber: 11
                    }, this),
                    activeTab === 'itinerary' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-fade-up",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "section-title",
                                children: "📅 Itinerary"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 336,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "section-subtitle",
                                children: "Your AI-generated day-by-day travel plan"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 337,
                                columnNumber: 13
                            }, this),
                            journey ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: journey.itinerary?.days?.map((d, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "card",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-between mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-3",
                                                        style: {
                                                            alignItems: 'center'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    width: 44,
                                                                    height: 44,
                                                                    borderRadius: 12,
                                                                    background: 'var(--gradient-accent)',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    fontWeight: 800,
                                                                    fontSize: '1rem',
                                                                    color: 'white'
                                                                },
                                                                children: [
                                                                    "D",
                                                                    d.day
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 345,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            fontWeight: 700,
                                                                            fontSize: '1rem',
                                                                            color: 'var(--text-primary)'
                                                                        },
                                                                        children: [
                                                                            "Day ",
                                                                            d.day,
                                                                            " — ",
                                                                            d.theme || 'Exploration'
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                        lineNumber: 353,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            fontSize: '0.8rem',
                                                                            color: 'var(--text-muted)',
                                                                            marginTop: 2
                                                                        },
                                                                        children: new Date(d.date).toLocaleDateString('en-US', {
                                                                            weekday: 'long',
                                                                            month: 'short',
                                                                            day: 'numeric'
                                                                        })
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                        lineNumber: 356,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 352,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 344,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "pill pill-green",
                                                                children: "🛡️ Safe"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 362,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "pill pill-blue",
                                                                children: [
                                                                    "⏱ ",
                                                                    d.duration || '8h'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 363,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "pill pill-purple",
                                                                children: [
                                                                    "🎯 ",
                                                                    d.activities?.length || 0,
                                                                    " activities"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 364,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 361,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 343,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid-3",
                                                style: {
                                                    marginBottom: 16
                                                },
                                                children: [
                                                    'morning',
                                                    'afternoon',
                                                    'evening'
                                                ].map((period)=>{
                                                    const acts = d.activities?.filter((a)=>{
                                                        if (period === 'morning') return a.time?.startsWith('0') || a.time?.startsWith('05') || a.time?.startsWith('06') || a.time?.startsWith('07') || a.time?.startsWith('08');
                                                        if (period === 'afternoon') return a.time?.startsWith('13') || a.time?.startsWith('14');
                                                        return a.time?.startsWith('17') || a.time?.startsWith('19');
                                                    }) || [];
                                                    const icons = {
                                                        morning: '🌅',
                                                        afternoon: '☀️',
                                                        evening: '🌆'
                                                    };
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "card-inner",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 700,
                                                                    color: 'var(--text-muted)',
                                                                    textTransform: 'uppercase',
                                                                    letterSpacing: '0.5px',
                                                                    marginBottom: 10
                                                                },
                                                                children: [
                                                                    icons[period],
                                                                    " ",
                                                                    period
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 378,
                                                                columnNumber: 29
                                                            }, this),
                                                            acts.length > 0 ? acts.map((act, j)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        padding: '8px 0',
                                                                        borderBottom: j < acts.length - 1 ? '1px solid var(--border)' : 'none'
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            style: {
                                                                                fontSize: '0.85rem',
                                                                                fontWeight: 600,
                                                                                color: 'var(--text-primary)'
                                                                            },
                                                                            children: act.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                            lineNumber: 383,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            style: {
                                                                                fontSize: '0.75rem',
                                                                                color: 'var(--text-muted)',
                                                                                marginTop: 2
                                                                            },
                                                                            children: [
                                                                                act.time,
                                                                                " • ",
                                                                                act.duration,
                                                                                "h"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                            lineNumber: 384,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, j, true, {
                                                                    fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                    lineNumber: 382,
                                                                    columnNumber: 31
                                                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: '0.8rem',
                                                                    color: 'var(--text-muted)',
                                                                    fontStyle: 'italic'
                                                                },
                                                                children: "Free time"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 389,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, period, true, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 377,
                                                        columnNumber: 27
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 368,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "card-inner",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: '0.75rem',
                                                            fontWeight: 700,
                                                            color: 'var(--text-muted)',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.5px',
                                                            marginBottom: 10
                                                        },
                                                        children: "🍽️ Meals"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 397,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-4",
                                                        style: {
                                                            flexWrap: 'wrap'
                                                        },
                                                        children: d.meals && Object.entries(d.meals).map(([meal, desc])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            fontSize: '0.75rem',
                                                                            color: 'var(--text-muted)',
                                                                            textTransform: 'capitalize'
                                                                        },
                                                                        children: [
                                                                            meal,
                                                                            ": "
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                        lineNumber: 403,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            fontSize: '0.8rem',
                                                                            color: 'var(--text-secondary)',
                                                                            fontWeight: 500
                                                                        },
                                                                        children: desc
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                        lineNumber: 404,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, meal, true, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 402,
                                                                columnNumber: 27
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 400,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 396,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 342,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 340,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "empty-state",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "empty-state-icon",
                                        children: "📅"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 414,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "empty-state-title",
                                        children: "No itinerary yet"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 415,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "empty-state-desc",
                                        children: "Plan your journey first to generate a personalised day-by-day itinerary."
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 416,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>switchTab('dashboard'),
                                        className: "btn-primary",
                                        children: "Go to Dashboard"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 417,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 413,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                        lineNumber: 335,
                        columnNumber: 11
                    }, this),
                    activeTab === 'guides' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-fade-up",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "section-title",
                                children: "👨‍🏫 Recommended Guides"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 428,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "section-subtitle",
                                children: "AI-matched local expert guides based on your preferences"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 429,
                                columnNumber: 13
                            }, this),
                            guides?.matchedGuides ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid-auto",
                                children: guides.matchedGuides.slice(0, 6).map((g)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "guide-card",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "guide-card-header",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "guide-avatar",
                                                        children: "👨‍🏫"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 436,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "guide-name",
                                                        children: g.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 437,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "guide-exp",
                                                        children: [
                                                            g.experience,
                                                            " years experience"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 438,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 435,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "guide-body",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "guide-stat-row",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "pill pill-yellow",
                                                                children: [
                                                                    "★ ",
                                                                    g.rating?.toFixed(1)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 442,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "pill pill-green",
                                                                children: [
                                                                    g.compatibilityScore,
                                                                    "% match"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 445,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 441,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "guide-section",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "guide-section-label",
                                                                children: "Languages"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 451,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex gap-2",
                                                                style: {
                                                                    flexWrap: 'wrap',
                                                                    marginTop: 4
                                                                },
                                                                children: g.languages?.map((lang, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "pill pill-blue",
                                                                        children: lang
                                                                    }, i, false, {
                                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                        lineNumber: 454,
                                                                        columnNumber: 29
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 452,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 450,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "guide-section",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "guide-section-label",
                                                                children: "Specialties"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 460,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex gap-2",
                                                                style: {
                                                                    flexWrap: 'wrap',
                                                                    marginTop: 4
                                                                },
                                                                children: g.specialties?.slice(0, 3).map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "pill pill-purple",
                                                                        children: s
                                                                    }, i, false, {
                                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                        lineNumber: 463,
                                                                        columnNumber: 29
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 461,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 459,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "guide-price-row",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "guide-price",
                                                                        children: [
                                                                            "₹",
                                                                            g.price
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                        lineNumber: 470,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            fontSize: '0.75rem',
                                                                            color: 'var(--text-muted)'
                                                                        },
                                                                        children: "/day"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                        lineNumber: 471,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 469,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: "btn-green",
                                                                style: {
                                                                    padding: '9px 20px',
                                                                    fontSize: '0.85rem'
                                                                },
                                                                children: "📞 Book Now"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 473,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 468,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 440,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, g.id, true, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 434,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 432,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "empty-state",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "empty-state-icon",
                                        children: "👨‍🏫"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 483,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "empty-state-title",
                                        children: "No guides matched yet"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 484,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "empty-state-desc",
                                        children: "Plan your journey to get AI-matched guide recommendations."
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 485,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>switchTab('dashboard'),
                                        className: "btn-primary",
                                        children: "Plan Journey"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 486,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 482,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                        lineNumber: 427,
                        columnNumber: 11
                    }, this),
                    activeTab === 'food' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-fade-up",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "section-title",
                                children: "🍽️ Food Recommendations"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 495,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "section-subtitle",
                                children: "Curated local cuisine picks for Kerala's finest flavours"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 496,
                                columnNumber: 13
                            }, this),
                            journey?.foodRecommendations ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: journey.foodRecommendations.recommendations?.slice(0, 3).map((dayFood, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "card",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                style: {
                                                    fontWeight: 700,
                                                    fontSize: '1rem',
                                                    color: 'var(--text-primary)',
                                                    marginBottom: 16
                                                },
                                                children: [
                                                    "Day ",
                                                    dayFood.day,
                                                    " Meals"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 502,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid-4",
                                                style: {
                                                    gap: '12px'
                                                },
                                                children: [
                                                    'breakfast',
                                                    'lunch',
                                                    'dinner',
                                                    'snacks'
                                                ].map((meal)=>{
                                                    const items = dayFood[meal];
                                                    const icons = {
                                                        breakfast: '🌅',
                                                        lunch: '☀️',
                                                        dinner: '🌙',
                                                        snacks: '🍫'
                                                    };
                                                    const colors = {
                                                        breakfast: 'pill-yellow',
                                                        lunch: 'pill-green',
                                                        dinner: 'pill-purple',
                                                        snacks: 'pill-cyan'
                                                    };
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "card-inner",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 8,
                                                                    marginBottom: 12
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            fontSize: '1.1rem'
                                                                        },
                                                                        children: icons[meal]
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                        lineNumber: 513,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            fontSize: '0.75rem',
                                                                            fontWeight: 700,
                                                                            textTransform: 'capitalize',
                                                                            color: 'var(--text-primary)'
                                                                        },
                                                                        children: meal
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                        lineNumber: 514,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 512,
                                                                columnNumber: 29
                                                            }, this),
                                                            (Array.isArray(items) ? items : []).map((item, j)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        padding: '8px 0',
                                                                        borderTop: j > 0 ? '1px solid var(--border)' : 'none'
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            style: {
                                                                                fontSize: '0.85rem',
                                                                                fontWeight: 600,
                                                                                color: 'var(--text-primary)'
                                                                            },
                                                                            children: item.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                            lineNumber: 518,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            style: {
                                                                                fontSize: '0.75rem',
                                                                                color: 'var(--text-muted)',
                                                                                marginTop: 2,
                                                                                lineHeight: 1.4
                                                                            },
                                                                            children: item.description
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                            lineNumber: 519,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            style: {
                                                                                display: 'flex',
                                                                                gap: 6,
                                                                                marginTop: 6
                                                                            },
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: `pill ${colors[meal]}`,
                                                                                    style: {
                                                                                        fontSize: '0.7rem'
                                                                                    },
                                                                                    children: item.price
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                                    lineNumber: 521,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                item.vegetarian && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "pill pill-green",
                                                                                    style: {
                                                                                        fontSize: '0.7rem'
                                                                                    },
                                                                                    children: "Veg"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                                    lineNumber: 522,
                                                                                    columnNumber: 55
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                            lineNumber: 520,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, j, true, {
                                                                    fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                    lineNumber: 517,
                                                                    columnNumber: 31
                                                                }, this))
                                                        ]
                                                    }, meal, true, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 511,
                                                        columnNumber: 27
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 505,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 501,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 499,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "empty-state",
                                        style: {
                                            marginBottom: 32
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "empty-state-icon",
                                                children: "🍽️"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 536,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "empty-state-title",
                                                children: "Plan first to get food recs"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 537,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "empty-state-desc",
                                                children: "Our Food Expert Agent will personalise options to your dietary preferences."
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 538,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>switchTab('dashboard'),
                                                className: "btn-primary",
                                                children: "Plan Journey"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 539,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 535,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: {
                                            fontWeight: 700,
                                            fontSize: '1.1rem',
                                            color: 'var(--text-primary)',
                                            marginBottom: 16
                                        },
                                        children: "🌟 Signature Kerala Dishes"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 543,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid-auto",
                                        children: [
                                            {
                                                name: 'Kerala Fish Curry',
                                                desc: 'Coconut-based tangy fish curry',
                                                emoji: '🐟',
                                                tag: 'Seafood',
                                                rating: 4.8
                                            },
                                            {
                                                name: 'Puttu & Kadala',
                                                desc: 'Steamed rice flour with chickpea curry',
                                                emoji: '🌾',
                                                tag: 'Vegetarian',
                                                rating: 4.6
                                            },
                                            {
                                                name: 'Kerala Sadhya',
                                                desc: 'Traditional vegetarian feast on banana leaf',
                                                emoji: '🍛',
                                                tag: 'Festive',
                                                rating: 4.9
                                            },
                                            {
                                                name: 'Appam & Stew',
                                                desc: 'Lacy rice pancakes with coconut stew',
                                                emoji: '🥞',
                                                tag: 'Breakfast',
                                                rating: 4.7
                                            },
                                            {
                                                name: 'Prawn Moilee',
                                                desc: 'Delicate prawns in yellow coconut gravy',
                                                emoji: '🦐',
                                                tag: 'Seafood',
                                                rating: 4.7
                                            },
                                            {
                                                name: 'Karimeen Pollichathu',
                                                desc: 'Pearl spot fish grilled in banana leaf',
                                                emoji: '🐠',
                                                tag: 'Traditional',
                                                rating: 4.8
                                            }
                                        ].map((dish, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "card",
                                                style: {
                                                    display: 'flex',
                                                    gap: 16,
                                                    alignItems: 'flex-start'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: '2rem',
                                                            lineHeight: 1,
                                                            flexShrink: 0
                                                        },
                                                        children: dish.emoji
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 556,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 700,
                                                                    fontSize: '0.95rem',
                                                                    color: 'var(--text-primary)'
                                                                },
                                                                children: dish.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 558,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: '0.8rem',
                                                                    color: 'var(--text-muted)',
                                                                    margin: '4px 0 8px',
                                                                    lineHeight: 1.4
                                                                },
                                                                children: dish.desc
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 559,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    display: 'flex',
                                                                    gap: 6
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "pill pill-green",
                                                                        children: dish.tag
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                        lineNumber: 561,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "pill pill-yellow",
                                                                        children: [
                                                                            "★ ",
                                                                            dish.rating
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                        lineNumber: 562,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 560,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 557,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 555,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 546,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 534,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                        lineNumber: 494,
                        columnNumber: 11
                    }, this),
                    activeTab === 'weather' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-fade-up",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-between mb-6",
                                style: {
                                    flexWrap: 'wrap',
                                    gap: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "section-title",
                                                children: "🌤️ Weather"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 578,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "section-subtitle",
                                                style: {
                                                    marginBottom: 0
                                                },
                                                children: "Real-time forecast for Kerala, India"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 579,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 577,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: getWeather,
                                        disabled: loading,
                                        className: "btn-primary",
                                        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "spinner",
                                                    style: {
                                                        width: 14,
                                                        height: 14
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                    lineNumber: 582,
                                                    columnNumber: 30
                                                }, this),
                                                " Loading..."
                                            ]
                                        }, void 0, true) : '🔄 Refresh Weather'
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 581,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 576,
                                columnNumber: 13
                            }, this),
                            weather ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "weather-main",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-between",
                                                style: {
                                                    marginBottom: 24,
                                                    flexWrap: 'wrap',
                                                    gap: 16
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: '0.8rem',
                                                                    color: 'var(--text-muted)',
                                                                    fontWeight: 600,
                                                                    marginBottom: 8
                                                                },
                                                                children: [
                                                                    "📍 Kerala, India • ",
                                                                    new Date().toLocaleDateString('en-US', {
                                                                        weekday: 'long',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    })
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 591,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "weather-temp",
                                                                children: [
                                                                    Math.round(weather.current?.temperature || 0),
                                                                    "°C"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 594,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: '1.1rem',
                                                                    color: 'var(--text-secondary)',
                                                                    marginTop: 8
                                                                },
                                                                children: [
                                                                    weatherEmoji(weather.current?.weatherCode),
                                                                    " ",
                                                                    weather.current?.description
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 595,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 590,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontSize: '4rem',
                                                                textAlign: 'right',
                                                                lineHeight: 1
                                                            },
                                                            children: weatherEmoji(weather.current?.weatherCode)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                            lineNumber: 600,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 599,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 589,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                                    gap: 12
                                                },
                                                children: [
                                                    {
                                                        label: 'Feels Like',
                                                        value: `${Math.round(weather.current?.apparentTemperature || 0)}°C`,
                                                        icon: '🌡️'
                                                    },
                                                    {
                                                        label: 'Humidity',
                                                        value: `${weather.current?.humidity || 0}%`,
                                                        icon: '💧'
                                                    },
                                                    {
                                                        label: 'Wind Speed',
                                                        value: `${Math.round(weather.current?.windSpeed || 0)} m/s`,
                                                        icon: '💨'
                                                    }
                                                ].map((stat, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            background: 'rgba(255,255,255,0.07)',
                                                            borderRadius: 12,
                                                            padding: '14px',
                                                            backdropFilter: 'blur(10px)'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: '0.75rem',
                                                                    color: 'rgba(255,255,255,0.55)',
                                                                    marginBottom: 6
                                                                },
                                                                children: [
                                                                    stat.icon,
                                                                    " ",
                                                                    stat.label
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 613,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: '1.4rem',
                                                                    fontWeight: 800,
                                                                    color: 'white'
                                                                },
                                                                children: stat.value
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 616,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, i, true, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 612,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 606,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 588,
                                        columnNumber: 17
                                    }, this),
                                    weather.daily?.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "card",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                style: {
                                                    fontWeight: 700,
                                                    color: 'var(--text-primary)',
                                                    marginBottom: 16
                                                },
                                                children: "7-Day Forecast"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 624,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(7, 1fr)',
                                                    gap: 10
                                                },
                                                children: weather.daily.map((d, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "weather-forecast-item",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "weather-day-label",
                                                                children: new Date(d.date + 'T12:00:00').toLocaleDateString('en-US', {
                                                                    weekday: 'short'
                                                                })
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 628,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: '1.4rem',
                                                                    margin: '8px 0'
                                                                },
                                                                children: weatherEmoji(d.weatherCode)
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 631,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "weather-max",
                                                                children: [
                                                                    Math.round(d.maxTemp),
                                                                    "°"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 632,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "weather-min",
                                                                children: [
                                                                    Math.round(d.minTemp),
                                                                    "°"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 633,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, i, true, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 627,
                                                        columnNumber: 25
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 625,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 623,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 587,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "empty-state",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "empty-state-icon",
                                        children: "🌤️"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 642,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "empty-state-title",
                                        children: "No weather data yet"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 643,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "empty-state-desc",
                                        children: "Click the button above to load real-time weather data powered by Open-Meteo."
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 644,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: getWeather,
                                        disabled: loading,
                                        className: "btn-primary",
                                        children: loading ? 'Loading...' : '🌤️ Load Weather'
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 645,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 641,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                        lineNumber: 575,
                        columnNumber: 11
                    }, this),
                    activeTab === 'safety' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-fade-up",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-between mb-6",
                                style: {
                                    flexWrap: 'wrap',
                                    gap: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "section-title",
                                                children: "🛡️ Safety"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 658,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "section-subtitle",
                                                style: {
                                                    marginBottom: 0
                                                },
                                                children: "Emergency contacts and travel safety tips"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 659,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 657,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: getSafetyInfo,
                                        disabled: loading,
                                        className: "btn-danger",
                                        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "spinner",
                                                    style: {
                                                        width: 14,
                                                        height: 14
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                    lineNumber: 662,
                                                    columnNumber: 30
                                                }, this),
                                                " Loading..."
                                            ]
                                        }, void 0, true) : '🚨 Get Safety Info'
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 661,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 656,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid-2",
                                style: {
                                    gap: 24
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "card",
                                                style: {
                                                    background: 'rgba(239,68,68,0.05)',
                                                    borderColor: 'rgba(239,68,68,0.25)',
                                                    marginBottom: 16
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        style: {
                                                            fontWeight: 700,
                                                            fontSize: '1rem',
                                                            color: '#f87171',
                                                            marginBottom: 20
                                                        },
                                                        children: "🚨 Emergency Numbers"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 669,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "emergency-grid",
                                                        children: [
                                                            {
                                                                service: 'Police',
                                                                number: '100'
                                                            },
                                                            {
                                                                service: 'Ambulance',
                                                                number: '102'
                                                            },
                                                            {
                                                                service: 'Fire',
                                                                number: '101'
                                                            },
                                                            {
                                                                service: 'Disaster',
                                                                number: '108'
                                                            },
                                                            {
                                                                service: "Women's Help",
                                                                number: '1091'
                                                            },
                                                            {
                                                                service: 'Tourist Police',
                                                                number: '1363'
                                                            }
                                                        ].map((c, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "emergency-card",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "emergency-number",
                                                                        children: c.number
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                        lineNumber: 680,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "emergency-service",
                                                                        children: c.service
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                        lineNumber: 681,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, i, true, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 679,
                                                                columnNumber: 23
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 670,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 668,
                                                columnNumber: 17
                                            }, this),
                                            journey?.safetyInformation?.locationAssessments && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "card animate-fade-up",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        style: {
                                                            fontWeight: 700,
                                                            fontSize: '1rem',
                                                            color: 'var(--text-primary)',
                                                            marginBottom: 16
                                                        },
                                                        children: "📋 Per-Location Safety Assessment"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 689,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-4",
                                                        children: journey.safetyInformation.locationAssessments.map((assessment, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "card-inner",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex-between mb-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                style: {
                                                                                    fontWeight: 700,
                                                                                    fontSize: '0.9rem',
                                                                                    color: 'var(--text-primary)'
                                                                                },
                                                                                children: assessment.location
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                                lineNumber: 694,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: `pill ${assessment.safetyScore >= 80 ? 'pill-green' : 'pill-yellow'}`,
                                                                                children: [
                                                                                    "Score: ",
                                                                                    assessment.safetyScore,
                                                                                    "/100"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                                lineNumber: 695,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                        lineNumber: 693,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            fontSize: '0.8rem',
                                                                            color: 'var(--text-muted)',
                                                                            marginBottom: 8
                                                                        },
                                                                        children: [
                                                                            "Risk Level: ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    color: 'var(--text-secondary)',
                                                                                    fontWeight: 600
                                                                                },
                                                                                children: assessment.riskLevel
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                                lineNumber: 700,
                                                                                columnNumber: 41
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                        lineNumber: 699,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex gap-2",
                                                                        style: {
                                                                            flexWrap: 'wrap'
                                                                        },
                                                                        children: assessment.recommendations.map((rec, j)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "pill pill-blue",
                                                                                style: {
                                                                                    fontSize: '0.7rem'
                                                                                },
                                                                                children: [
                                                                                    "• ",
                                                                                    rec
                                                                                ]
                                                                            }, j, true, {
                                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                                lineNumber: 704,
                                                                                columnNumber: 31
                                                                            }, this))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                        lineNumber: 702,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, i, true, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 692,
                                                                columnNumber: 25
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 690,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 688,
                                                columnNumber: 19
                                            }, this),
                                            safetyInfo && !journey && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "card animate-fade-up",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        style: {
                                                            fontWeight: 700,
                                                            fontSize: '1rem',
                                                            color: 'var(--text-primary)',
                                                            marginBottom: 16
                                                        },
                                                        children: "📋 AI Safety Assessment"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 715,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: 'flex',
                                                            gap: 12,
                                                            marginBottom: 16,
                                                            flexWrap: 'wrap'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "pill pill-green",
                                                                children: [
                                                                    "✅ ",
                                                                    safetyInfo.contacts?.length || 0,
                                                                    " contacts loaded"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 717,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "pill pill-cyan",
                                                                children: "🕐 24/7 Available"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 718,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 716,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: '0.85rem',
                                                            color: 'var(--text-secondary)',
                                                            lineHeight: 1.6
                                                        },
                                                        children: "Area assessed as safe for tourists. Standard travel precautions recommended."
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 720,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 714,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 667,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "card",
                                                style: {
                                                    background: 'rgba(245,158,11,0.05)',
                                                    borderColor: 'rgba(245,158,11,0.25)'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        style: {
                                                            fontWeight: 700,
                                                            fontSize: '1rem',
                                                            color: '#fbbf24',
                                                            marginBottom: 16
                                                        },
                                                        children: "⚠️ Safety Tips"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 729,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-3",
                                                        children: [
                                                            {
                                                                tip: 'Keep digital and physical copies of documents',
                                                                icon: '📄'
                                                            },
                                                            {
                                                                tip: 'Use registered taxis and ride-sharing apps',
                                                                icon: '🚗'
                                                            },
                                                            {
                                                                tip: 'Avoid displaying valuables in crowded areas',
                                                                icon: '💎'
                                                            },
                                                            {
                                                                tip: 'Share your itinerary with someone you trust',
                                                                icon: '📲'
                                                            },
                                                            {
                                                                tip: 'Stay hydrated — carry water especially in summer',
                                                                icon: '💧'
                                                            },
                                                            {
                                                                tip: 'Trust your instincts and stay alert',
                                                                icon: '🧠'
                                                            }
                                                        ].map((t, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    display: 'flex',
                                                                    gap: 10,
                                                                    alignItems: 'flex-start',
                                                                    padding: '8px 0',
                                                                    borderBottom: i < 5 ? '1px solid var(--border)' : 'none'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            fontSize: '1rem',
                                                                            lineHeight: 1.5,
                                                                            flexShrink: 0
                                                                        },
                                                                        children: t.icon
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                        lineNumber: 740,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            fontSize: '0.875rem',
                                                                            color: 'var(--text-secondary)',
                                                                            lineHeight: 1.5
                                                                        },
                                                                        children: t.tip
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                        lineNumber: 741,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, i, true, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 739,
                                                                columnNumber: 23
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 730,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 728,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "card",
                                                style: {
                                                    background: 'rgba(16,185,129,0.05)',
                                                    borderColor: 'rgba(16,185,129,0.25)'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        style: {
                                                            fontWeight: 700,
                                                            fontSize: '1rem',
                                                            color: '#34d399',
                                                            marginBottom: 16
                                                        },
                                                        children: "🏥 Health Tips"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 748,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-3",
                                                        children: [
                                                            {
                                                                tip: 'Drink only bottled or purified water',
                                                                icon: '🚰'
                                                            },
                                                            {
                                                                tip: 'Apply sunscreen SPF 30+ — Kerala sun is strong',
                                                                icon: '☀️'
                                                            },
                                                            {
                                                                tip: 'Carry basic medications and a first-aid kit',
                                                                icon: '💊'
                                                            },
                                                            {
                                                                tip: 'Travel insurance is strongly recommended',
                                                                icon: '🛡️'
                                                            }
                                                        ].map((t, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    display: 'flex',
                                                                    gap: 10,
                                                                    alignItems: 'flex-start',
                                                                    padding: '8px 0',
                                                                    borderBottom: i < 3 ? '1px solid var(--border)' : 'none'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            fontSize: '1rem',
                                                                            lineHeight: 1.5,
                                                                            flexShrink: 0
                                                                        },
                                                                        children: t.icon
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                        lineNumber: 757,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            fontSize: '0.875rem',
                                                                            color: 'var(--text-secondary)',
                                                                            lineHeight: 1.5
                                                                        },
                                                                        children: t.tip
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                        lineNumber: 758,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, i, true, {
                                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                                lineNumber: 756,
                                                                columnNumber: 23
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 749,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 747,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 727,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 666,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                        lineNumber: 655,
                        columnNumber: 11
                    }, this),
                    activeTab === 'translate' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-fade-up",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-between mb-6",
                                style: {
                                    flexWrap: 'wrap',
                                    gap: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "section-title",
                                                children: "🌐 Translation"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 773,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "section-subtitle",
                                                style: {
                                                    marginBottom: 0
                                                },
                                                children: "Real-time language assistance for your journey"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 774,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 772,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: translateText,
                                        disabled: loading,
                                        className: "btn-purple",
                                        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "spinner",
                                                    style: {
                                                        width: 14,
                                                        height: 14
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                    lineNumber: 777,
                                                    columnNumber: 30
                                                }, this),
                                                " Translating..."
                                            ]
                                        }, void 0, true) : '🔤 Translate Sample'
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 776,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 771,
                                columnNumber: 13
                            }, this),
                            translation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid-2 mb-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "translate-box",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    gap: 8,
                                                    alignItems: 'center',
                                                    marginBottom: 12
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "pill pill-blue",
                                                    children: "🇬🇧 English"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                    lineNumber: 785,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 784,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: '1.05rem',
                                                    color: 'var(--text-primary)',
                                                    lineHeight: 1.6,
                                                    fontStyle: 'italic'
                                                },
                                                children: [
                                                    '"',
                                                    translation.originalText,
                                                    '"'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 787,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 783,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "translate-box",
                                        style: {
                                            borderColor: 'rgba(139,92,246,0.3)',
                                            background: 'rgba(139,92,246,0.05)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    gap: 8,
                                                    alignItems: 'center',
                                                    marginBottom: 12
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "pill pill-purple",
                                                        children: "🇮🇳 Hindi"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 793,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "pill pill-green",
                                                        children: [
                                                            Math.round((translation.confidence || 0.95) * 100),
                                                            "% confidence"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 794,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 792,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: '1.05rem',
                                                    color: 'var(--text-primary)',
                                                    lineHeight: 1.6,
                                                    fontStyle: 'italic'
                                                },
                                                children: [
                                                    '"',
                                                    translation.translatedText,
                                                    '"'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 796,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 791,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 782,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: {
                                    fontWeight: 700,
                                    fontSize: '1.05rem',
                                    color: 'var(--text-primary)',
                                    marginBottom: 20
                                },
                                children: "📚 Common Travel Phrases"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 803,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                                    gap: 12
                                },
                                children: [
                                    {
                                        en: 'Hello / Greetings',
                                        hi: 'नमस्ते',
                                        ml: 'നമസ്കാരം'
                                    },
                                    {
                                        en: 'Thank You',
                                        hi: 'धन्यवाद',
                                        ml: 'ധന്യവാദം'
                                    },
                                    {
                                        en: 'How much does this cost?',
                                        hi: 'यह कितने का है?',
                                        ml: 'ഇത് എത്ര?'
                                    },
                                    {
                                        en: 'Where is the hospital?',
                                        hi: 'अस्पताल कहाँ है?',
                                        ml: 'ആശുപത്രി എവിടെ?'
                                    },
                                    {
                                        en: 'I need help',
                                        hi: 'मुझे मदद चाहिए',
                                        ml: 'എനിക്ക് സഹായം'
                                    },
                                    {
                                        en: 'Good Morning',
                                        hi: 'सुप्रभात',
                                        ml: 'ശുഭ പ്രഭാതം'
                                    },
                                    {
                                        en: 'Good Night',
                                        hi: 'शुभ रात्रि',
                                        ml: 'ശുഭ രാത്രി'
                                    },
                                    {
                                        en: 'Do you speak English?',
                                        hi: 'क्या आप अंग्रेजी बोलते हैं?',
                                        ml: 'നിങ്ങൾ ഇംഗ്ലീഷ് സംസാരിക്കുമോ?'
                                    },
                                    {
                                        en: 'Please call the police',
                                        hi: 'कृपया पुलिस को बुलाओ',
                                        ml: 'ദയവായി പോലീസിനെ വിളിക്കൂ'
                                    }
                                ].map((p, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "phrase-card",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontWeight: 700,
                                                    fontSize: '0.9rem',
                                                    color: 'var(--text-primary)',
                                                    marginBottom: 8
                                                },
                                                children: p.en
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 819,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '0.8rem',
                                                    color: 'var(--text-secondary)',
                                                    marginBottom: 4
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: 'var(--text-muted)'
                                                        },
                                                        children: "Hindi: "
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 821,
                                                        columnNumber: 21
                                                    }, this),
                                                    p.hi
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 820,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '0.8rem',
                                                    color: 'var(--text-secondary)'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: 'var(--text-muted)'
                                                        },
                                                        children: "Malayalam: "
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                        lineNumber: 824,
                                                        columnNumber: 21
                                                    }, this),
                                                    p.ml
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                                lineNumber: 823,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                        lineNumber: 818,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 806,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                        lineNumber: 770,
                        columnNumber: 11
                    }, this),
                    activeTab === 'map' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-fade-up",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "section-title",
                                children: "🗺️ Map Explorer"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 835,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "section-subtitle",
                                children: "Discover hotels, restaurants and places of interest near you"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 836,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "map-container-wrapper",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$components$2f$Map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                    fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                    lineNumber: 838,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 837,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                        lineNumber: 834,
                        columnNumber: 11
                    }, this),
                    activeTab === 'directions' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-fade-up",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "section-title",
                                children: "🧭 Directions"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 846,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "section-subtitle",
                                children: "Turn-by-turn route planning between any two points"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 847,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "card",
                                style: {
                                    padding: 0,
                                    overflow: 'hidden'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$components$2f$DirectionsPanel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                    fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                    lineNumber: 849,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                lineNumber: 848,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                        lineNumber: 845,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                lineNumber: 214,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "footer",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "footer-inner",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "footer-grid",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "logo-mark",
                                            style: {
                                                marginBottom: 8
                                            },
                                            children: "SmartTour"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                            lineNumber: 860,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "footer-brand-desc",
                                            children: "Your AI-powered travel companion for Kerala and beyond. Intelligent itineraries, expert guides, real-time assistance."
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                            lineNumber: 861,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                    lineNumber: 859,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "footer-heading",
                                            children: "Features"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                            lineNumber: 866,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            className: "footer-link",
                                            href: "#",
                                            children: "Smart Itineraries"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                            lineNumber: 867,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            className: "footer-link",
                                            href: "#",
                                            children: "Food Recommendations"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                            lineNumber: 868,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            className: "footer-link",
                                            href: "#",
                                            children: "Guide Matching"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                            lineNumber: 869,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            className: "footer-link",
                                            href: "#",
                                            children: "Weather Forecasting"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                            lineNumber: 870,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                    lineNumber: 865,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "footer-heading",
                                            children: "Safety"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                            lineNumber: 873,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            className: "footer-link",
                                            href: "#",
                                            children: "Emergency Contacts"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                            lineNumber: 874,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            className: "footer-link",
                                            href: "#",
                                            children: "Location Safety"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                            lineNumber: 875,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            className: "footer-link",
                                            href: "#",
                                            children: "Health Tips"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                            lineNumber: 876,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            className: "footer-link",
                                            href: "#",
                                            children: "24/7 Support"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                            lineNumber: 877,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                    lineNumber: 872,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "footer-heading",
                                            children: "Tools"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                            lineNumber: 880,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            className: "footer-link",
                                            href: "#",
                                            children: "Translation"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                            lineNumber: 881,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            className: "footer-link",
                                            href: "#",
                                            children: "Map Explorer"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                            lineNumber: 882,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            className: "footer-link",
                                            href: "#",
                                            children: "Route Planner"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                            lineNumber: 883,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            className: "footer-link",
                                            href: "#",
                                            children: "Weather API"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                            lineNumber: 884,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                    lineNumber: 879,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                            lineNumber: 858,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "footer-bottom",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "footer-bottom-text",
                                    children: "© 2024 SmartTour. All rights reserved."
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                    lineNumber: 888,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smartTour$2f$smarttour$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "footer-bottom-text",
                                    children: "Powered by Agentic AI 🤖 · Open-Meteo · OpenStreetMap · OSRM"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                                    lineNumber: 889,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                            lineNumber: 887,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                    lineNumber: 857,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
                lineNumber: 856,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/smartTour/smarttour-test/app/page.js",
        lineNumber: 158,
        columnNumber: 5
    }, this);
}
_s(Home, "YDgVwuGmc/ZTAkrqhSwLbOvhtjE=");
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_smartTour_smarttour-test_a4c6ffb0._.js.map