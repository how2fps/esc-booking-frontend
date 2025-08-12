import { MarkerClusterer, type Marker } from "@googlemaps/markerclusterer";
import { StarIcon } from "@phosphor-icons/react";
import { InfoWindow, useMap } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { HotelMarker as HotelMarkerType } from "../../type/HotelType";
import { HotelMarker } from "./HotelMarker";
import { useNavigate, useSearchParams } from "react-router-dom";
/**
 * The ClusteredTreeMarkers component is responsible for integrating the
 * markers with the markerclusterer.
 */

// Format date helper function (same as in HotelListingsPage)
function formatDate(dateString: string): string {
    if (!dateString) {
           const today = new Date();
           const year = today.getFullYear();
           const month = String(today.getMonth() + 1).padStart(2, "0");
           const day = String(today.getDate()).padStart(2, "0");
           return `${year}-${month}-${day}`;
    }
    return dateString;
}

export const ClusteredHotelMarkers = ({ hotels }: { hotels: HotelMarkerType[] }) => {
       const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
       const [selectedHotelKey, setSelectedHotelKey] = useState<string | null>(null);
       const router = useNavigate();
       const [searchParams] = useSearchParams();
       const selectedHotel = useMemo(() => (hotels && selectedHotelKey ? hotels.find((t) => t.key === selectedHotelKey)! : null), [hotels, selectedHotelKey]);
       const destinationId = searchParams.get("location");

       const checkIn = formatDate(searchParams.get("startDate") as string);
       const checkOut = formatDate(searchParams.get("endDate") as string);

       const handleViewDetailsClick = useCallback(() => {
            if (selectedHotelKey) {
            router(`/hotels/${selectedHotelKey}?destination_id=${destinationId}&checkin=${checkIn}&checkout=${checkOut}`);
            }
        }, [router, selectedHotelKey]);
       
       // create the markerClusterer once the map is available and update it when
       // the markers are changed
       const map = useMap();
       const clusterer = useMemo(() => {
              if (!map) return null;

              return new MarkerClusterer({ map });
       }, [map]);

       useEffect(() => {
              if (!clusterer) return;

              clusterer.clearMarkers();
              clusterer.addMarkers(Object.values(markers));
       }, [clusterer, markers]);

       // this callback will effectively get passsed as ref to the markers to keep
       // tracks of markers currently on the map
       const setMarkerRef = useCallback((marker: Marker | null, key: string) => {
              setMarkers((markers) => {
                     if ((marker && markers[key]) || (!marker && !markers[key])) return markers;

                     if (marker) {
                            return { ...markers, [key]: marker };
                     } else {
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            const { [key]: _, ...newMarkers } = markers;

                            return newMarkers;
                     }
              });
       }, []);

       const handleInfoWindowClose = useCallback(() => {
              setSelectedHotelKey(null);
       }, []);

       const handleMarkerClick = useCallback((hotel: HotelMarkerType) => {
              setSelectedHotelKey(hotel.key);
       }, []);

       return (
              <>
                     {hotels.map((hotel) => (
                            <HotelMarker
                                   key={hotel.key}
                                   hotel={hotel}
                                   onClick={handleMarkerClick}
                                   setMarkerRef={setMarkerRef}
                            />
                     ))}

                     {selectedHotelKey && (
                            <InfoWindow
                                anchor={markers[selectedHotelKey]}
                                onCloseClick={handleInfoWindowClose}
                            >
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-xs sm:max-w-sm md:max-w-md w-full">
                                    <div className="px-4 pt-1 pb-3 flex flex-col items-center text-center">
                                        <h2 className="font-bold text-lg">{selectedHotel?.name}</h2>
                                        <div className="flex justify-center gap-1 mt-1">
                                            {[...Array(5)].map((_, i) => {
                                            const rating = selectedHotel?.rating || 0;
                                            const full = i + 1 <= Math.floor(rating);
                                            const partial = !full && i < rating;
                                            return (
                                                <div key={i} className="relative w-5 h-5">
                                                {/* Empty star */}
                                                <StarIcon weight="regular" size={20} className="absolute text-gray-300" />
                                                {/* Full or partial star */}
                                                {(full || partial) && (
                                                    <StarIcon
                                                    weight="fill"
                                                    size={20}
                                                    className="absolute text-yellow-500"
                                                    style={{
                                                        clipPath: partial
                                                        ? `inset(0 ${100 - ((rating % 1) * 100)}% 0 0)`
                                                        : "none"
                                                    }}
                                                    />
                                                )}
                                                </div>
                                            );
                                            })}
                                        </div>

                                        <p className="text-sm text-gray-600 mt-2">{selectedHotel?.address}</p>
                                        <button
                                            onClick={handleViewDetailsClick}
                                            className="mt-2 text-blue-600 hover:underline bg-transparent border-none px-2 py-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-0"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </InfoWindow>
                          
                          
                     )}
              </>
       );
};
