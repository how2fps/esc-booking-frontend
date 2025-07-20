"use client";

import Footer from "../../components/Footer/Footer";
import HeaderOne from "../../components/Header/Header";
import RecommendOne from "../../components/Recommend/RecommendOne";
import SliderOne from "../../components/Slider/Slider";
import Hotels from "../../components/data/hotels.json";
const DestinationSearch = () => {
       return (
              <>
                     <div className="page-one ">
                            <HeaderOne />
                            <SliderOne />
                            <RecommendOne
                                   data={Hotels}
                                   start={0}
                                   end={8}
                            />
                            <Footer />
                     </div>
              </>
       );
};

export default DestinationSearch;
