'use client'

import React, { useState } from 'react'
import HeaderThree from '@/components/Header/HeaderThree'
import Footer from '@/components/Footer/Footer'
import * as Icon from 'phosphor-react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import tentData from '@/data/Tent.json'
import TentItem from '@/components/Tent/TentItem'
import { motion } from 'framer-motion'
import dynamic from "next/dynamic"
const MapComponent = dynamic(() => import("@/components/Other/MapComponent"), { ssr: false })

const HomeThree = () => {
  const [activeCategory, setActiveCategory] = useState<string>('cabin')
  let filterData = tentData

  const handleCategory = (category: string) => {
    setActiveCategory(category)
  }

  filterData = tentData.filter(item => item.category === activeCategory).slice(0, 8)

  return (
    <>
      <div className='overflow-hidden'>
        <HeaderThree />
        <div className="category-block overflow-hidden min-[1322px]:px-10 px-4 border-b border-outline">
          <div className="list-cate style-navigation style-three">
            <div className="custom-swiper-button-prev">
              <Icon.CaretLeft className='text-xl' />
            </div>
            <Swiper
              spaceBetween={12}
              slidesPerView={2}
              navigation={{
                nextEl: '.custom-swiper-button-next',
                prevEl: '.custom-swiper-button-prev',
              }}
              loop={true}
              modules={[Navigation, Autoplay]}
              breakpoints={{
                340: {
                  slidesPerView: 3,
                  spaceBetween: 12,
                },
                576: {
                  slidesPerView: 4,
                  spaceBetween: 12,
                },
                640: {
                  slidesPerView: 5,
                  spaceBetween: 12,
                },
                768: {
                  slidesPerView: 6,
                  spaceBetween: 12,
                },
                900: {
                  slidesPerView: 7,
                  spaceBetween: 12,
                },
                1024: {
                  slidesPerView: 8,
                  spaceBetween: 20,
                },
                1180: {
                  slidesPerView: 9,
                  spaceBetween: 20,
                },
                1290: {
                  slidesPerView: 10,
                  spaceBetween: 0,
                },
                1400: {
                  slidesPerView: 11,
                  spaceBetween: 0,
                },
                1600: {
                  slidesPerView: 12,
                  spaceBetween: 0,
                },
              }}
              className='h-full'
            >
              <SwiperSlide>
                <div
                  className={`item flex flex-col items-center rounded-xl duration-300 cursor-pointer relative ${activeCategory === 'cabin' ? 'active' : ''}`}
                  onClick={() => handleCategory('cabin')}
                >
                  <span className='icon-cabin text-4xl text-variant1 duration-300'></span>
                  <div className="text-title text-variant1 whitespace-nowrap duration-300 mt-2">Cabin</div>
                  {activeCategory === 'cabin' && (
                    <motion.div layoutId='active-pill' className='absolute top-auto left-0 md:-bottom-6 bottom-[-16px] w-full h-0.5 inset-0 bg-primary'></motion.div>
                  )}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div
                  className={`item flex flex-col items-center rounded-xl duration-300 cursor-pointer relative ${activeCategory === 'tented cabins' ? 'active' : ''}`}
                  onClick={() => handleCategory('tented cabins')}
                >
                  <span className='icon-tented-cabin text-4xl text-variant1 duration-300'></span>
                  <div className="text-title text-variant1 whitespace-nowrap duration-300 mt-2">Tented Cabins</div>
                  {activeCategory === 'tented cabins' && (
                    <motion.div layoutId='active-pill' className='absolute top-auto left-0 md:-bottom-6 bottom-[-16px] w-full h-0.5 inset-0 bg-primary'></motion.div>
                  )}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div
                  className={`item flex flex-col items-center rounded-xl duration-300 cursor-pointer relative ${activeCategory === 'safari tents' ? 'active' : ''}`}
                  onClick={() => handleCategory('safari tents')}
                >
                  <span className='icon-safari-tent text-4xl text-variant1 duration-300'></span>
                  <div className="text-title text-variant1 whitespace-nowrap duration-300 mt-2">Safari Tents</div>
                  {activeCategory === 'safari tents' && (
                    <motion.div layoutId='active-pill' className='absolute top-auto left-0 md:-bottom-6 bottom-[-16px] w-full h-0.5 inset-0 bg-primary'></motion.div>
                  )}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div
                  className={`item flex flex-col items-center rounded-xl duration-300 cursor-pointer relative ${activeCategory === 'cottages' ? 'active' : ''}`}
                  onClick={() => handleCategory('cottages')}
                >
                  <span className='icon-cottages text-4xl text-variant1 duration-300'></span>
                  <div className="text-title text-variant1 whitespace-nowrap duration-300 mt-2">Cottages</div>
                  {activeCategory === 'cottages' && (
                    <motion.div layoutId='active-pill' className='absolute top-auto left-0 md:-bottom-6 bottom-[-16px] w-full h-0.5 inset-0 bg-primary'></motion.div>
                  )}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div
                  className={`item flex flex-col items-center rounded-xl duration-300 cursor-pointer relative ${activeCategory === 'tiny houses' ? 'active' : ''}`}
                  onClick={() => handleCategory('tiny houses')}
                >
                  <span className='icon-tiny-house text-4xl text-variant1 duration-300'></span>
                  <div className="text-title text-variant1 whitespace-nowrap duration-300 mt-2">Tiny Houses</div>
                  {activeCategory === 'tiny houses' && (
                    <motion.div layoutId='active-pill' className='absolute top-auto left-0 md:-bottom-6 bottom-[-16px] w-full h-0.5 inset-0 bg-primary'></motion.div>
                  )}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div
                  className={`item flex flex-col items-center rounded-xl duration-300 cursor-pointer relative ${activeCategory === 'caravans' ? 'active' : ''}`}
                  onClick={() => handleCategory('caravans')}
                >
                  <span className='icon-cravan text-4xl text-variant1 duration-300'></span>
                  <div className="text-title text-variant1 whitespace-nowrap duration-300 mt-2">Caravans</div>
                  {activeCategory === 'caravans' && (
                    <motion.div layoutId='active-pill' className='absolute top-auto left-0 md:-bottom-6 bottom-[-16px] w-full h-0.5 inset-0 bg-primary'></motion.div>
                  )}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div
                  className={`item flex flex-col items-center rounded-xl duration-300 cursor-pointer relative ${activeCategory === 'domes' ? 'active' : ''}`}
                  onClick={() => handleCategory('domes')}
                >
                  <span className='icon-domes text-4xl text-variant1 duration-300'></span>
                  <div className="text-title text-variant1 whitespace-nowrap duration-300 mt-2">Domes</div>
                  {activeCategory === 'domes' && (
                    <motion.div layoutId='active-pill' className='absolute top-auto left-0 md:-bottom-6 bottom-[-16px] w-full h-0.5 inset-0 bg-primary'></motion.div>
                  )}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div
                  className={`item flex flex-col items-center rounded-xl duration-300 cursor-pointer relative ${activeCategory === 'log cabins' ? 'active' : ''}`}
                  onClick={() => handleCategory('log cabins')}
                >
                  <span className='icon-log-cabin text-4xl text-variant1 duration-300'></span>
                  <div className="text-title text-variant1 whitespace-nowrap duration-300 mt-2">Log Cabins</div>
                  {activeCategory === 'log cabins' && (
                    <motion.div layoutId='active-pill' className='absolute top-auto left-0 md:-bottom-6 bottom-[-16px] w-full h-0.5 inset-0 bg-primary'></motion.div>
                  )}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div
                  className={`item flex flex-col items-center rounded-xl duration-300 cursor-pointer relative ${activeCategory === 'yurts' ? 'active' : ''}`}
                  onClick={() => handleCategory('yurts')}
                >
                  <span className='icon-yurt text-4xl text-variant1 duration-300'></span>
                  <div className="text-title text-variant1 whitespace-nowrap duration-300 mt-2">Yurts</div>
                  {activeCategory === 'yurts' && (
                    <motion.div layoutId='active-pill' className='absolute top-auto left-0 md:-bottom-6 bottom-[-16px] w-full h-0.5 inset-0 bg-primary'></motion.div>
                  )}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div
                  className={`item flex flex-col items-center rounded-xl duration-300 cursor-pointer relative ${activeCategory === 'bell tents' ? 'active' : ''}`}
                  onClick={() => handleCategory('bell tents')}
                >
                  <span className='icon-bell-tent text-4xl text-variant1 duration-300'></span>
                  <div className="text-title text-variant1 whitespace-nowrap duration-300 mt-2">Bell Tents</div>
                  {activeCategory === 'bell tents' && (
                    <motion.div layoutId='active-pill' className='absolute top-auto left-0 md:-bottom-6 bottom-[-16px] w-full h-0.5 inset-0 bg-primary'></motion.div>
                  )}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div
                  className={`item flex flex-col items-center rounded-xl duration-300 cursor-pointer relative ${activeCategory === 'tree houses' ? 'active' : ''}`}
                  onClick={() => handleCategory('tree houses')}
                >
                  <span className='icon-cottages text-4xl text-variant1 duration-300'></span>
                  <div className="text-title text-variant1 whitespace-nowrap duration-300 mt-2">Tree Houses</div>
                  {activeCategory === 'tree houses' && (
                    <motion.div layoutId='active-pill' className='absolute top-auto left-0 md:-bottom-6 bottom-[-16px] w-full h-0.5 inset-0 bg-primary'></motion.div>
                  )}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div
                  className={`item flex flex-col items-center rounded-xl duration-300 cursor-pointer relative ${activeCategory === 'containers' ? 'active' : ''}`}
                  onClick={() => handleCategory('containers')}
                >
                  <span className='icon-container text-4xl text-variant1 duration-300'></span>
                  <div className="text-title text-variant1 whitespace-nowrap duration-300 mt-2">Containers</div>
                  {activeCategory === 'containers' && (
                    <motion.div layoutId='active-pill' className='absolute top-auto left-0 md:-bottom-6 bottom-[-16px] w-full h-0.5 inset-0 bg-primary'></motion.div>
                  )}
                </div>
              </SwiperSlide>
            </Swiper>
            <div className="custom-swiper-button-next">
              <Icon.CaretRight className='text-xl' />
            </div>
          </div>
        </div>
        <div className="list-tent-block flex md:h-[716px] h-auto max-md:flex-wrap max-md:flex-col-reverse overflow-hidden max-md:pb-10">
          <div className="left md:basis-7/12 min-[1322px]:px-10 px-4 py-6 max-h-[716px] overflow-x-auto flex-shrink-0">
            <div className="heading4">Discovery Luxury Camping Near You</div>
            <div className="list-tent grid xl:grid-cols-3 grid-cols-2 lg:gap-[30px] gap-4 mt-5">
              {filterData.map(item => (
                <TentItem key={item.id} data={item} type='default' />
              ))}
            </div>
          </div>
          <div className="right md:basis-5/12 md:h-full sm:h-[500px] h-[350px]">
            <MapComponent />
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default HomeThree
