'use client'

import React from 'react'

import HeaderOne from '../../components/Header/Header'
import SliderOne from '../../components/Slider/Slider'
import Footer from '../../components/Footer/Footer'
import Category from '../../components/Category/Category'
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