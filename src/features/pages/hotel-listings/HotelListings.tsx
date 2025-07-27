'use client'

import { useState } from 'react'

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
       const month = String(date.getMonth() + 1).padStart(2, "0");
       const day = String(date.getDate()).padStart(2, "0");
       return `${year}-${month}-${day}`;
};
//?location=RsBU&startDate=7/20/2025&endDate=7/27/2025&adult=1&children=1&room=2
const HotelListings = () => {
       // eslint-disable-next-line @typescript-eslint/no-unused-vars
       const [searchParams, _] = useSearchParams();
       const destination_id = searchParams.get("location");
       const numberOfAdults = Number(searchParams.get("adult"));
       const numberOfChildren = Number(searchParams.get("children"));
       const numberOfRooms = Number(searchParams.get("room"));
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
              setCurrentPage(1);
       }, [filters, debouncedSearchTerm, sortOption]);

       useEffect(() => {
              const fetchHotelsByDestination = async () => {
                     setIsLoading(true);
                     try {
                            const response = await fetch(`http://localhost:3000/api/hotels?destination_id=${destination_id}`, {
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
       }, [destination_id]);

       useEffect(() => {
              let isMounted = true;
              let timeoutId: number | undefined;
              const fetchHotelPricesWithPolling = async () => {
                     try {
                            let retries = 0;
                            const maxRetries = 50;
                            const delay = 1500;
                            const guestsParam = Array(numberOfRooms)
                                   .fill(numberOfAdults + numberOfChildren)
                                   .join("|");
                            const queryString = `http://localhost:3000/api/hotels/prices?destination_id=${destination_id}&checkin=${checkIn}&checkout=${checkOut}&lang=en_US&currency=SGD&country_code=SG&guests=${guestsParam}&landing_page=wl-acme-earn&product_type=earn&partner_id=1089`;
                            while (retries < maxRetries) {
                                   const response = await fetch(queryString);
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
                            console.warn("Polling timed out");
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
       }, [checkIn, checkOut, destination_id, numberOfAdults, numberOfChildren, numberOfRooms]);

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
    <>
      <div className='overflow-hidden'>
        <HeaderOne />
        <SliderTwo />
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
                      onChange={handlePriceChange}
                      className='mt-4'
                    />
                    <div className="price-block flex items-center justify-between flex-wrap mt-3">
                      <div className="min flex items-center gap-1">
                        <div>Min price:</div>
                        <div className='price-min text-button'>$
                          <span>{priceRange.min}</span>
                        </div>
                      </div>
                      <div className="max flex items-center gap-1">
                        <div>Max price:</div>
                        <div className='price-max text-button'>$
                          <span>{priceRange.max}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="filter-service mt-7">
                    <div className="heading6">Services</div>
                    <div className="list-service flex flex-col gap-3 mt-3">
                      {['reception desk', 'pet allowed', 'tour guide', 'breakfast', 'currency exchange', 'self-service laundry', 'cooking service', 'relaxation service', 'cleaning service'].map((item, index) => (
                        <div key={index} className="service-item flex items-center justify-between">
                          <div className="left flex items-center cursor-pointer">
                            <div className="block-input">
                              <input
                                type="checkbox"
                                name={item}
                                id={item}
                                checked={service.includes(item)}
                                onChange={() => handleService(item)}
                              />
                              <Icon.CheckSquare size={20} weight='fill' className='icon-checkbox text-primary' />
                            </div>
                            <label htmlFor={item} className="service-name capitalize pl-2 cursor-pointer">{item}</label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="filter-amenities mt-7">
                    <div className="heading6">Amenities</div>
                    <div className="list-amenities flex flex-col gap-3 mt-3">
                      {['parking', 'wifi', 'tv', 'toilet', 'bathtub', 'campfire', 'picnic table', 'trash', 'cooking equipment', 'refrigerator', 'microwave', 'dishwasher', 'coffee maker'].map((item, index) => (
                        <div key={index} className="amenities-item flex items-center justify-between">
                          <div className="left flex items-center cursor-pointer">
                            <div className="block-input">
                              <input
                                type="checkbox"
                                name={item}
                                id={item}
                                checked={amenities.includes(item)}
                                onChange={() => handleAmenities(item)}
                              />
                              <Icon.CheckSquare size={20} weight='fill' className='icon-checkbox text-primary' />
                            </div>
                            <label htmlFor={item} className="amenities-name capitalize pl-2 cursor-pointer">{item}</label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="filter-activities mt-7">
                    <div className="heading6">Activities</div>
                    <div className="list-activities flex flex-col gap-3 mt-3">
                      {['hiking', 'swimming', 'fishing', 'wildlife watching', 'biking', 'boating', 'climbing', 'snow sports', 'horseback riding', 'surfing', 'wind sports'].map((item, index) => (
                        <div key={index} className="activities-item flex items-center justify-between">
                          <div className="left flex items-center cursor-pointer">
                            <div className="block-input">
                              <input
                                type="checkbox"
                                name={item}
                                id={item}
                                checked={activities.includes(item)}
                                onChange={() => handleActivities(item)}
                              />
                              <Icon.CheckSquare size={20} weight='fill' className='icon-checkbox text-primary' />
                            </div>
                            <label htmlFor={item} className="activities-name capitalize pl-2 cursor-pointer">{item}</label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="filter-terrain mt-7">
                    <div className="heading6">Terrain</div>
                    <div className="list-terrain flex flex-col gap-3 mt-3">
                      {['lake', 'beach', 'farm', 'forest', 'river', 'hot spring', 'swimming hole', 'desert', 'cave'].map((item, index) => (
                        <div key={index} className="terrain-item flex items-center justify-between">
                          <div className="left flex items-center cursor-pointer">
                            <div className="block-input">
                              <input
                                type="checkbox"
                                name={item}
                                id={item}
                                checked={terrain.includes(item)}
                                onChange={() => handleTerrain(item)}
                              />
                              <Icon.CheckSquare size={20} weight='fill' className='icon-checkbox text-primary' />
                            </div>
                            <label htmlFor={item} className="terrain-name capitalize pl-2 cursor-pointer">{item}</label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className='right lg:w-3/4 md:w-2/3 md:pl-[15px]'>
                <div className="heading flex items-center justify-between gap-6 flex-wrap">
                  <div className="left flex items-center sm:gap-5 gap-3 max-sm:flex-wrap">
                    <div className="flex items-center gap-3">
                      <div
                        className="md:hidden show-filter-sidebar flex items-center gap-2 sm:px-4 px-3 py-2.5 border border-outline rounded-lg cursor-pointer duration-300 hover:bg-black hover:text-white"
                        onClick={handleOpenSidebar}
                      >
                        <Icon.SlidersHorizontal className='text-xl' />
                        <p>Show Filters</p>
                      </div>
                      <Link to={'/camp/topmap-grid'}>
                        <Icon.SquaresFour className='text-3xl cursor-pointer text-black duration-300' />
                      </Link>
                      <Link to={'/camp/topmap-list'}>
                        <Icon.Rows className='text-3xl cursor-pointer text-variant2 duration-300 hover:text-black' />
                      </Link>
                    </div>
                    <div className="line w-px h-7 bg-outline max-[400px]:hidden"></div>
                    <div className="body2">Showing {filteredData[0].id === 'no-data' ? 0 : offset + 1}-{filteredData[0].id === 'no-data' ? 0 : offset + currentTents.length} of {filteredData[0].id === 'no-data' ? 0 : filteredData.length}</div>
                  </div>
                  <div className="right flex items-center gap-3">
                    <div className="select-block relative">
                      <select
                        id="select-filter"
                        name="select-filter"
                        className='custom-select'
                        onChange={(e) => { handleTentPerPage(Number(e.target.value)) }}
                        defaultValue={'12'}
                      >
                        <option value="8">8 Per Page</option>
                        <option value="9">9 Per Page</option>
                        <option value="12">12 Per Page</option>
                        <option value="15">15 Per Page</option>
                        <option value="16">16 Per Page</option>
                      </select>
                      <Icon.CaretDown className='text-xl absolute top-1/2 -translate-y-1/2 md:right-4 right-2' />
                    </div>
                    <div className="select-block relative" >
                      <select
                        id="select-filter"
                    
                        name="select-filter"
                        className='custom-select'
                        onChange={(e) => { handleSortChange(e.target.value) }}
                        defaultValue={'Sorting'}
                      >
                        <option value="Sorting" disabled>Sort by (Defaut)</option>
                        <option value="starHighToLow">Best Review</option>
                        <option value="priceHighToLow">Price High To Low</option>
                        <option value="priceLowToHigh">Price Low To High</option>
                      </select>
                      <Icon.CaretDown className='text-xl absolute top-1/2 -translate-y-1/2 md:right-4 right-2' />
                    </div>
                  </div>
                </div>

                <div className="list-tent md:mt-10 mt-6 grid lg:grid-cols-3 md:grid-cols-2 min-[360px]:grid-cols-2 lg:gap-[30px] gap-4 gap-y-7">
                  {currentTents.map((item) => (
                    item.id === 'no-data' ? (
                      <div key={item.id} className="no-data-product">No tents match the selected criteria.</div>
                    ) : (
                      <TentItem key={item.id} data={item} type='default' />
                    )
                  ))}
                </div>

                {pageCount > 1 && (
                  <div className="list-pagination flex items-center md:mt-10 mt-7">
                    <HandlePagination pageCount={pageCount} onPageChange={handlePageChange} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`sidebar-filter ${openSidebar ? 'open' : ''}`}
          onClick={handleOpenSidebar}
        >
          <div className="sidebar-main" onClick={(e) => { e.stopPropagation() }}>
            <div className="filter-price">
              <div className="heading6">Price Range</div>
              <Slider
                range
                defaultValue={[0, 500]}
                min={0}
                max={500}
                onChange={handlePriceChange}
                className='mt-4'
              />
              <div className="price-block flex items-center justify-between flex-wrap mt-3">
                <div className="min flex items-center gap-1">
                  <div>Min price:</div>
                  <div className='price-min text-button'>$
                    <span>{priceRange.min}</span>
                  </div>
                </div>
                <div className="max flex items-center gap-1">
                  <div>Max price:</div>
                  <div className='price-max text-button'>$
                    <span>{priceRange.max}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="filter-service mt-7">
              <div className="heading6">Services</div>
              <div className="list-service flex flex-col gap-3 mt-3">
                {['reception desk', 'pet allowed', 'tour guide', 'breakfast', 'currency exchange', 'self-service laundry', 'cooking service', 'relaxation service', 'cleaning service'].map((item, index) => (
                  <div key={index} className="service-item flex items-center justify-between">
                    <div className="left flex items-center cursor-pointer">
                      <div className="block-input">
                        <input
                          type="checkbox"
                          name={item}
                          id={item}
                          checked={service.includes(item)}
                          onChange={() => handleService(item)}
                        />
                        <Icon.CheckSquare size={20} weight='fill' className='icon-checkbox text-primary' />
                      </div>
                      <label htmlFor={item} className="service-name capitalize pl-2 cursor-pointer">{item}</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="filter-amenities mt-7">
              <div className="heading6">Amenities</div>
              <div className="list-amenities flex flex-col gap-3 mt-3">
                {['parking', 'wifi', 'tv', 'toilet', 'bathtub', 'campfire', 'picnic table', 'trash', 'cooking equipment', 'refrigerator', 'microwave', 'dishwasher', 'coffee maker'].map((item, index) => (
                  <div key={index} className="amenities-item flex items-center justify-between">
                    <div className="left flex items-center cursor-pointer">
                      <div className="block-input">
                        <input
                          type="checkbox"
                          name={item}
                          id={item}
                          checked={amenities.includes(item)}
                          onChange={() => handleAmenities(item)}
                        />
                        <Icon.CheckSquare size={20} weight='fill' className='icon-checkbox text-primary' />
                      </div>
                      <label htmlFor={item} className="amenities-name capitalize pl-2 cursor-pointer">{item}</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="filter-activities mt-7">
              <div className="heading6">Activities</div>
              <div className="list-activities flex flex-col gap-3 mt-3">
                {['hiking', 'swimming', 'fishing', 'wildlife watching', 'biking', 'boating', 'climbing', 'snow sports', 'horseback riding', 'surfing', 'wind sports'].map((item, index) => (
                  <div key={index} className="activities-item flex items-center justify-between">
                    <div className="left flex items-center cursor-pointer">
                      <div className="block-input">
                        <input
                          type="checkbox"
                          name={item}
                          id={item}
                          checked={activities.includes(item)}
                          onChange={() => handleActivities(item)}
                        />
                        <Icon.CheckSquare size={20} weight='fill' className='icon-checkbox text-primary' />
                      </div>
                      <label htmlFor={item} className="activities-name capitalize pl-2 cursor-pointer">{item}</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="filter-terrain mt-7">
              <div className="heading6">Terrain</div>
              <div className="list-terrain flex flex-col gap-3 mt-3">
                {['lake', 'beach', 'farm', 'forest', 'river', 'hot spring', 'swimming hole', 'desert', 'cave'].map((item, index) => (
                  <div key={index} className="terrain-item flex items-center justify-between">
                    <div className="left flex items-center cursor-pointer">
                      <div className="block-input">
                        <input
                          type="checkbox"
                          name={item}
                          id={item}
                          checked={terrain.includes(item)}
                          onChange={() => handleTerrain(item)}
                        />
                        <Icon.CheckSquare size={20} weight='fill' className='icon-checkbox text-primary' />
                      </div>
                      <label htmlFor={item} className="terrain-name capitalize pl-2 cursor-pointer">{item}</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

const Listings = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <TopMapSidebarContent />
  </Suspense>
)
export default Listings
