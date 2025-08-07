import Slider from "rc-slider";
import { useState } from "react";

export const HotelRatingSlider: React.FC<{
       setHotelRatingFilter: React.Dispatch<React.SetStateAction<number>>;
}> = ({ setHotelRatingFilter }) => {
       const [hotelRatingSliderValue, setHotelRatingSliderValue] = useState<number>(0);

       return (
              <div className="mb-7">
                     <div className="font-semibold text-gray-800 mb-2 flex justify-left">Minimum Rating: {hotelRatingSliderValue}</div>
                     <Slider
                            value={hotelRatingSliderValue}
                            min={0}
                            max={100}
                            step={1}
                            onChange={(value) => {
                                   if (typeof value === "number") {
                                          setHotelRatingSliderValue(value);
                                   }
                            }}
                            onChangeComplete={(value) => {
                                   if (typeof value === "number") {
                                          setHotelRatingFilter(value);
                                   }
                            }}
                     />
              </div>
       );
};
