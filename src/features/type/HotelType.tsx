export interface Hotel {
       id: string;
       name: string;
       address: string;
       amenities: {
              [key: string]: boolean;
       };
       priceRange: { min: number; max: number };
       latitude: number;
       longitude: number;
       rating: number;
       distance: number;
       description: string;
       imageCount: number;
       trustyou: {
              id: string | null;
              score: {
                     overall: number;
                     kaligo_overall: number;
                     solo: number | null;
                     couple: number | null;
                     family: number | null;
                     business: number | null;
              };
       };
       amenities_ratings: Array<{
              name: string;
              score: number;
       }>;
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
       images: Array<{
              url: string;
              high_resolution_url: string;
              hero_image?: boolean;
       }>;
       price: number;
       currency: string;
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
