/// <reference lib="webworker" />

import type { HotelFilter, HotelMarker } from "../../type/HotelType";

let allHotels: HotelMarker[] = [];

type WorkerMessage =
       | { type: "setHotels"; hotels: HotelMarker[] }
       | {
                type: "filterAndSort";
                filters: HotelFilter;
                searchTerm: string;
                sortOption: string;
                page: number;
                itemsPerPage: number;
         };

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
       const message = event.data;

       if (message.type === "setHotels") {
              allHotels = message.hotels;
              return;
       }

       if (message.type === "filterAndSort") {
              const { filters, searchTerm, sortOption, page, itemsPerPage } = message;

              const result = allHotels.filter((hotel) => hotel.rating >= filters.minimumRating && [...filters.amenities].every((amenity) => hotel.amenities[amenity]) && hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) && hotel.price! >= filters.priceRange.min && hotel.price! <= filters.priceRange.max);

              if (sortOption === "starHighToLow") {
                     result.sort((a, b) => b.rating - a.rating);
              } else if (sortOption === "priceHighToLow") {
                     result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
              } else if (sortOption === "priceLowToHigh") {
                     result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
              }

              const startIndex = (page - 1) * itemsPerPage;
              const paginated = result.slice(startIndex, startIndex + itemsPerPage);

              self.postMessage({ hotels: paginated, total: result.length });
       }
};
