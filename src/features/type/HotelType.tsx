interface LocationMap {
       lat: number;
       lng: number;
}

export interface Hotel {
       id: string;
       name: string;
       address: string;
       amenities: Array<string>;
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
       coverted_max_cash_payment: number; // Note: this seems to be a typo for "converted"
       points: number;
       bonuses: number;
       bonus_programs: string[]; // or any[] if the programs can be objects
       bonus_tiers: string[]; // or any[] if the tiers can be objects
       lowest_price: number;
       price: number;
       converted_price: number;
       lowest_converted_price: number;
       market_rates: any[]; // or define a specific type for market rates if you know the structure
}
