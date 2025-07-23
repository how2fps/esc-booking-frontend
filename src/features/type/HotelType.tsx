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
