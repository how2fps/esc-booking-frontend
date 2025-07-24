"use client";

import { useEffect, useMemo, useState } from "react";

import * as Icon from "phosphor-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Suspense } from "react";
import { useSearchParams } from "react-router";
import Footer from "../../components/Footer/Footer";
import HeaderOne from "../../components/Header/Header";
import HotelItem from "../../components/HotelItem/HotelItem";
import HandlePagination from "../../components/Other/HandlePagination";

import { StarIcon } from "@phosphor-icons/react";
import type { Hotel, HotelFilter, HotelPrice } from "../../type/HotelType";
import { AmenityFilter } from "./AmenityFilter";

const formatDate = (dateString: string): string => {
       const date = new Date(dateString);
       const year = date.getFullYear();
       const month = date.getMonth() + 1;
       const day = date.getDate();
       return `${year}-${month}-${day}`;
};

//?location=RsBU&startDate=7/20/2025&endDate=7/27/2025&adult=1&children=1&room=2
const HotelListings = () => {
       const [searchParams, setSearchParams] = useSearchParams();
       const destination_id = searchParams.get("location");
       const checkIn = formatDate(searchParams.get("startDate") as string);
       const checkOut = formatDate(searchParams.get("endDate") as string);

       const [allHotels, setAllHotels] = useState<Hotel[]>([]);
       const [hotelPrices, setHotelPrices] = useState<Map<string, HotelPrice>>(new Map());
       const [sortOption, setSortOption] = useState<string>();

       const [currentPage, setCurrentPage] = useState<number>(1);
       const [itemsPerPage, setItemsPerPage] = useState<number>(12);

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
              const fetchHotelsByDestination = async () => {
                     try {
                            const response = await fetch(`http://localhost:3000/api/hotels?destination_id=${destination_id}&checkin=${checkIn}&checkout=${checkOut}&lang=${"en_US"}&currency=${"SGD"}&country_code=${"SG"}&guests=${2}&partner_id=${1}`, {
                                   method: "GET",
                                   headers: {
                                          "Content-Type": "application/json",
                                   },
                            });
                            const hotelResults = await response.json();
                            setAllHotels(hotelResults);
                     } catch (error: unknown) {
                            if (error instanceof Error) {
                                   console.error("Fetch error details:", {
                                          name: error.name,
                                          message: error.message,
                                          stack: error.stack,
                                   });
                            }
                     }
              };
              fetchHotelsByDestination();
       }, [checkIn, checkOut, destination_id]);

       useEffect(() => {
              const fetchHotelPrices = async () => {
                     try {
                            const controller = new AbortController();
                            const timeoutId = setTimeout(() => controller.abort(), 90000);
                            const response = await fetch(`http://localhost:3000/api/hotels/prices?destination_id=${destination_id}&checkin=${checkIn}&checkout=${checkOut}&lang=${"en_US"}&currency=${"SGD"}&country_code=${"SG"}&guests=${2}&partner_id=${1}`, {
                                   signal: controller.signal,
                                   method: "GET",
                                   headers: {
                                          "Content-Type": "application/json",
                                   },
                            });
                            const hotelPricesResponse = await response.json();
                            const hotelPricesArray = hotelPricesResponse.data.hotels;
                            console.log(hotelPricesArray);
                            clearTimeout(timeoutId);
                            const priceMap = new Map<string, HotelPrice>();
                            hotelPricesArray.forEach((price: HotelPrice) => {
                                   priceMap.set(price.id, price);
                            });
                            // setHotelPrices(priceMap);

                            // setAllHotels((prev) =>
                            //        prev.map((hotel) => {
                            //               const priceData = priceMap.get(hotel.id);
                            //               return {
                            //                      ...hotel,
                            //                      price: priceData?.price ?? hotel.price,
                            //               };
                            //        })
                            // );
                     } catch (error) {
                            if (error instanceof Error) {
                                   console.error("Fetch error details:", {
                                          name: error.name,
                                          message: error.message,
                                          stack: error.stack,
                                   });
                            }
                     }
              };
              fetchHotelPrices();
       }, [checkIn, checkOut, destination_id]);

       const filteredHotelsArray = useMemo(() => {
              return allHotels.filter((hotel) => hotel.rating >= filters.minimumRating && [...filters.amenities].every((amenity) => hotel.amenities[amenity]));
       }, [filters, allHotels]);

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
              <Suspense fallback={<div>Loading...</div>}>
                     <div className="overflow-hidden">
                            <HeaderOne />
                            <div className="lg:py-20 md:py-14 max-lg:mt-10 max-md:mt-40 py-10">
                                   <div className="container">
                                          <div className="flex">
                                                 <div className="left lg:w-1/4 w-1/3 pr-[45px] max-md:hidden">
                                                        <div className="sidebar-main">
                                                               <div className="border-2 border-black rounded-[12px] p-4">
                                                                      <div className="heading6">Price Range</div>
                                                                      <div className="price-block flex items-center justify-between flex-wrap mt-3">
                                                                             <div className="min flex items-center gap-1">
                                                                                    <div>Min:</div>
                                                                                    <div className="price-min text-button">
                                                                                           $<span>{4}</span>
                                                                                    </div>
                                                                             </div>
                                                                             <div className="max flex items-center gap-1">
                                                                                    <div>Max:</div>
                                                                                    <div className="price-max text-button">
                                                                                           $<span>{5}</span>
                                                                                    </div>
                                                                             </div>
                                                                      </div>
                                                                      <Slider
                                                                             range
                                                                             defaultValue={[0, 500]}
                                                                             min={0}
                                                                             max={500}
                                                                             className="mt-4"
                                                                      />
                                                               </div>
                                                               <div className="border-2 border-black rounded-[12px] p-4 mt-8">
                                                                      <div className="heading6">Rating</div>
                                                                      <div className="price-block flex items-center justify-between flex-wrap mt-3">
                                                                             <div className="min flex items-center gap-1">
                                                                                    {filters.minimumRating}
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
                                                                             className="mt-4"
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
                                                        <div className="heading flex items-center justify-between gap-6 flex-wrap">
                                                               <div className="right flex items-center gap-3">
                                                                      <div className="select-block relative cursor-pointer">
                                                                             <select
                                                                                    id="select-filter"
                                                                                    name="select-filter"
                                                                                    className="custom-select cursor-pointer"
                                                                                    onChange={(e) => {
                                                                                           handleItemsPerPageChange(Number.parseInt(e.target.value));
                                                                                    }}
                                                                                    value={itemsPerPage}
                                                                                    defaultValue={"12"}>
                                                                                    <option value="8">8 Per Page</option>
                                                                                    <option value="9">9 Per Page</option>
                                                                                    <option value="12">12 Per Page</option>
                                                                                    <option value="16">16 Per Page</option>
                                                                             </select>
                                                                             <Icon.CaretDown className="text-xl absolute top-1/2 -translate-y-1/2 md:right-4 right-2 cursor-pointer" />
                                                                      </div>
                                                                      <div className="select-block relative cursor-pointer">
                                                                             <select
                                                                                    id="select-filter"
                                                                                    name="select-filter"
                                                                                    className="custom-select cursor-pointer"
                                                                                    onChange={(e) => {
                                                                                           setSortOption(e.target.value);
                                                                                    }}
                                                                                    defaultValue={"Sorting"}>
                                                                                    <option
                                                                                           value="Sorting"
                                                                                           disabled>
                                                                                           Sort by (Default)
                                                                                    </option>
                                                                                    <option value="starHighToLow">Best Review</option>
                                                                                    <option value="priceHighToLow">Price High To Low</option>
                                                                                    <option value="priceLowToHigh">Price Low To High</option>
                                                                             </select>
                                                                             <Icon.CaretDown className="text-xl absolute top-1/2 -translate-y-1/2 md:right-4 right-2" />
                                                                      </div>
                                                               </div>
                                                        </div>

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
                            </div>
                            <Footer />
                     </div>
              </Suspense>
       );
};

export default HotelListings;
