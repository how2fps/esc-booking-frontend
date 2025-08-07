"use client";

import { memo, useEffect, useMemo, useState } from "react";

import * as Icon from "phosphor-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useSearchParams } from "react-router-dom";
import HotelItem from "../../components/HotelItem/HotelItem";
import HandlePagination from "../../components/Other/HandlePagination";

import { SpinnerIcon } from "@phosphor-icons/react";
import { APIProvider, Map as GoogleMap } from "@vis.gl/react-google-maps";
import type { Hotel, HotelFilter, HotelMarker, HotelPrice } from "../../type/HotelType";
import { AmenityFilter } from "./AmenityFilter";
import { ClusteredHotelMarkers as ClusteredHotelMarkersBase } from "./ClusteredHotelMarkers";
import { StarRatingPicker } from "./StarRatingPicker";

const ClusteredHotelMarkers = memo(ClusteredHotelMarkersBase);

const formatDate = (dateString: string): string => {
       const date = new Date(dateString);
       const year = date.getFullYear();
       const month = date.getMonth() + 1;
       const day = date.getDate();
       return `${year}-${month}-${day}`;
};
const padDateWithZero = (dateStr: string) =>
       dateStr
              .split("-")
              .map((n) => n.padStart(2, "0"))
              .join("-");

const getGuestsQueryString = (noOfGuests: number, noOfRooms: number) => Array(noOfRooms).fill(noOfGuests).join("|");

//?location=RsBU&startDate=7/20/2025&endDate=7/27/2025&adult=1&children=1&room=2
const HotelListings = () => {
       // eslint-disable-next-line @typescript-eslint/no-unused-vars
       const [searchParams, _] = useSearchParams();
       const destinationId = searchParams.get("location");
       const checkIn = formatDate(searchParams.get("startDate") as string);
       const checkOut = formatDate(searchParams.get("endDate") as string);
       const numberOfRooms = searchParams.get("room");
       const numberOfAdults = searchParams.get("adult");
       const numberOfChildren = searchParams.get("children");

       const [hotelStarsFilter, setHotelStarsFilter] = useState(0);
       const [hotelRatingFilter, setHotelRatingFilter] = useState(0);
       const [priceFilter, setPriceFilter] = useState<{ min: number; max: number }>({ min: 0, max: 10000 });
       const [searchTerm, setSearchTerm] = useState<string>("");
       const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

       const [sortOption, setSortOption] = useState<string>();

       const [allHotels, setAllHotels] = useState<HotelMarker[]>([]);
       const [hotelPrices, setHotelPrices] = useState<Map<string, HotelPrice>>(new Map());

       const [pageCount, setPageCount] = useState<number>(1);
       const [currentPage, setCurrentPage] = useState<number>(1);
       const [itemsPerPage, setItemsPerPage] = useState<number>(8);

       const [isLoading, setIsLoading] = useState<boolean>(true);
       // eslint-disable-next-line @typescript-eslint/no-unused-vars
       const [error, setError] = useState<string | null>(null);

       const [filters, setFilters] = useState<HotelFilter>({
              amenities: new Set(),
              priceRange: { min: 0, max: 10000 },
              minimumStars: 0,
              minimumUsersRating: 0,
       });

       useEffect(() => {
              const handler = setTimeout(() => {
                     setDebouncedSearchTerm(searchTerm);
              }, 300);

              return () => {
                     clearTimeout(handler);
              };
       }, [searchTerm]);

       useEffect(() => {
              const id = setTimeout(() => {
                     setFilters((prev) => ({
                            ...prev,
                            priceRange: { min: priceFilter.min, max: priceFilter.max },
                            minimumStars: hotelStarsFilter,
                            minimumUsersRating: hotelRatingFilter,
                     }));
              }, 500);
              return () => clearTimeout(id);
       }, [hotelStarsFilter, priceFilter, hotelRatingFilter]);

       useEffect(() => {
              const fetchHotelsByDestination = async () => {
                     setIsLoading(true);
                     try {
                            const response = await fetch(`http://localhost:3000/api/hotels?destination_id=${destinationId}`, {
                                   method: "GET",
                                   headers: {
                                          "Content-Type": "application/json",
                                   },
                            });
                            const hotelResults: Hotel[] = await response.json();
                            const updatedHotelResults: HotelMarker[] = hotelResults.map((hotel) => {
                                   return { ...hotel, key: hotel.id, position: { lat: hotel.latitude, lng: hotel.longitude } };
                            });
                            setAllHotels(updatedHotelResults);
                            setIsLoading(false);
                     } catch (error: unknown) {
                            if (error instanceof Error) {
                                   console.error("Fetch error details:", {
                                          name: error.name,
                                          message: error.message,
                                          stack: error.stack,
                                   });
                            }
                            setError("Something went wrong while loading hotels. Please try again later.");
                     }
              };
              fetchHotelsByDestination();
       }, [checkIn, checkOut, destinationId]);

       useEffect(() => {
              let timeoutId: ReturnType<typeof setTimeout>;
              let isActive = true;
              const pollPrices = async () => {
                     try {
                            console.log("running");
                            let retries = 0;
                            const maxRetries = 40;
                            const delay = 2000;

                            const formattedCheckinDate = padDateWithZero(checkIn);
                            const formattedCheckoutDate = padDateWithZero(checkOut);
                            const numberOfGuests = numberOfAdults && numberOfChildren ? +numberOfAdults + +numberOfChildren : 0;
                            const guestQueryString = getGuestsQueryString(numberOfGuests, Number(numberOfRooms));

                            while (isActive && retries < maxRetries) {
                                   const res = await fetch(`http://localhost:3000/api/hotels/prices?destination_id=${destinationId}&checkin=${formattedCheckinDate}&checkout=${formattedCheckoutDate}&lang=en_US&currency=SGD&country_code=SG&guests=${guestQueryString}&partner_id=${1089}&landing_page=wl-acme-earn&product_type=earn`);
                                   const data = await res.json();

                                   if (data.completed && data.hotels) {
                                          const priceMap = new Map<string, HotelPrice>();
                                          data.hotels.forEach((p: HotelPrice) => priceMap.set(p.id, p));
                                          setHotelPrices(priceMap);
                                          return;
                                   }
                                   retries++;
                                   await new Promise((resolve) => {
                                          timeoutId = setTimeout(resolve, delay);
                                   });
                            }
                     } catch (err) {
                            console.error("Polling error:", err);
                     }
              };
              pollPrices();
              return () => {
                     isActive = false;
                     clearTimeout(timeoutId);
              };
       }, [checkIn, checkOut, destinationId, numberOfAdults, numberOfChildren, numberOfRooms]);

       const hotelsWithPrices = useMemo(() => {
              return allHotels.map((hotel) => {
                     const priceData = hotelPrices.get(hotel.id);
                     const newPrice = priceData?.price ?? null;

                     if (hotel.price === newPrice) return hotel;

                     return {
                            ...hotel,
                            price: newPrice,
                     };
              });
       }, [allHotels, hotelPrices]);

       const filteredHotels = useMemo(() => {
              const result = hotelsWithPrices.filter((hotel) => hotel.rating >= filters.minimumStars && (hotel.trustyou?.score?.overall ?? 0) >= filters.minimumUsersRating && [...filters.amenities].every((amenity) => hotel.amenities[amenity]) && hotel.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) && (!hotel.price || (hotel.price >= filters.priceRange.min && hotel.price <= filters.priceRange.max)));
              return result;
       }, [filters, debouncedSearchTerm, hotelsWithPrices]);

       const sortedHotels = useMemo(() => {
              const hotelsCopy = [...filteredHotels];
              if (sortOption === "starHighToLow") {
                     hotelsCopy.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
              } else if (sortOption === "starLowToHigh") {
                     hotelsCopy.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
              } else if (sortOption === "priceHighToLow") {
                     hotelsCopy.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
              } else if (sortOption === "priceLowToHigh") {
                     hotelsCopy.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
              } else if (sortOption === "ratingHighToLow") {
                     hotelsCopy.sort((a, b) => (b.trustyou.score.overall ?? 0) - (a.trustyou.score.overall ?? 0));
              } else if (sortOption === "ratingLowToHigh") {
                     hotelsCopy.sort((a, b) => (a.trustyou.score.overall ?? 0) - (b.trustyou.score.overall ?? 0));
              } else {
                     hotelsCopy.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
              }
              return hotelsCopy;
       }, [sortOption, filteredHotels]);

       const currentPageHotels = useMemo(() => {
              const startIndex = (currentPage - 1) * itemsPerPage;
              return sortedHotels.slice(startIndex, startIndex + itemsPerPage);
       }, [sortedHotels, currentPage, itemsPerPage]);

       useEffect(() => {
              setPageCount(Math.ceil(filteredHotels.length / itemsPerPage) || 0);
       }, [filteredHotels, itemsPerPage]);
       return (
              <div className="bg-white text-black lg:py-20 md:py-14 max-lg:mt-10 max-md:mt-40 py-10 px-12">
                     <div className="flex">
                            <div className="left lg:w-1/4 w-1/3 pr-[45px] max-md:hidden">
                                   <div className="sidebar-main space-y-4">
                                          {isLoading ? (
                                                 <div
                                                        role="status"
                                                        className="w-full h-[400px] rounded-xl border border-gray-300 overflow-hidden flex justify-center items-center bg-white shadow">
                                                        <SpinnerIcon
                                                               className="animate-spin text-blue-500"
                                                               size={32}
                                                        />
                                                 </div>
                                          ) : (
                                                 <APIProvider apiKey={"AIzaSyAb7h-Azds2hKTEeVfuGzcDy4uXSigGYzI"}>
                                                        <div className="w-full h-[400px] rounded-xl overflow-hidden shadow">
                                                               <GoogleMap
                                                                      mapId={"23a74d563be6cbd9931b8972"}
                                                                      style={{ width: "100%", height: "397px", borderRadius: "12px" }}
                                                                      defaultCenter={allHotels.length > 0 ? { lat: allHotels[0].latitude, lng: allHotels[0].longitude } : { lat: 0, lng: 0 }}
                                                                      defaultZoom={14}
                                                                      gestureHandling={"greedy"}
                                                                      disableDefaultUI={true}>
                                                                      {/* <ClusteredHotelMarkers hotels={filteredHotels} /> */}
                                                               </GoogleMap>
                                                        </div>
                                                 </APIProvider>
                                          )}

                                          <div className="border rounded-xl p-8">
                                                 <section>
                                                        <div className="mb-8">
                                                               <div className="font-semibold text-gray-800 mb-2 flex justify-left">
                                                                      Price Range: ${priceFilter.min} – ${priceFilter.max}
                                                               </div>
                                                               <Slider
                                                                      data-testid="price-slider"
                                                                      range
                                                                      value={[priceFilter.min, priceFilter.max]}
                                                                      min={0}
                                                                      max={10000}
                                                                      onChange={(value) => {
                                                                             if (Array.isArray(value) && value.length === 2) {
                                                                                    setPriceFilter({ min: value[0], max: value[1] });
                                                                             }
                                                                      }}
                                                               />
                                                        </div>
                                                        <div className="mb-7">
                                                               <div className="font-semibold text-gray-800 mb-2 flex justify-left">Minimum Rating: {hotelRatingFilter}</div>
                                                               <Slider
                                                                      value={hotelRatingFilter}
                                                                      min={0}
                                                                      max={100}
                                                                      step={1}
                                                                      onChange={(value) => {
                                                                             if (typeof value === "number") {
                                                                                    setHotelRatingFilter(value);
                                                                             }
                                                                      }}
                                                               />
                                                        </div>
                                                        <div className="mb-8">
                                                               <StarRatingPicker
                                                                      value={hotelStarsFilter}
                                                                      onChange={(val) => setHotelStarsFilter(val)}
                                                               />
                                                        </div>
                                                        <AmenityFilter setFilters={setFilters} />
                                                 </section>
                                          </div>
                                   </div>
                            </div>
                            <div className="right lg:w-3/4 md:w-2/3 md:pl-[15px]">
                                   <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm mb-6">
                                          <div className="flex-1">
                                                 <input
                                                        type="text"
                                                        placeholder="Search hotels..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                 />
                                          </div>

                                          <div className="flex items-center gap-2">
                                                 <label
                                                        htmlFor="items-per-page"
                                                        className="font-medium text-gray-700">
                                                        Items Per Page:
                                                 </label>
                                                 <div className="relative p-">
                                                        <select
                                                               id="items-per-page"
                                                               name="select-filter"
                                                               className="h-12 bg-white text-black pr-8 cursor-pointer p-2"
                                                               onChange={(e) => {
                                                                      setItemsPerPage(Number.parseInt(e.target.value));
                                                                      setCurrentPage(1);
                                                               }}
                                                               value={itemsPerPage}>
                                                               <option value="8">8</option>
                                                               <option value="9">9</option>
                                                               <option value="12">12</option>
                                                               <option value="16">16</option>
                                                        </select>
                                                        <Icon.CaretDown className="absolute top-1/2 -translate-y-1/2 right-2 pointer-events-none text-gray-500" />
                                                 </div>
                                          </div>

                                          <div className="flex items-center gap-2">
                                                 <label
                                                        htmlFor="sort"
                                                        className="font-medium text-gray-700">
                                                        Sort By:
                                                 </label>
                                                 <div className="relative">
                                                        <select
                                                               id="sort"
                                                               name="select-filter"
                                                               className="h-12 bg-white text-black pr-8 cursor-pointer p-2"
                                                               onChange={(e) => {
                                                                      setSortOption(e.target.value);
                                                               }}
                                                               defaultValue={"starHighToLow"}>
                                                               <option value="starHighToLow">Stars Descending</option>
                                                               <option value="starLowToHigh">Stars Ascending</option>
                                                               <option value="priceHighToLow">Price Descending</option>
                                                               <option value="priceLowToHigh">Price Ascending</option>
                                                               <option value="ratingHighToLow">Rating Descending</option>
                                                               <option value="ratingLowToHigh">Rating Ascending</option>
                                                        </select>
                                                        <Icon.CaretDown className="absolute top-1/2 -translate-y-1/2 right-2 pointer-events-none text-gray-500" />
                                                 </div>
                                          </div>
                                   </div>
                                   {isLoading ? (
                                          <div
                                                 role="status"
                                                 className="flex justify-center items-center min-h-[200px]">
                                                 <SpinnerIcon
                                                        className="animate-spin text-blue-500"
                                                        size={96}
                                                 />
                                          </div>
                                   ) : (
                                          <div className="list-tent md:mt-10 mt-6 grid lg:grid-cols-3 md:grid-cols-2 min-[360px]:grid-cols-2 lg:gap-[30px] gap-4 gap-y-7">
                                                 {currentPageHotels.length > 0 ? (
                                                        currentPageHotels.map((hotel) => (
                                                               <HotelItem
                                                                      key={hotel.id}
                                                                      hotelData={hotel}
                                                               />
                                                        ))
                                                 ) : (
                                                        <div className="col-span-full text-center text-gray-600 py-16">
                                                               <Icon.MagnifyingGlass
                                                                      size={48}
                                                                      className="mx-auto mb-4 text-gray-400"
                                                               />
                                                               <p className="text-lg font-semibold">No hotels match your filters</p>
                                                               <p className="text-sm text-gray-500 mt-2">Try adjusting your filters or search term to see more results.</p>
                                                        </div>
                                                 )}
                                          </div>
                                   )}
                                   {pageCount > 0 ? (
                                          <HandlePagination
                                                 pageCount={pageCount}
                                                 onPageChange={(selected: number) => {
                                                        setCurrentPage(selected + 1);
                                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                                 }}
                                          />
                                   ) : (
                                          ""
                                   )}
                            </div>
                     </div>
              </div>
       );
};

export default HotelListings;
