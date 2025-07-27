interface LocationMap {
    lat: number
    lng: number
}

export interface HotelType {
    id: string;
    imageCount : number;
    name: string;
    latitude: number;
    longitude: number;
    address: string;
    rating: string;
    categories: string;
    description: string;
    amenities:Record<string, boolean> 
    image_details: {
            "suffix": string,
            "count": number,
            "prefix": string
        };
}