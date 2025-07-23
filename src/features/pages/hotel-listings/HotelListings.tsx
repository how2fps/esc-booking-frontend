"use client";

import { useEffect, useState } from "react";

import * as Icon from "phosphor-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Suspense } from "react";
import { useSearchParams } from "react-router";
import Footer from "../../components/Footer/Footer";
import HeaderOne from "../../components/Header/Header";
import HotelItem from "../../components/HotelItem/HotelItem";
import HandlePagination from "../../components/Other/HandlePagination";

import { Link } from "react-router-dom";
import type { Hotel, HotelPrice } from "../../type/HotelType";
import { FilterCheckbox } from "./FilterCheckbox";

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
       const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);

       const [currentPage, setCurrentPage] = useState<number>(1);
       const [pageCount, setPageCount] = useState<number>(1);
       const [itemsPerPage, setItemsPerPage] = useState<number>(12);

       const [filters, setFilters] = useState<Hotel>({
              id: "",
              name: "",
              address: "",
              amenities: new Set(),
              priceRange: { min: 0, max: 10000 },
       });

       const getCurrentPageItems = () => {
              const startIndex = (currentPage - 1) * itemsPerPage;
              const endIndex = startIndex + itemsPerPage;
              return filteredHotels.slice(startIndex, endIndex);
       };

       const handlePageChange = (selected: number) => {
              setCurrentPage(selected + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
       };

       const handleItemsPerPageChange = (newItemsPerPage: number) => {
              setItemsPerPage(newItemsPerPage);
              setCurrentPage(1);
              setPageCount(Math.ceil(filteredHotels.length / newItemsPerPage));
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

                            console.log(hotelResults);
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
                            console.log("Starting hotel poll...");
                            const controller = new AbortController();
                            const timeoutId = setTimeout(() => controller.abort(), 90000);
                            const response = await fetch(`http://localhost:3000/api/hotels/prices?destination_id=${destination_id}&checkin=${checkIn}&checkout=${checkOut}&lang=${"en_US"}&currency=${"SGD"}&country_code=${"SG"}&guests=${2}&partner_id=${1}`, {
                                   signal: controller.signal,
                                   method: "GET",
                                   headers: {
                                          "Content-Type": "application/json",
                                   },
                            });
                            clearTimeout(timeoutId);
                            const hotelPricesArray = await response.json();
                            if (hotelPricesArray.complete) {
                            }
                            const priceMap = new Map<string, HotelPrice>();
                            hotelPricesArray.forEach((price: HotelPrice) => {
                                   priceMap.set(price.id, price);
                            });
                            setHotelPrices(priceMap);

                            setAllHotels((prev) =>
                                   prev.map((hotel) => {
                                          const priceData = priceMap.get(hotel.id);
                                          return {
                                                 ...hotel,
                                                 price: priceData?.price ?? hotel.price,
                                          };
                                   })
                            );
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

       useEffect(() => {
              setFilteredHotels(allHotels);
              setPageCount(Math.ceil(allHotels.length / itemsPerPage));
              setCurrentPage(1);
              console.log(allHotels);
       }, [filters, allHotels, itemsPerPage]);

       const currentPageItems = getCurrentPageItems();

       // let filteredData = tentData.filter((tent) => {});

       // let sortedData = [...filteredData];

       // if (sortOption === "starHighToLow") {
       //        filteredData = sortedData.sort((a, b) => b.rate - a.rate);
       // }

       // if (sortOption === "priceHighToLow") {
       //        filteredData = sortedData.sort((a, b) => b.price - a.price);
       // }

       // if (sortOption === "priceLowToHigh") {
       //        filteredData = sortedData.sort((a, b) => a.price - b.price);
       // }

       // if (filteredData.length === 0) {
       //        filteredData = [
       //               {
       //                      id: "no-data",
       //                      category: "no-data",
       //                      name: "no-data",
       //                      continents: "no-data",
       //                      country: "no-data",
       //                      location: "no-data",
       //                      locationMap: {
       //                             lat: 0,
       //                             lng: 0,
       //                      },
       //                      rate: 0,
       //                      price: 0,
       //                      listImage: [],
       //                      image: "no-data",
       //                      shortDesc: "no-data",
       //                      description: "no-data",
       //                      services: [],
       //                      amenities: [],
       //                      activities: [],
       //                      terrain: [],
       //               },
       //        ];
       // }

       // if (filteredData.length > 0) {
       //        currentTents = filteredData.slice(offset, offset + tentsPerPage);
       // } else {
       //        currentTents = [];
       // }

       return (
              <Suspense fallback={<div>Loading...</div>}>
                     <div className="overflow-hidden">
                            <HeaderOne />
                            <div className="lg:py-20 md:py-14 max-lg:mt-10 max-md:mt-40 py-10">
                                   <div className="container">
                                          <div className="flex justify-between">
                                                 <div className="left lg:w-1/4 w-1/3 pr-[45px] max-md:hidden">
                                                        <div className="sidebar-main">
                                                               <div className="filter-price">
                                                                      <div className="heading6">Price Range</div>
                                                                      <Slider
                                                                             range
                                                                             defaultValue={[0, 500]}
                                                                             min={0}
                                                                             max={500}
                                                                             className="mt-4"
                                                                      />
                                                                      <div className="price-block flex items-center justify-between flex-wrap mt-3">
                                                                             <div className="min flex items-center gap-1">
                                                                                    <div>Min price:</div>
                                                                                    <div className="price-min text-button">
                                                                                           $<span>{4}</span>
                                                                                    </div>
                                                                             </div>
                                                                             <div className="max flex items-center gap-1">
                                                                                    <div>Max price:</div>
                                                                                    <div className="price-max text-button">
                                                                                           $<span>{5}</span>
                                                                                    </div>
                                                                             </div>
                                                                      </div>
                                                               </div>
                                                               <FilterCheckbox
                                                                      setFilters={setFilters}
                                                                      header={"Services"}
                                                                      options={["reception desk", "pet allowed", "tour guide", "breakfast", "currency exchange", "self-service laundry", "cooking service", "relaxation service", "cleaning service"]}
                                                               />
                                                        </div>
                                                 </div>
                                                 <div className="right lg:w-3/4 md:w-2/3 md:pl-[15px]">
                                                        <div className="heading flex items-center justify-between gap-6 flex-wrap">
                                                               <div className="left flex items-center sm:gap-5 gap-3 max-sm:flex-wrap">
                                                                      <div className="flex items-center gap-3">
                                                                             <div
                                                                                    className="md:hidden show-filter-sidebar flex items-center gap-2 sm:px-4 px-3 py-2.5 border border-outline rounded-lg cursor-pointer duration-300 hover:bg-black hover:text-white"
                                                                                    onClick={() => {}}>
                                                                                    <Icon.SlidersHorizontal className="text-xl" />
                                                                                    <p>Show Filters</p>
                                                                             </div>
                                                                             <Link to={"/camp/topmap-grid"}>
                                                                                    <Icon.SquaresFour className="text-3xl cursor-pointer text-black duration-300" />
                                                                             </Link>
                                                                             <Link to={"/camp/topmap-list"}>
                                                                                    <Icon.Rows className="text-3xl cursor-pointer text-variant2 duration-300 hover:text-black" />
                                                                             </Link>
                                                                      </div>
                                                                      <div className="line w-px h-7 bg-outline max-[400px]:hidden"></div>
                                                                      <div className="body2">{/* Showing {filteredData[0].id === "no-data" ? 0 : offset + 1}-{filteredData[0].id === "no-data" ? 0 : offset + currentTents.length} of {filteredData[0].id === "no-data" ? 0 : filteredData.length} */}</div>
                                                               </div>
                                                               <div className="right flex items-center gap-3">
                                                                      <div className="select-block relative">
                                                                             <select
                                                                                    id="select-filter"
                                                                                    name="select-filter"
                                                                                    className="custom-select"
                                                                                    onChange={(e) => {
                                                                                           handleItemsPerPageChange(Number.parseInt(e.target.value));
                                                                                    }}
                                                                                    value={itemsPerPage}
                                                                                    defaultValue={"12"}>
                                                                                    <option value="8">8 Per Page</option>
                                                                                    <option value="9">9 Per Page</option>
                                                                                    <option value="12">12 Per Page</option>
                                                                                    <option value="15">15 Per Page</option>
                                                                                    <option value="16">16 Per Page</option>
                                                                             </select>
                                                                             <Icon.CaretDown className="text-xl absolute top-1/2 -translate-y-1/2 md:right-4 right-2" />
                                                                      </div>
                                                                      <div className="select-block relative">
                                                                             <select
                                                                                    id="select-filter"
                                                                                    name="select-filter"
                                                                                    className="custom-select"
                                                                                    onChange={(e) => {}}
                                                                                    defaultValue={"Sorting"}>
                                                                                    <option
                                                                                           value="Sorting"
                                                                                           disabled>
                                                                                           Sort by (Defaut)
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
                                                               {currentPageItems.length > 0
                                                                      ? currentPageItems.map((hotel) => (
                                                                               <HotelItem
                                                                                      key={hotel.id}
                                                                                      hotelData={hotel}
                                                                               />
                                                                        ))
                                                                      : ""}
                                                        </div>

                                                        <div className="">
                                                               <HandlePagination
                                                                      pageCount={pageCount}
                                                                      onPageChange={handlePageChange}
                                                               />
                                                        </div>
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
