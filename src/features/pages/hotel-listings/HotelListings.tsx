"use client";

import { useEffect, useState } from "react";

import * as Icon from "phosphor-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Suspense } from "react";
import { useSearchParams } from "react-router";
import Footer from "../../components/Footer/Footer";
import HeaderOne from "../../components/Header/Header";
import HandlePagination from "../../components/Other/HandlePagination";
import TentItem from "../../components/Tent/TentItem";

import { Link } from "react-router-dom";
import { FilterCheckbox } from "./FilterCheckbox";

type Amenity = string;
type PriceRange = { min: number; max: number };

interface Hotel {
       id: string;
       name: string;
       address: string;
       amenities: Set<Amenity>;
       priceRange: PriceRange;
}
//?location=RsBU&startDate=7/20/2025&endDate=7/27/2025&adult=1&children=1&room=2
const HotelListings = () => {
       const [searchParams, setSearchParams] = useSearchParams();
       const destination_id = searchParams.get("location");
       const [pageCount, setPageCount] = useState<number>(1);
       const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);

       const [page, setPage] = useState<number>(1);
       const [filters, setFilters] = useState<Hotel>({
              id: "",
              name: "",
              address: "",
              amenities: new Set(),
              priceRange: { min: 0, max: 500 },
       });

       useEffect(() => {
              const fetchHotelsByDestination = async () => {
                     const response = await fetch(`http://localhost:3000/api/hotels?destination_id=${destination_id}`);
                     const hotelResults = await response.json();
                     console.log(hotelResults);
              };
              fetchHotelsByDestination();
       }, [destination_id]);

       // const tentsPerPage = tentPerPage;
       // const offset = currentPage * tentsPerPage;

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

       // const pageCount = Math.ceil(filteredData.length / tentsPerPage);

       // if (pageCount === 0) {
       //        setCurrentPage(0);
       // }

       // let currentTents: TentType[];

       // if (filteredData.length > 0) {
       //        currentTents = filteredData.slice(offset, offset + tentsPerPage);
       // } else {
       //        currentTents = [];
       // }

       // const handlePageChange = (selected: number) => {
       //        setCurrentPage(selected);
       // };

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
                                                                                    onChange={(e) => {}}
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
                                                               {filteredHotels.map((item) =>
                                                                      item.id === "no-data" ? (
                                                                             <div
                                                                                    key={item.id}
                                                                                    className="no-data-product">
                                                                                    No tents match the selected criteria.
                                                                             </div>
                                                                      ) : (
                                                                             <TentItem
                                                                                    key={item.id}
                                                                                    data={item}
                                                                                    type="default"
                                                                             />
                                                                      )
                                                               )}
                                                        </div>

                                                        {pageCount > 1 && (
                                                               <div className="list-pagination flex items-center md:mt-10 mt-7">
                                                                      <HandlePagination
                                                                             pageCount={1}
                                                                             onPageChange={() => {}}
                                                                      />
                                                               </div>
                                                        )}
                                                 </div>
                                          </div>
                                   </div>
                            </div>

                            <div>
                                   <div
                                          className="sidebar-main"
                                          onClick={(e) => {
                                                 e.stopPropagation();
                                          }}>
                                          <div className="filter-price">
                                                 <div className="heading6">Price Range</div>
                                                 <Slider
                                                        range
                                                        defaultValue={[0, 500]}
                                                        min={0}
                                                        max={500}
                                                        onChange={() => {}}
                                                        className="mt-4"
                                                 />
                                                 <div className="price-block flex items-center justify-between flex-wrap mt-3">
                                                        <div className="min flex items-center gap-1">
                                                               <div>Min price:</div>
                                                               <div className="price-min text-button">
                                                                      $<span>{0}</span>
                                                               </div>
                                                        </div>
                                                        <div className="max flex items-center gap-1">
                                                               <div>Max price:</div>
                                                               <div className="price-max text-button">
                                                                      $<span>{1}</span>
                                                               </div>
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
