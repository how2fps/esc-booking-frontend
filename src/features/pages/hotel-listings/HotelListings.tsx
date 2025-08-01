"use client";

import { useEffect, useMemo, useState } from "react";

import * as Icon from "phosphor-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useSearchParams } from "react-router-dom";
import HotelItem from "../../components/HotelItem/HotelItem";
import HandlePagination from "../../components/Other/HandlePagination";

import { SpinnerIcon, StarIcon } from "@phosphor-icons/react";
import { APIProvider, Map as GoogleMap } from "@vis.gl/react-google-maps";
import type { Hotel, HotelFilter, HotelMarker, HotelPrice } from "../../type/HotelType";
import { AmenityFilter } from "./AmenityFilter";
import { ClusteredHotelMarkers } from "./ClusteredHotelMarkers";
const formatDate = (dateString: string): string => {
       const date = new Date(dateString);
       const year = date.getFullYear();
       const month = date.getMonth() + 1;
       const day = date.getDate();
       return `${year}-${month}-${day}`;
};

//?location=RsBU&startDate=7/20/2025&endDate=7/27/2025&adult=1&children=1&room=2
const HotelListings = () => {
       // eslint-disable-next-line @typescript-eslint/no-unused-vars
       const [searchParams, _] = useSearchParams();
       const destination_id = searchParams.get("location");
       const checkIn = formatDate(searchParams.get("startDate") as string);
       const checkOut = formatDate(searchParams.get("endDate") as string);

       const [allHotels, setAllHotels] = useState<HotelMarker[]>([]);
       const [hotelPrices, setHotelPrices] = useState<Map<string, HotelPrice>>(new Map());
       const [searchTerm, setSearchTerm] = useState<string>("");
       const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
       const [sortOption, setSortOption] = useState<string>();

       const [currentPage, setCurrentPage] = useState<number>(1);
       const [itemsPerPage, setItemsPerPage] = useState<number>(8);

       const [isLoading, setIsLoading] = useState<boolean>(true);
       // eslint-disable-next-line @typescript-eslint/no-unused-vars
       const [error, setError] = useState<string | null>(null);

       const [filters, setFilters] = useState<HotelFilter>({
              amenities: new Set(),
              priceRange: { min: 0, max: 10000 },
              minimumRating: 0,
       });

       const handlePageChange = (selected: number) => {
              setCurrentPage(selected + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
       };

       const handleItemsPerPageChange = (newItemsPerPage: number) => {
              setItemsPerPage(newItemsPerPage);
              setCurrentPage(1);
       };

       useEffect(() => {
              const handler = setTimeout(() => {
                     setDebouncedSearchTerm(searchTerm);
              }, 300);

              return () => {
                     clearTimeout(handler);
              };
       }, [searchTerm]);

       useEffect(() => {
              const fetchHotelsByDestination = async () => {
                     setIsLoading(true);
                     try {
                            const response = await fetch(`http://localhost:3000/api/hotels?destination_id=${destination_id}&checkin=${checkIn}&checkout=${checkOut}&lang=${"en_US"}&currency=${"SGD"}&country_code=${"SG"}&guests=${2}&partner_id=${1}`, {
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
       }, [checkIn, checkOut, destination_id]);

       useEffect(() => {
              let isMounted = true;
              let timeoutId: number | undefined;

              const fetchHotelPricesWithPolling = async () => {
                     try {
                            let retries = 0;
                            const maxRetries = 40;
                            const delay = 2000;

                            while (retries < maxRetries) {
                                   const response = await fetch(`http://localhost:3000/api/hotels/prices?destination_id=${destination_id}&checkin=${checkIn}&checkout=${checkOut}&lang=en_US&currency=SGD&country_code=SG&guests=2&partner_id=1`);

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
       }, [checkIn, checkOut, destination_id]);

       const mergedHotels = useMemo(() => {
              return allHotels.map((hotel) => {
                     const priceData = hotelPrices.get(hotel.id);
                     return {
                            ...hotel,
                            price: priceData?.price ?? hotel.price,
                     };
              });
       }, [allHotels, hotelPrices]);

       const filteredHotelsArray = useMemo(() => {
              const filteredHotels: HotelMarker[] = mergedHotels.filter((hotel) => hotel.rating >= filters.minimumRating && [...filters.amenities].every((amenity) => hotel.amenities[amenity]) && hotel.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
              return filteredHotels;
       }, [filters, mergedHotels, debouncedSearchTerm]);

       const sortedHotelsArray = useMemo(() => {
              const arr = [...filteredHotelsArray];
              if (sortOption === "starHighToLow") {
                     return arr.sort((a, b) => b.rating - a.rating);
              }
              if (sortOption === "priceHighToLow") {
                     return arr.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
              }
              if (sortOption === "priceLowToHigh") {
                     return arr.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
              }
              return arr;
       }, [filteredHotelsArray, sortOption]);

       const pageCount = useMemo(() => {
              return Math.ceil(sortedHotelsArray.length / itemsPerPage) || 1;
       }, [sortedHotelsArray, itemsPerPage]);

       const currentPageHotels = useMemo(() => {
              const startIndex = (currentPage - 1) * itemsPerPage;
              const endIndex = startIndex + itemsPerPage;
              return sortedHotelsArray.slice(startIndex, endIndex);
       }, [itemsPerPage, currentPage, sortedHotelsArray]);

       return (
              <div className="bg-white text-black lg:py-20 md:py-14 max-lg:mt-10 max-md:mt-40 py-10 px-12">
                     <div className="flex">
                            <div className="left lg:w-1/4 w-1/3 pr-[45px] max-md:hidden">
                                   <div className="sidebar-main">
                                          {isLoading ? (
                                                 <div
                                                        role="status"
                                                        className="w-full h-[400px] rounded-xl border-2 border-black overflow-hidden mb-4 flex justify-center items-center">
                                                        <SpinnerIcon
                                                               className="animate-spin text-blue-500"
                                                               size={32}
                                                        />
                                                 </div>
                                          ) : (
                                                 <APIProvider apiKey={"AIzaSyAb7h-Azds2hKTEeVfuGzcDy4uXSigGYzI"}>
                                                        <div className="w-full h-[400px] rounded-xl border-2 border-black overflow-hidden mb-4">
                                                               <GoogleMap
                                                                      mapId={"23a74d563be6cbd9931b8972"}
                                                                      style={{ width: "100%", height: "397px", borderRadius: "12px" }}
                                                                      defaultCenter={
                                                                             allHotels.length > 0 ? { lat: allHotels[0].latitude, lng: allHotels[0].longitude } : { lat: 0, lng: 0 } // or a sensible fallback location
                                                                      }
                                                                      defaultZoom={14}
                                                                      gestureHandling={"greedy"}
                                                                      disableDefaultUI={true}>
                                                                      <ClusteredHotelMarkers hotels={filteredHotelsArray} />
                                                               </GoogleMap>
                                                        </div>
                                                 </APIProvider>
                                          )}
                                          <div className="flex"></div>
                                          <div className="border-2 border-black rounded-[12px] p-4 mt-4">
                                                 <div className="heading6">Price Range</div>
                                                 <div className="price-block flex items-center justify-between flex-wrap mt-3">
                                                        ${filters.priceRange.min} - ${filters.priceRange.max}
                                                 </div>
                                                 <Slider
                                                        data-testid="price-slider"
                                                        range
                                                        value={[filters.priceRange.min, filters.priceRange.max]}
                                                        min={0}
                                                        max={30000}
                                                        onChange={(value) => {
                                                               if (Array.isArray(value) && value.length === 2) {
                                                                      const [min, max] = value;
                                                                      setFilters((prev) => ({
                                                                             ...prev,
                                                                             priceRange: { min, max },
                                                                      }));
                                                               }
                                                        }}
                                                        className="mt-4"
                                                 />
                                          </div>
                                          <div
                                                 data-testid="rating-slider"
                                                 className="border-2 border-black rounded-[12px] p-4 mt-8">
                                                 <div className="heading6">Rating</div>
                                                 <div className="price-block flex items-center justify-between flex-wrap">
                                                        <div className="flex items-center gap-1">
                                                               ≥ {filters.minimumRating}
                                                               <StarIcon
                                                                      className="text-yellow"
                                                                      weight="fill"
                                                               />
                                                        </div>
                                                 </div>
                                                 <Slider
                                                        value={filters.minimumRating}
                                                        min={0}
                                                        max={5}
                                                        step={0.5}
                                                        className="mt-2"
                                                        onChange={(value) =>
                                                               setFilters((prev) => ({
                                                                      ...prev,
                                                                      minimumRating: typeof value === "number" ? value : prev.minimumRating,
                                                               }))
                                                        }
                                                 />
                                          </div>
                                          <AmenityFilter setFilters={setFilters} />
                                   </div>
                            </div>
                            <div className="right lg:w-3/4 md:w-2/3 md:pl-[15px]">
                                   <div className="right flex items-center gap-3">
                                          <div className="flex-1">
                                                 <input
                                                        type="text"
                                                        placeholder="Search hotels..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="w-full rounded-lg border-2 border-black h-14 px-4 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                                                 />
                                          </div>
                                          <div className="select-block relative cursor-pointer">
                                                 <label htmlFor="items-per-page">Items Per Page: </label>
                                                 <select
                                                        id="items-per-page"
                                                        name="select-filter"
                                                        className="custom-select cursor-pointer h-14 rounded-lg border-2 border-black bg-white text-black"
                                                        onChange={(e) => {
                                                               handleItemsPerPageChange(Number.parseInt(e.target.value));
                                                        }}
                                                        value={itemsPerPage}>
                                                        <option value="8">8</option>
                                                        <option value="9">9</option>
                                                        <option value="12">12</option>
                                                        <option value="16">16</option>
                                                 </select>
                                                 <Icon.CaretDown className="text-s absolute top-1/2 -translate-y-1/2 md:right-4 right-2 cursor-pointer pointer-events-none" />
                                          </div>
                                          <div className="select-block relative cursor-pointer">
                                                 <label htmlFor="sort">Sort By: </label>
                                                 <select
                                                        id="sort"
                                                        name="select-filter"
                                                        className="custom-select cursor-pointer h-14 rounded-lg border-2 border-black bg-white text-black"
                                                        onChange={(e) => {
                                                               setSortOption(e.target.value);
                                                        }}
                                                        defaultValue={"Sorting"}>
                                                        <option value="starHighToLow">Review High To Low</option>
                                                        <option value="priceHighToLow">Price High To Low</option>
                                                        <option value="priceLowToHigh">Price Low To High</option>
                                                 </select>
                                                 <Icon.CaretDown className="text-s absolute top-1/2 -translate-y-1/2 md:right-4 right-2 cursor-pointer pointer-events-none" />
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
                                                        <div>No results available.</div>
                                                 )}
                                          </div>
                                   )}
                                   {currentPageHotels.length > 0 ? (
                                          <HandlePagination
                                                 pageCount={pageCount}
                                                 onPageChange={handlePageChange}
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
