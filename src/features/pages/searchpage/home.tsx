'use client'

import React from 'react'

import HeaderOne from '../../components/Header/HeaderOne'
import SliderOne from '../../components/Slider/SliderOne'
import Footer from '../../components/Footer/Footer'
import Category from '../../components/Category/CategoryOne'
const Home = () => {
  return (
    <>
    
      <div className="page-one ">
        <HeaderOne />
        <SliderOne />
        <Category />
        <Footer />

      </div>
    </>
  )
}

export default Home