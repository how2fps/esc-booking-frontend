"use client";

import { useEffect, useMemo, useState } from "react";

import * as Icon from "phosphor-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useSearchParams } from "react-router";
import HotelItem from "../../components/HotelItem/HotelItem";
import HandlePagination from "../../components/Other/HandlePagination";

import { StarIcon } from "@phosphor-icons/react";
import { APIProvider, Map as GoogleMap } from "@vis.gl/react-google-maps";
import type { Hotel, HotelFilter, HotelPrice } from "../../type/HotelType";
import { AmenityFilter } from "./AmenityFilter";
import { ClusteredTreeMarkers } from "./ClusteredTreeMarkers";

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
       const [itemsPerPage, setItemsPerPage] = useState<number>(8);

       const [isLoading, setIsLoading] = useState<boolean>(true);

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
                            console.log(hotelResults);
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
                            console.log(hotelPricesResponse);
                            const hotelPricesArray = hotelPricesResponse.data.hotels;
                            clearTimeout(timeoutId);
                            const priceMap = new Map<string, HotelPrice>();
                            hotelPricesArray.forEach((price: HotelPrice) => {
                                   priceMap.set(price.id, price);
                            });
                            setHotelPrices(priceMap);
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
              return mergedHotels.filter((hotel) => hotel.rating >= filters.minimumRating && [...filters.amenities].every((amenity) => hotel.amenities[amenity]));
       }, [filters, mergedHotels]);

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
              <div className="lg:py-20 md:py-14 max-lg:mt-10 max-md:mt-40 py-10">
                     <APIProvider apiKey={""}>
                            <GoogleMap
                                   mapId={"23a74d563be6cbd9931b8972"}
                                   style={{ width: "100vw", height: "100vh" }}
                                   defaultCenter={{ lat: 22.54992, lng: 0 }}
                                   defaultZoom={3}
                                   gestureHandling={"greedy"}
                                   disableDefaultUI={true}>
                                   <ClusteredTreeMarkers
                                          trees={[
                                                 {
                                                        name: "Ash, green",
                                                        category: "ash",
                                                        position: {
                                                               lat: 43.649536,
                                                               lng: -79.416187,
                                                        },
                                                 },
                                                 {
                                                        name: "Birch, white",
                                                        category: "birch",
                                                        position: {
                                                               lat: 43.803719,
                                                               lng: -79.354535,
                                                        },
                                                 },
                                                 {
                                                        name: "Maple, Manitoba",
                                                        category: "maple",
                                                        position: {
                                                               lat: 43.677625,
                                                               lng: -79.27608,
                                                        },
                                                 },
                                                 {
                                                        name: "Elm, American 'Valley Forge'",
                                                        category: "elm",
                                                        position: {
                                                               lat: 43.743692,
                                                               lng: -79.425206,
                                                        },
                                                 },
                                                 {
                                                        name: "Spruce, Colorado blue",
                                                        category: "spruce",
                                                        position: {
                                                               lat: 43.733889,
                                                               lng: -79.315376,
                                                        },
                                                 },
                                                 {
                                                        name: "Maple, Norway 'Schwedler'",
                                                        category: "maple",
                                                        position: {
                                                               lat: 43.713252,
                                                               lng: -79.551785,
                                                        },
                                                 },
                                                 {
                                                        name: "Mulberry, white",
                                                        category: "mulberry",
                                                        position: {
                                                               lat: 43.758245,
                                                               lng: -79.377848,
                                                        },
                                                 },
                                                 {
                                                        name: "Elm, Siberian",
                                                        category: "elm",
                                                        position: {
                                                               lat: 43.692469,
                                                               lng: -79.479295,
                                                        },
                                                 },
                                                 {
                                                        name: "Kentucky coffee",
                                                        category: "kentucky_coffee",
                                                        position: {
                                                               lat: 43.757918,
                                                               lng: -79.569502,
                                                        },
                                                 },
                                                 {
                                                        name: "Katsura, Japanese",
                                                        category: "katsura",
                                                        position: {
                                                               lat: 43.64681,
                                                               lng: -79.45259,
                                                        },
                                                 },
                                                 {
                                                        name: "Elm, American",
                                                        category: "elm",
                                                        position: {
                                                               lat: 43.735598,
                                                               lng: -79.400083,
                                                        },
                                                 },
                                                 {
                                                        name: "Maple, Norway",
                                                        category: "maple",
                                                        position: {
                                                               lat: 43.671794,
                                                               lng: -79.283123,
                                                        },
                                                 },
                                                 {
                                                        name: "Oak, white",
                                                        category: "oak",
                                                        position: {
                                                               lat: 43.705484,
                                                               lng: -79.517828,
                                                        },
                                                 },
                                                 {
                                                        name: "Honey locust, 'Skyline'",
                                                        category: "honey_locust",
                                                        position: {
                                                               lat: 43.661668,
                                                               lng: -79.569728,
                                                        },
                                                 },
                                                 {
                                                        name: "Cherry",
                                                        category: "cherry",
                                                        position: {
                                                               lat: 43.657817,
                                                               lng: -79.408632,
                                                        },
                                                 },
                                                 {
                                                        name: "Maple, Norway",
                                                        category: "maple",
                                                        position: {
                                                               lat: 43.688379,
                                                               lng: -79.389302,
                                                        },
                                                 },
                                                 {
                                                        name: "Hackberry",
                                                        category: "hackberry",
                                                        position: {
                                                               lat: 43.748501,
                                                               lng: -79.505892,
                                                        },
                                                 },
                                                 {
                                                        name: "Ash, green",
                                                        category: "ash",
                                                        position: {
                                                               lat: 43.722747,
                                                               lng: -79.400488,
                                                        },
                                                 },
                                                 {
                                                        name: "Mulberry, white",
                                                        category: "mulberry",
                                                        position: {
                                                               lat: 43.734214,
                                                               lng: -79.596881,
                                                        },
                                                 },
                                                 {
                                                        name: "Apple, Sargents",
                                                        category: "apple",
                                                        position: {
                                                               lat: 43.810627,
                                                               lng: -79.331971,
                                                        },
                                                 },
                                                 {
                                                        name: "Mountain ash, European",
                                                        category: "mountain_ash",
                                                        position: {
                                                               lat: 43.712975,
                                                               lng: -79.437332,
                                                        },
                                                 },
                                                 {
                                                        name: "Oak, white",
                                                        category: "oak",
                                                        position: {
                                                               lat: 43.664408,
                                                               lng: -79.362675,
                                                        },
                                                 },
                                                 {
                                                        name: "Tulip tree",
                                                        category: "tulip_tree",
                                                        position: {
                                                               lat: 43.781231,
                                                               lng: -79.271087,
                                                        },
                                                 },
                                                 {
                                                        name: "Honey locust, 'Shade master'",
                                                        category: "honey_locust",
                                                        position: {
                                                               lat: 43.759238,
                                                               lng: -79.572286,
                                                        },
                                                 },
                                                 {
                                                        name: "Hackberry",
                                                        category: "hackberry",
                                                        position: {
                                                               lat: 43.807349,
                                                               lng: -79.203822,
                                                        },
                                                 },
                                                 {
                                                        name: "Pear, 'Chanticleer'",
                                                        category: "pear",
                                                        position: {
                                                               lat: 43.664706,
                                                               lng: -79.379063,
                                                        },
                                                 },
                                                 {
                                                        name: "Oak, red",
                                                        category: "oak",
                                                        position: {
                                                               lat: 43.774533,
                                                               lng: -79.433893,
                                                        },
                                                 },
                                                 {
                                                        name: "Cedar, white",
                                                        category: "cedar",
                                                        position: {
                                                               lat: 43.678174,
                                                               lng: -79.386469,
                                                        },
                                                 },
                                                 {
                                                        name: "Tulip tree",
                                                        category: "tulip_tree",
                                                        position: {
                                                               lat: 43.714863,
                                                               lng: -79.434395,
                                                        },
                                                 },
                                                 {
                                                        name: "Spruce, Colorado blue",
                                                        category: "spruce",
                                                        position: {
                                                               lat: 43.771956,
                                                               lng: -79.350022,
                                                        },
                                                 },
                                                 {
                                                        name: "Planetree, London",
                                                        category: "planetree",
                                                        position: {
                                                               lat: 43.638764,
                                                               lng: -79.399562,
                                                        },
                                                 },
                                                 {
                                                        name: "Honey locust",
                                                        category: "honey_locust",
                                                        position: {
                                                               lat: 43.65169,
                                                               lng: -79.409355,
                                                        },
                                                 },
                                                 {
                                                        name: "Maple, Norway 'Crimson King'",
                                                        category: "maple",
                                                        position: {
                                                               lat: 43.597848,
                                                               lng: -79.507864,
                                                        },
                                                 },
                                                 {
                                                        name: "Ginkgo",
                                                        category: "ginkgo",
                                                        position: {
                                                               lat: 43.629981,
                                                               lng: -79.509956,
                                                        },
                                                 },
                                                 {
                                                        name: "Maple, red",
                                                        category: "maple",
                                                        position: {
                                                               lat: 43.717347,
                                                               lng: -79.358774,
                                                        },
                                                 },
                                                 {
                                                        name: "Falsecypress, Japanese",
                                                        category: "falsecypress",
                                                        position: {
                                                               lat: 43.720001,
                                                               lng: -79.259322,
                                                        },
                                                 },
                                                 {
                                                        name: "Zelkova",
                                                        category: "zelkova",
                                                        position: {
                                                               lat: 43.796296,
                                                               lng: -79.329844,
                                                        },
                                                 },
                                                 {
                                                        name: "Elm",
                                                        category: "elm",
                                                        position: {
                                                               lat: 43.730184,
                                                               lng: -79.338479,
                                                        },
                                                 },
                                                 {
                                                        name: "Maple, Norway",
                                                        category: "maple",
                                                        position: {
                                                               lat: 43.758978,
                                                               lng: -79.415264,
                                                        },
                                                 },
                                                 {
                                                        name: "Honey locust",
                                                        category: "honey_locust",
                                                        position: {
                                                               lat: 43.633139,
                                                               lng: -79.564972,
                                                        },
                                                 },
                                                 {
                                                        name: "Buckeye, yellow",
                                                        category: "buckeye",
                                                        position: {
                                                               lat: 43.752687,
                                                               lng: -79.465538,
                                                        },
                                                 },
                                          ]}
                                   />
                            </GoogleMap>
                     </APIProvider>
                     <div className="container">
                            <div className="flex">
                                   <div className="left lg:w-1/4 w-1/3 pr-[45px] max-md:hidden">
                                          <div className="sidebar-main">
                                                 <div className="border-2 border-black rounded-[12px] p-4">
                                                        <div className="heading6">Price Range</div>
                                                        <div className="price-block flex items-center justify-between flex-wrap mt-3">
                                                               ${filters.priceRange.min} - ${filters.priceRange.max}
                                                        </div>
                                                        <Slider
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
                                                 <div className="border-2 border-black rounded-[12px] p-4 mt-8">
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
                                                                      value={itemsPerPage}>
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
       );
};

export default HotelListings;
