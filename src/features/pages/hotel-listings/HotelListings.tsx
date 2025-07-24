'use client'

import { useState } from 'react'

import * as Icon from 'phosphor-react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { Suspense } from 'react'
import { useSearchParams } from "react-router"
import Footer from '../../components/Footer/Footer'
import HeaderOne from '../../components/Header/Header'
import HandlePagination from '../../components/Other/HandlePagination'
import SliderTwo from '../../components/Slider/Slider'

import HotelItem from '../../components/Tent/HotelItem'
import Hotels from "../../components/data/hotels.json" 
import type { HotelType } from '../../type/HotelType'




type Amenities = string;

function getParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  return searchParams;
}
const TopMapSidebarContent = () => {
  const params = getParams()
  const categoryParams = params.get('category')
  const countryParams = params.get('country')
  const [openSidebar, setOpenSidebar] = useState(false)
  const [sortOption, setSortOption] = useState('')
  const [displayOption, setDisplayOption] = useState('default')
  const [amenities, setAmenities] = useState<Amenities[]>([])
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 500 });
  const [ratingRange, setRatingRange] = useState<{ min: number; max: number }>({ min: 0, max: 5.0 });
  const [currentPage, setCurrentPage] = useState(0);
  const [tentPerPage, setHotelPerPage] = useState<number>(12);
  const tentsPerPage = tentPerPage;
  const offset = currentPage * tentsPerPage;

  const handleOpenSidebar = () => {
    setOpenSidebar(!openSidebar)
  }

  const handleHotelPerPage = (page: number) => {
    setHotelPerPage(page);
    setCurrentPage(0);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    setCurrentPage(0);
  };

  const handlePriceChange = (values: number | number[]) => {
    if (Array.isArray(values)) {
      setPriceRange({ min: values[0], max: values[1] });
      setCurrentPage(0);
    }
  };

  const handleRatingChange = (values: number | number[]) => {
    if (Array.isArray(values)) {
      setRatingRange({ min: values[0], max: values[1] });
      setCurrentPage(0);
    }
  };

  const handleAmenities = (item: Amenities) => {
    const isSelected = amenities.includes(item);

    if (isSelected) {
      setAmenities(amenities.filter((amenities) => amenities !== item));
    } else {
      setAmenities([...amenities, item]);
    }
    setCurrentPage(0);
  };



  let filteredData = Hotels.filter(Hotel => {
    let isDataCategoryMatch = true;
    if (categoryParams) {
      isDataCategoryMatch = Hotel.categories.toLowerCase() === categoryParams.toLowerCase()
    }



    let isDataCountryMatch = true;
    if (countryParams) {
      isDataCountryMatch = Hotel.id.toLowerCase() === countryParams.toLowerCase()
    }

    let isPriceRangeMatched = true;
    if (priceRange.min !== 0 || priceRange.max !== 500) {
      isPriceRangeMatched = Hotel.price >= priceRange.min && Hotel.price <= priceRange.max;
    }
     let isRatingRangeMatched = true;
    if (ratingRange.min !== 0 || ratingRange.max !== 5) {
      isRatingRangeMatched = Hotel.rating >= ratingRange.min && Hotel.rating <= ratingRange.max;
    }


  
    let isDataAmenitiesMatched = true;
    if (amenities.length > 0) {
      isDataAmenitiesMatched = amenities.every(item => Hotel.amenities.includes(item))
    }

    return isDataCategoryMatch && isDataCountryMatch  && isDataAmenitiesMatched &&isRatingRangeMatched
  })


  let sortedData = [...filteredData];

  if (sortOption === 'starHighToLow') {
    filteredData = sortedData.sort((a, b) => b.rating - a.rating)
  }

  if (sortOption === 'priceHighToLow') {
    filteredData = sortedData.sort((a, b) => b.price - a.price)
  }

  if (sortOption === 'priceLowToHigh') {
    filteredData = sortedData.sort((a, b) => a.price - b.price)
  }

  if (filteredData.length === 0) {
    filteredData = [{
      id: 'no-data',
      category: 'no-data',
      name: 'no-data',
      continents: 'no-data',
      country: 'no-data',
      location: 'no-data',
      locationMap: {
        lat: 0,
        lng: 0
      },
      rate: 0,
      price: 0,
      listImage: [],
      image: 'no-data',
      shortDesc: 'no-data',
      description: 'no-data',
      amenities: [],
    }];
  }


  const pageCount = Math.ceil(filteredData.length / tentsPerPage);

  if (pageCount === 0) {
    setCurrentPage(0);
  }

  let currentHotels: HotelType[];


  if (filteredData.length > 0) {
    currentHotels = filteredData.slice(offset, offset + tentsPerPage);
  } else {
    currentHotels = []
  }
  

  const handlePageChange = (selected: number) => {
    setCurrentPage(selected);
  };


 const handleDisplayChange = (selected: string) => {
    setDisplayOption(selected);
  };



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

                  <div className="filter-price">
                    <div className="heading6">Rating Range</div>
                    <Slider
                      range
                      defaultValue={[0, 5.0]}
                      min={0}
                      max={5}
                      onChange={handleRatingChange}
                      className='mt-4'
                    />
                    <div className="price-block flex items-center justify-between flex-wrap mt-3">
                      <div className="min flex items-center gap-1">
                        <div>Min rating:</div>
                        <div className='price-min text-button'>
                          <span>{ratingRange.min}</span>
                        </div>
                      </div>
                      <div className="max flex items-center gap-1">
                        <div>Max rating:</div>
                        <div className='price-max text-button'>
                          <span>{ratingRange.max}</span>
                        </div>
                      </div>
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
                     
                        <Icon.SquaresFour className='text-3xl cursor-pointer text-black duration-300' onClick={() => handleDisplayChange("default")}  />

                        <Icon.Rows className='text-3xl cursor-pointer text-variant2 duration-300 hover:text-black' onClick={() => handleDisplayChange("list")}  />
                  
                    </div>
                    <div className="line w-px h-7 bg-outline max-[400px]:hidden"></div>
                    <div className="body2">Showing {filteredData[0].id === 'no-data' ? 0 : offset + 1}-{filteredData[0].id === 'no-data' ? 0 : offset + currentHotels.length} of {filteredData[0].id === 'no-data' ? 0 : filteredData.length}</div>
                  </div>
                  <div className="right flex items-center gap-3">
                    <div className="select-block relative">
                      <select
                        id="select-filter"
                        name="select-filter"
                        className='custom-select'
                        onChange={(e) => { handleHotelPerPage(Number(e.target.value)) }}
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
              <div className="content-container min-h-[1500px] flex flex-col justify-between">
                
                <div className={`list-Hotel md:mt-10 mt-6 
                ${displayOption === 'default' 
                    ? 'grid lg:grid-cols-3 md:grid-cols-2 min-[360px]:grid-cols-2 lg:gap-[30px] gap-4 gap-y-7' 
                    : 'flex flex-col gap-6'}`}>
                  {currentHotels.map((item) => (
                    item.id === 'no-data' ? (
                      <div key={item.id} className="no-data-product">No hotel match the selected criteria.</div>
                    ) : (
                      <HotelItem key={item.id} data={item} type= {displayOption} />
                    )
                  ))}
                </div>
                
                <div className="list-pagination flex md:mt-11 mt-7">
                  <HandlePagination pageCount={pageCount} onPageChange={handlePageChange} />
                </div>
              </div>
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
