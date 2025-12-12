import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Phone, Star, AlertTriangle, ExternalLink, Loader2 } from 'lucide-react';
import { findNearbyHospitals } from '../services/geminiService';
import { GroundingChunk, LocationCoordinates } from '../types';

export const HospitalLocator: React.FC = () => {
  const [location, setLocation] = useState<LocationCoordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hospitals, setHospitals] = useState<GroundingChunk[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');

  const getLocation = () => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(coords);
        await fetchHospitals(coords);
      },
      (err) => {
        console.error(err);
        setError("Unable to retrieve your location. Please ensure GPS is enabled.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const fetchHospitals = async (coords: LocationCoordinates) => {
    try {
      const { text, chunks } = await findNearbyHospitals(coords);
      setAiAnalysis(text);
      // Filter chunks to only those with map data
      const mapChunks = chunks.filter(c => c.maps?.title);
      setHospitals(mapChunks);
    } catch (err) {
      setError("Failed to fetch hospital data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load if permission is already granted or simple prompt
  useEffect(() => {
    // Only fetch if we don't have data.
    // We wait for user interaction to fetch location usually, but for a "Locator" app, auto-fetch is okay.
    // Let's rely on the button click to be safe with permissions context.
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto pb-20">
      <div className="bg-teal-800 text-white p-6 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <MapPin className="w-32 h-32" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Hospital Locator</h2>
        <p className="text-teal-100 mb-6">Find the nearest medical help from your farm.</p>
        
        {!location ? (
          <button
            onClick={getLocation}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-white text-teal-800 font-bold py-3 px-6 rounded-xl shadow-md active:scale-95 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Navigation className="w-5 h-5" />}
            {loading ? "Locating..." : "Use My Current Location"}
          </button>
        ) : (
          <div className="flex items-center gap-2 text-sm bg-teal-900/50 p-2 rounded-lg backdrop-blur-sm">
            <Navigation className="w-4 h-4 text-green-300" />
            <span>GPS: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
            <button onClick={getLocation} className="ml-auto text-xs underline text-teal-200">Refresh</button>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {loading && !error && (
          <div className="text-center py-10">
             <Loader2 className="w-10 h-10 text-teal-600 animate-spin mx-auto mb-4" />
             <p className="text-gray-500">Scanning for nearby hospitals...</p>
          </div>
        )}

        {!loading && hospitals.length > 0 && (
          <>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
               <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                 <Star className="w-4 h-4 text-yellow-500 fill-current" />
                 AI Summary
               </h3>
               <p className="text-sm text-gray-600 leading-relaxed">{aiAnalysis}</p>
            </div>

            <h3 className="font-bold text-gray-800 mt-4 px-1">Nearby Facilities</h3>
            <div className="space-y-3">
              {hospitals.map((hospital, index) => (
                <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">{hospital.maps?.title}</h4>
                      {/* Note: Map chunks might not always have addresses directly accessible in the simple schema, 
                          but we can link to the map URI */}
                    </div>
                    <a 
                      href={hospital.maps?.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                  
                  {hospital.maps?.placeAnswerSources?.reviewSnippets && (
                     <div className="mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg italic">
                       "{hospital.maps.placeAnswerSources.reviewSnippets[0].content}"
                     </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <a 
                      href={hospital.maps?.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 bg-teal-600 text-white text-center py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        {!loading && location && hospitals.length === 0 && !error && (
             <div className="text-center py-10 text-gray-500">
                 <p>No specific hospital data found nearby.</p>
                 <p className="text-sm mt-2">Try moving to an open area for better GPS or search for a larger town.</p>
             </div>
        )}
      </div>
    </div>
  );
};
