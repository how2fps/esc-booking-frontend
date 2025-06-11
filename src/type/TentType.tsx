interface LocationMap {
    lat: number
    lng: number
}

export interface TentType {
    id: string;
    category: string;
    continents: string;
    country: string;
    name: string;
    image: string;
    location: string;
    locationMap: LocationMap;
    rate: number;
    price: number;
    listImage: Array<string>;
    shortDesc: string;
    description: string;
    services: Array<string>,
    amenities: Array<string>,
    activities: Array<string>,
    terrain: Array<string>,
}