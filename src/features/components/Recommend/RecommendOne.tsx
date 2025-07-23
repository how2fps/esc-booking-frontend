import React from "react";
import type { HotelType } from "../../type/HotelType";
import HotelItem from "../HotelItem/HotelItem";
import TextHeading from "../TextHeading/TextHeading";

interface Props {
       data: Array<HotelType>;
       start: number;
       end: number;
}

const RecommendOne: React.FC<Props> = ({ data, start, end }) => {
       return (
              <div className="recommend-block lg:pt-20 md:pt-14 pt-10">
                     <div className="container">
                            <TextHeading
                                   title="Discovery Luxury Hotel Near You"
                                   subTitle="Recommended For You"
                            />
                            <div className="list-cate grid lg:grid-cols-4 md:grid-cols-3 min-[360px]:grid-cols-2 lg:gap-[30px] gap-4 gap-y-7 md:mt-10 mt-6">
                                   {data.slice(start, end).map((item) => (
                                          <HotelItem
                                                 key={item.id}
                                                 data={item}
                                                 type="default"
                                          />
                                   ))}
                            </div>
                     </div>
              </div>
       );
};

export default RecommendOne;
