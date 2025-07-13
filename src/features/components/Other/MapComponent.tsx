import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";

const MapComponent = () => {
       return (
              <div className="w-full h-full overflow-hidden relative">
                     <MapContainer
                            center={{ lat: 43.817308, lng: 7.64 }}
                            zoom={8}
                            scrollWheelZoom={true}
                            style={{ width: "100%", height: "100%" }}>
                            <TileLayer
                                   attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                     </MapContainer>
              </div>
       );
};
export default MapComponent;
