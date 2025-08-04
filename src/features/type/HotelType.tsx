
interface CategoryDetail{
    name: string;
    score:number;
    popularity: number;
}
interface AmenityRating {
  name: string;
  score: number;
}
export interface Hotel {
  id: string;
  imageCount: number;
  latitude: number;
  longitude: number;
  name: string;
  address: string;
  address1: string;
  rating: number;
  distance: number;
  trustyou: {
    id: string;
    score: {
      overall: number;
      kaligo_overall: number;
      solo: number;
      couple: number;
      family: number;
      business: number | null;
    };
  };
  categories: {
    overall: CategoryDetail | null;
    romantic_hotel: CategoryDetail| null;
    family_hotel: CategoryDetail | null;
    business_hotel: CategoryDetail | null;
  };
  amenities_ratings: AmenityRating[];
  description: string;
  amenities: object;
  original_metadata: {
    name: string | null;
    city: string;
    state: string | null;
    country: string;
  };
  image_details: {
    suffix: string;
    count: number;
    prefix: string;
  };
  hires_image_index: string;
  number_of_images: number;
  default_image_index: number;
  imgix_url: string;
  cloudflare_image_url: string;
  checkin_time: string;
  
}
export interface HotelPrice {
       id: string;
       searchRank: number;
       price_type: string;
       free_cancellation: boolean;
       rooms_available: number;
       max_cash_payment: number;
       coverted_max_cash_payment: number;
       points: number;
       bonuses: number;
       bonus_programs: string[];
       bonus_tiers: string[];
       lowest_price: number;
       price: number;
       converted_price: number;
       lowest_converted_price: number;
       market_rates: string[];
}

export interface HotelFilter {
       amenities: Set<string>;
       priceRange: { min: number; max: number };
       minimumRating: number;
}

export interface HotelMarker extends Hotel {
       key: string;
       position: google.maps.LatLngLiteral;
}
