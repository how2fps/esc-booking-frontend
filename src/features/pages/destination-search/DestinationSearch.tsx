"use client";

import Footer from "../../components/Footer/Footer";
import HeaderOne from "../../components/Header/Header";
import SliderOne from "../../components/Slider/Slider";
const DestinationSearch = () => {
       return (
              <>
                     <div className="page-one ">
                            <HeaderOne />
                            <SliderOne />
                            {/* <RecommendOne
                                   data={Hotels}
                                   start={0}
                                   end={8}
                            /> */}
                            <Footer />
                     </div>
              </>
       );
};

export default DestinationSearch;
