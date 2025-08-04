"use client";

import SliderOne from "../../components/Slider/Slider";

import RecommendOne from "../../components/Recommend/RecommendOne";


const desID = ["RsBU","fRZM","vJh2","jiHz","AqIc","FkG9"]
const desName = ["Singapore", "Tokyo, Japan", "Paris, France", "New York, USA","Venice, Italy","Barcelona, Spain"]
const DestinationSearch = () => {
       return (
              <>
                     <div className="page-one ">
                            <SliderOne />
                             <RecommendOne
                                   IDs={desID}
                                   names = {desName}
                                   start={0}
                                   end={8}
                            /> 
                     </div>
              </>
       );
};

export default DestinationSearch;
