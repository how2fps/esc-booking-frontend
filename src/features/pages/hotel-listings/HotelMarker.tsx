import type { Marker } from "@googlemaps/markerclusterer";
import { BuildingIcon } from "@phosphor-icons/react";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { useCallback } from "react";
import type { HotelMarker as HotelMarkerType } from "../../type/HotelType";

export type HotelMarkerProps = {
       hotel: HotelMarkerType;
       onClick: (tree: HotelMarkerType) => void;
       setMarkerRef: (marker: Marker | null, key: string) => void;
};

/**
 * Wrapper Component for an AdvancedMarker for a single tree.
 */
export const HotelMarker = (props: HotelMarkerProps) => {
       const { hotel, onClick, setMarkerRef } = props;

       const handleClick = useCallback(() => onClick(hotel), [onClick, hotel]);
       const ref = useCallback((marker: google.maps.marker.AdvancedMarkerElement) => setMarkerRef(marker, hotel.key), [setMarkerRef, hotel.key]);

       return (
              <AdvancedMarker
                     position={hotel.position}
                     ref={ref}
                     onClick={handleClick}>
                     <span className="marker-clustering-tree">
                            <BuildingIcon color="red" />
                     </span>
              </AdvancedMarker>
       );
};
