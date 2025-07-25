import type { Marker } from "@googlemaps/markerclusterer";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { useCallback } from "react";
export type Tree = {
       key: string;
       name: string;
       position: google.maps.LatLngLiteral;
};
export type TreeMarkerProps = {
       tree: Tree;
       onClick: (tree: Tree) => void;
       setMarkerRef: (marker: Marker | null, key: string) => void;
};

/**
 * Wrapper Component for an AdvancedMarker for a single tree.
 */
export const TreeMarker = (props: TreeMarkerProps) => {
       const { tree, onClick, setMarkerRef } = props;

       const handleClick = useCallback(() => onClick(tree), [onClick, tree]);
       const ref = useCallback((marker: google.maps.marker.AdvancedMarkerElement) => setMarkerRef(marker, tree.key), [setMarkerRef, tree.key]);

       return (
              <AdvancedMarker
                     position={tree.position}
                     ref={ref}
                     onClick={handleClick}>
                     <span className="marker-clustering-tree">🌳</span>
              </AdvancedMarker>
       );
};
