"use client";

import { useEffect, useState } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/mapbox';
import { MapPin, AlertCircle, Loader2 } from 'lucide-react';
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
      
      const geocoded = await Promise.all(
        tasks.map(async (t) => {
          if (!t.location || t.location === "") return t;
          try {
            // Forcefully bias towards Odisha, India for local operations
            const searchLocation = t.location.toLowerCase().includes('odisha') 
              ? t.location 
              : `${t.location}, Odisha, India`;

            const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchLocation)}.json?access_token=${MAPBOX_TOKEN}&limit=1&country=IN`);
            const data = await res.json();
            if (data.features && data.features.length > 0) {
              const [lng, lat] = data.features[0].center;
              return { ...t, lng, lat };
            }
          } catch (e) {
            console.error("Geocoding error", e);
          }
          return t;
        })
      );
      setLocations(geocoded.filter(t => t.lng !== undefined && t.lat !== undefined));
      setLoading(false);
    };

    geocode();
  }, [tasks]);

  if (!MAPBOX_TOKEN || MAPBOX_TOKEN === "" || MAPBOX_TOKEN === "your_mapbox_key_here") {
    return (
      <div className="flex bg-slate-50 items-center justify-center rounded-2xl border border-slate-200 h-[450px] w-full">
        <div className="text-center p-6 space-y-2">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="font-semibold text-slate-800">Mapbox Token Missing</h3>
            <p className="text-sm text-slate-500 max-w-sm">Please add <code className="bg-slate-200 px-1 py-0.5 rounded text-xs text-rose-500">NEXT_PUBLIC_MAPBOX_TOKEN</code> to your <code>.env.local</code> to view the Live Operations Map.</p>
        </div>
      </div>
    );
  }

  if (loading) {
     return <div className="flex bg-slate-50 border border-slate-100 items-center justify-center h-[450px] w-full rounded-2xl"><Loader2 className="animate-spin text-indigo-500 w-8 h-8"/></div>
  }

  // Calculate center based on first location, usually India center if nothing
  const initialViewState = locations.length > 0 
    ? { longitude: locations[0].lng, latitude: locations[0].lat, zoom: 6 }
    : { longitude: 78.9629, latitude: 20.5937, zoom: 4 };

  return (
    <div className="h-[450px] w-full rounded-2xl overflow-hidden border border-slate-200 relative group">
      <Map
        initialViewState={initialViewState}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
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
            <MapPin className={`w-8 h-8 -mt-8 cursor-pointer drop-shadow-md transition-transform hover:scale-110 ${loc.status === 'open' ? 'text-rose-500' : loc.status === 'completed' ? 'text-emerald-500' : 'text-indigo-500'}`} fill="white" />
          </Marker>
        ))}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.lng!}
            latitude={popupInfo.lat!}
            onClose={() => setPopupInfo(null)}
            className="rounded-xl overflow-hidden shadow-xl"
            maxWidth="250px"
          >
            <div className="p-1">
               <h4 className="font-semibold text-sm mb-0.5">{popupInfo.title}</h4>
               <p className="text-xs text-slate-500 break-words mb-2">{popupInfo.location}</p>
               <div className={`inline-flex text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${popupInfo.status === 'open' ? 'bg-rose-100 text-rose-600' : popupInfo.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                 {popupInfo.status}
               </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
