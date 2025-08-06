/// <reference lib="webworker" />

import type { HotelFilter, HotelMarker, HotelPrice } from "../../type/HotelType";

type WorkerMessage =
       | { type: "setHotels"; hotels: HotelMarker[] }
       | { type: "pollPrices"; checkIn: string; checkOut: string; destinationId: string; numberOfAdults: string; numberOfChildren: string; numberOfRooms: string }
       | {
                type: "filterAndSort";
                filters: HotelFilter;
                searchTerm: string;
                sortOption: string;
                page: number;
                itemsPerPage: number;
         };

let allHotels: HotelMarker[] = [];

function padDateWithZero(dateStr: string): string {
       return dateStr
              .split("-")
              .map((n) => n.padStart(2, "0"))
              .join("-");
}

function getGuestsQueryString(noOfGuests: number, noOfRooms: number): string {
       return Array(noOfRooms).fill(noOfGuests).join("|");
}

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
       const message = event.data;

       if (message.type === "setHotels") {
              allHotels = message.hotels;
              self.postMessage(allHotels);
              return;
       }

       if (message.type === "pollPrices") {
              const { checkIn, checkOut, destinationId, numberOfAdults, numberOfChildren, numberOfRooms } = message;
              let timeoutId: ReturnType<typeof setTimeout> | undefined;
              const formattedCheckinDate = padDateWithZero(checkIn);
              const formattedCheckoutDate = padDateWithZero(checkOut);
              const numberOfGuests: number = numberOfAdults && numberOfChildren ? +numberOfAdults + +numberOfChildren : 0;
              const guestQueryString = getGuestsQueryString(numberOfGuests, Number(numberOfRooms));
              const fetchHotelPricesWithPolling = async () => {
                     try {
                            let retries = 0;
                            const maxRetries = 40;
                            const delay = 2000;
                            while (retries < maxRetries) {
                                   const response = await fetch(`http://localhost:3000/api/hotels/prices?destination_id=${destinationId}&checkin=${formattedCheckinDate}&checkout=${formattedCheckoutDate}&lang=en_US&currency=SGD&country_code=SG&guests=${guestQueryString}&partner_id=${1089}&landing_page=wl-acme-earn&product_type=earn`);
                                   const result = await response.json();
                                   if (result.completed && result.hotels) {
                                          const priceMap = new Map<string, HotelPrice>();
                                          result.hotels.forEach((price: HotelPrice) => {
                                                 priceMap.set(price.id, price);
                                          });
                                          if (allHotels.length > 0) {
                                                 allHotels = allHotels.map((hotel) => {
                                                        const priceData = priceMap.get(hotel.id);
                                                        if (priceData) {
                                                               return {
                                                                      ...hotel,
                                                                      price: priceData?.price,
                                                               };
                                                        } else {
                                                               return hotel;
                                                        }
                                                 });
                                                 self.postMessage(allHotels);
                                          }
                                          return;
                                   }
                                   retries++;
                                   await new Promise((resolve) => (timeoutId = setTimeout(resolve, delay)));
                            }
                            console.warn("Hotel price polling timed out");
                     } catch (error) {
                            if (error instanceof Error) {
                                   console.error("Polling error:", error);
                            }
                     }
              };
              fetchHotelPricesWithPolling();
              return () => {
                     clearTimeout(timeoutId);
              };
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
