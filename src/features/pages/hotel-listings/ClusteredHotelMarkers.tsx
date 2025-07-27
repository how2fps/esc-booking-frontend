import { MarkerClusterer, type Marker } from "@googlemaps/markerclusterer";
import { StarIcon } from "@phosphor-icons/react";
import { InfoWindow, useMap } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { HotelMarker as HotelMarkerType } from "../../type/HotelType";
import { HotelMarker } from "./HotelMarker";

/**
 * The ClusteredTreeMarkers component is responsible for integrating the
 * markers with the markerclusterer.
 */
export const ClusteredHotelMarkers = ({ hotels }: { hotels: HotelMarkerType[] }) => {
       const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
       const [selectedHotelKey, setSelectedHotelKey] = useState<string | null>(null);

       const selectedHotel = useMemo(() => (hotels && selectedHotelKey ? hotels.find((t) => t.key === selectedHotelKey)! : null), [hotels, selectedHotelKey]);

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
                                   onCloseClick={handleInfoWindowClose}>
                                   <div className="flex flex-col items-center">
                                          <div className="w-full flex justify-center mt-2">
                                                 <img
                                                        src={selectedHotel?.image_details.count && selectedHotel?.image_details.count > 0 ? selectedHotel.image_details.prefix + "1" + selectedHotel.image_details.suffix : "../../../assets/Placeholder_Cat.png"}
                                                        alt={`${selectedHotel?.name} image`}
                                                        className="w-full h-32 object-cover rounded-lg"
                                                 />
                                          </div>
                                          <div className="font-bold text-lg text-center">{selectedHotel?.name}</div>
                                          <div className="flex items-center gap-1 justify-center mt-1">
                                                 {[...Array(4)].map((_, i) => (
                                                        <StarIcon
                                                               key={i}
                                                               weight="fill"
                                                               size={18}
                                                               className="text-yellow-500"
                                                        />
                                                 ))}
                                          </div>

                                          <div className="text-sm text-gray-600 mt-2">{selectedHotel?.address}</div>
                                   </div>
                            </InfoWindow>
                     )}
              </>
       );
};
