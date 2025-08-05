/// <reference lib="webworker" />

import type { HotelPrice } from "../../type/HotelType";
function padDateWithZero(dateStr: string): string {
       return dateStr
              .split("-")
              .map((n) => n.padStart(2, "0"))
              .join("-");
}
function getGuestsQueryString(noOfGuests: number, noOfRooms: number): string {
       return Array(noOfRooms).fill(noOfGuests).join("|");
}

self.onmessage = async (event) => {
       const { checkIn, checkOut, destination_id, numberOfAdults, numberOfChildren, numberOfRooms } = event.data;
       let isMounted = true;
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
                            const response = await fetch(`http://localhost:3000/api/hotels/prices?destination_id=${destination_id}&checkin=${formattedCheckinDate}&checkout=${formattedCheckoutDate}&lang=en_US&currency=SGD&country_code=SG&guests=${guestQueryString}&partner_id=${1089}&landing_page=wl-acme-earn&product_type=earn`);
                            const result = await response.json();
                            if (result.complete && result.data?.hotels) {
                                   const priceMap = new Map<string, HotelPrice>();
                                   result.data.hotels.forEach((price: HotelPrice) => {
                                          priceMap.set(price.id, price);
                                   });
                                   if (isMounted) setHotelPrices(priceMap);
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
              isMounted = false;
              clearTimeout(timeoutId);
       };
};
