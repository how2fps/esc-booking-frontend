'use client'

import React from 'react'
import HeaderOne from '@/components/Header/HeaderOne'
import SliderOne from '@/components/Slider/SliderOne'
import LocationOne from '@/components/Location/LocationOne'
import CategoryOne from '@/components/Category/CategoryOne'
import RecommendOne from '@/components/Recommend/RecommendOne'
import tentData from '@/data/Tent.json'
import BecomeHost from '@/components/BecomeHost/BecomeHost'
import Amenities from '@/components/Amenities/Amenities'
import Testimonial from '@/components/Testimonial/Testimonial'
import dataTestimonial from '@/data/Testimonial.json'
import News from '@/components/News/News'
import Footer from '@/components/Footer/Footer'

const Home = () => {
  return (
    <>
      <div className="page-one overflow-x-hidden">
        <HeaderOne />
        <SliderOne />
        <LocationOne />
        <CategoryOne />
        <RecommendOne data={tentData} start={10} end={18} />
        <BecomeHost />
        <Amenities />
        <Testimonial data={dataTestimonial} />
        <News />
        <Footer />
      </div>
    </>
  )
}

export default Home
