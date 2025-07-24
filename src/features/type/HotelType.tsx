

interface CategoryDetail{
    name: string;
    score:number;
    popularity: number;
}
interface AmenityRating {
  name: string;
  score: number;
}
export interface HotelType {
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