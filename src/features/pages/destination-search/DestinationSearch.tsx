'use client'

import Category from '../../components/Category/Category'
import Footer from '../../components/Footer/Footer'
import HeaderOne from '../../components/Header/Header'
import SliderOne from '../../components/Slider/Slider'
const DestinationSearch = () => {
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

export default DestinationSearch;