import { icon } from "leaflet"
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import tentData from '@/data/Tent.json'
import { useRouter } from "next/navigation";

const MapComponent = () => {
    const position = { lat: 43.817308, lng: 7.640 }
    const router = useRouter()

    const ICON = icon({
        iconUrl: "/images/marker-icon.png",
        iconSize: [32, 32],
    })

    const handleDetail = (id: string) => {
        router.push(`/camp/tent-detail?id=${id}`)
    } 

    return (
        <>
            <div className='w-full h-full overflow-hidden relative'>
                <MapContainer center={position} zoom={8} scrollWheelZoom={true} style={{ width: '100%', height: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {tentData.map(item => (
                        <Marker key={item.id} position={{lat: item.locationMap.lat, lng: item.locationMap.lng}} icon={ICON}>
                            <Popup>
                                <div className="cursor-pointer" onClick={() => handleDetail(item.id)}>{item.name}</div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </>
    )
}
export default MapComponent