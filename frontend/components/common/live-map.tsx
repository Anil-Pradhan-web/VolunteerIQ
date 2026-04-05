"use client";

import { useEffect, useState, useMemo } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/mapbox';
import { MapPin, AlertCircle, Loader2, Info } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface TaskLocation {
  id: string;
  title: string;
  location: string;
  status: string;
  lng?: number;
  lat?: number;
}

// Simple in-memory/localStorage cache for geocoding to save API calls
const GEO_CACHE_KEY = "v-iq-geo-cache";

export function LiveMap({ tasks }: { tasks: any[] }) {
  const [locations, setLocations] = useState<TaskLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [popupInfo, setPopupInfo] = useState<TaskLocation | null>(null);

  useEffect(() => {
    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === "" || MAPBOX_TOKEN === "your_mapbox_key_here") {
       setLoading(false);
       return;
    }

    const geocode = async () => {
      if (!tasks || tasks.length === 0) {
        setLoading(false);
        return;
      }
      
      // Load cache
      let cache: Record<string, {lng: number, lat: number}> = {};
      try {
        const stored = localStorage.getItem(GEO_CACHE_KEY);
        if (stored) cache = JSON.parse(stored);
      } catch (e) {}

      const geocoded = await Promise.all(
        tasks.map(async (t) => {
          if (!t.location || t.location === "") return t;
          
          const searchLocation = t.location.toLowerCase().includes('india') 
            ? t.location 
            : `${t.location}, India`;

          // Check cache first
          if (cache[searchLocation]) {
            return { ...t, ...cache[searchLocation] };
          }

          try {
            const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchLocation)}.json?access_token=${MAPBOX_TOKEN}&limit=1&country=IN`);
            const data = await res.json();
            if (data.features && data.features.length > 0) {
              const [lng, lat] = data.features[0].center;
              // Save to cache
              cache[searchLocation] = { lng, lat };
              return { ...t, lng, lat };
            }
          } catch (e) {
            console.error("Geocoding error", e);
          }
          return t;
        })
      );

      // Save updated cache
      try {
        localStorage.setItem(GEO_CACHE_KEY, JSON.stringify(cache));
      } catch (e) {}

      const validLocations = geocoded.filter(t => t.lng !== undefined && t.lat !== undefined);
      setLocations(validLocations);
      setLoading(false);
    };

    geocode();
  }, [tasks]);

  // Viewport calculation
  const initialViewState = useMemo(() => {
    if (locations.length > 0) {
      // Find bounding box or just use the first point
      return { 
        longitude: locations[0].lng!, 
        latitude: locations[0].lat!, 
        zoom: locations.length === 1 ? 10 : 6 
      };
    }
    // Default to India center
    return { longitude: 78.9629, latitude: 20.5937, zoom: 4 };
  }, [locations]);

  if (!MAPBOX_TOKEN || MAPBOX_TOKEN === "" || MAPBOX_TOKEN === "your_mapbox_key_here") {
    return (
      <div className="flex bg-slate-900/5 items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 h-[450px] w-full transition-all hover:bg-slate-900/[0.08]">
        <div className="text-center p-8 space-y-4 max-w-xs">
            <div className="h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-lg">Map Engine Offline</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">Please configure <code className="bg-slate-200 px-1.5 py-0.5 rounded text-[10px] font-black text-rose-600">NEXT_PUBLIC_MAPBOX_TOKEN</code> in your environment to track field deployments.</p>
            </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex bg-slate-50 border border-slate-100 items-center justify-center h-[450px] w-full rounded-3xl">
        <div className="flex flex-col items-center gap-4">
           <Loader2 className="animate-spin text-indigo-500 w-10 h-10"/>
           <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Operations Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[450px] w-full rounded-[32px] overflow-hidden border border-slate-200 relative group shadow-inner">
      <Map
        initialViewState={initialViewState}
        mapStyle="mapbox://styles/mapbox/streets-v12" // Reverted to colorful streets for visibility
        mapboxAccessToken={MAPBOX_TOKEN}
        reuseMaps
      >
        <NavigationControl position="bottom-right" />
        
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            longitude={loc.lng!}
            latitude={loc.lat!}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setPopupInfo(loc);
            }}
          >
            <div className="relative cursor-pointer transition-transform hover:scale-125 duration-300">
               {/* Pulsing effect for open tasks */}
               {loc.status === 'open' && (
                  <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-20" />
               )}
               <MapPin 
                 className={`w-9 h-9 drop-shadow-[0_0_15px_rgba(0,0,0,0.3)] ${
                    loc.status === 'open' ? 'text-rose-500' : 
                    loc.status === 'completed' ? 'text-emerald-500' : 'text-indigo-500'
                 }`} 
                 fill="white" 
               />
            </div>
          </Marker>
        ))}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.lng!}
            latitude={popupInfo.lat!}
            onClose={() => setPopupInfo(null)}
            closeButton={false}
            className="rounded-2xl overflow-hidden shadow-2xl"
            maxWidth="280px"
          >
            <div className="p-3 bg-white rounded-xl">
               <div className="flex items-center gap-2 mb-2">
                  <div className={`h-2 w-2 rounded-full ${popupInfo.status === 'open' ? 'bg-rose-500' : popupInfo.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                  <h4 className="font-black text-slate-900 text-sm tracking-tight leading-none">{popupInfo.title}</h4>
               </div>
               <p className="text-xs text-slate-500 font-medium mb-3 line-clamp-2 px-1">{popupInfo.location}</p>
               
               <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                    popupInfo.status === 'open' ? 'bg-rose-50 text-rose-600' : 
                    popupInfo.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    {popupInfo.status}
                  </span>
                  <div className="h-6 w-6 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                     <Info className="h-3.5 w-3.5" />
                  </div>
               </div>
            </div>
          </Popup>
        )}
      </Map>
      
      {/* Map Legend */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-2 p-3 bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl pointer-events-none">
         <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            <div className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Open Issues
         </div>
         <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> Active Deployment
         </div>
         <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Resolved
         </div>
      </div>
    </div>
  );
}

