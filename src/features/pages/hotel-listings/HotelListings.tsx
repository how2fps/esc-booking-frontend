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
import TentItem from '../../components/Tent/TentItem'
import tentData from '../../components/data/Tent.json'
import type { TentType } from '../../type/TentType'

import { Link } from "react-router-dom"


type Service = string;
type Amenities = string;
type Activities = string;
type Terrain = string;
function getParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  return searchParams;
}
const TopMapSidebarContent = () => {
  const params = getParams()
  const categoryParams = params.get('category')
  const continentsParams = params.get('continents')
  const countryParams = params.get('country')
  const [openSidebar, setOpenSidebar] = useState(false)
  const [sortOption, setSortOption] = useState('');
  const [service, setService] = useState<Service[]>([])
  const [amenities, setAmenities] = useState<Amenities[]>([])
  const [activities, setActivities] = useState<Activities[]>([])
  const [terrain, setTerrain] = useState<Terrain[]>([])
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 500 });
  const [currentPage, setCurrentPage] = useState(0);
  const [tentPerPage, setTentPerPage] = useState<number>(12);
  const tentsPerPage = tentPerPage;
  const offset = currentPage * tentsPerPage;

  const handleOpenSidebar = () => {
    setOpenSidebar(!openSidebar)
  }

  const handleTentPerPage = (page: number) => {
    setTentPerPage(page);
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

  const handleService = (item: Service) => {
    const isSelected = service.includes(item);

    if (isSelected) {
      setService(service.filter((service) => service !== item));
    } else {
      setService([...service, item]);
    }
    setCurrentPage(0);
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

  const handleActivities = (item: Activities) => {
    const isSelected = activities.includes(item);

    if (isSelected) {
      setActivities(activities.filter((activities) => activities !== item));
    } else {
      setActivities([...activities, item]);
    }
    setCurrentPage(0);
  };

  const handleTerrain = (item: Terrain) => {
    // check terrain selected
    const isSelected = terrain.includes(item);

    if (isSelected) {
      setTerrain(terrain.filter((terrain) => terrain !== item));
    } else {
      setTerrain([...terrain, item]);
    }
    setCurrentPage(0);
  };

  let filteredData = tentData.filter(tent => {
    let isDataCategoryMatch = true;
    if (categoryParams) {
      isDataCategoryMatch = tent.category.toLowerCase() === categoryParams.toLowerCase()
    }

    let isDataContinentsMatch = true;
    if (continentsParams) {
      isDataContinentsMatch = tent.continents.toLowerCase() === continentsParams.toLowerCase()
    }

    let isDataCountryMatch = true;
    if (countryParams) {
      isDataCountryMatch = tent.country.toLowerCase() === countryParams.toLowerCase()
    }

    let isPriceRangeMatched = true;
    if (priceRange.min !== 0 || priceRange.max !== 500) {
      isPriceRangeMatched = tent.price >= priceRange.min && tent.price <= priceRange.max;
    }

    let isDataServiceMatched = true;
    if (service.length > 0) {
      isDataServiceMatched = service.every(item => tent.services.includes(item))
    }

    let isDataAmenitiesMatched = true;
    if (amenities.length > 0) {
      isDataAmenitiesMatched = amenities.every(item => tent.amenities.includes(item))
    }

    let isDataActivitiesMatched = true;
    if (activities.length > 0) {
      isDataActivitiesMatched = activities.every(item => tent.activities.includes(item))
    }

    let isDataTerrainMatched = true;
    if (terrain.length > 0) {
      isDataTerrainMatched = terrain.every(item => tent.terrain.includes(item))
    }

    return isDataCategoryMatch && isDataContinentsMatch && isDataCountryMatch && isPriceRangeMatched && isDataServiceMatched && isDataAmenitiesMatched && isDataActivitiesMatched && isDataTerrainMatched
  })


  let sortedData = [...filteredData];

  if (sortOption === 'starHighToLow') {
    filteredData = sortedData.sort((a, b) => b.rate - a.rate)
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
      services: [],
      amenities: [],
      activities: [],
      terrain: [],
    }];
  }


  // Find page number base on filteredData
  const pageCount = Math.ceil(filteredData.length / tentsPerPage);

  // If page number 0, set current page = 0
  if (pageCount === 0) {
    setCurrentPage(0);
  }

  // Get tent data for current page
  let currentTents: TentType[];

  if (filteredData.length > 0) {
    currentTents = filteredData.slice(offset, offset + tentsPerPage);
  } else {
    currentTents = []
  }

  const handlePageChange = (selected: number) => {
    setCurrentPage(selected);
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
