'use client'

import React from 'react'

import HeaderOne from '../../components/Header/HeaderOne'
import SliderOne from '../../components/Slider/SliderOne'
import CategoryOne from '../../components/Category/CategoryOne'
import Footer from '../../components/Footer/Footer'

const Home = () => {
  return (
    <>
    
      <div className="page-one ">
        <HeaderOne />
        <SliderOne />
        <CategoryOne />
        <Footer />
      </div>
    </>
  )
}

export default Home
