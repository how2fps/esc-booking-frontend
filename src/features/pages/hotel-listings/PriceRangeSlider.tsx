import Slider from "rc-slider";
import { useState } from "react";

export const PriceRangeSlider: React.FC<{
       setPriceFilter: React.Dispatch<React.SetStateAction<{ min: number; max: number }>>;
}> = ({ setPriceFilter }) => {
       const [priceSliderValue, setPriceSliderValue] = useState<[number, number]>([0, 10000]);
       return (
              <div className="mb-8">
                     <div className="font-semibold text-gray-800 mb-2 flex justify-left">
                            Price Range: ${priceSliderValue[0]} – ${priceSliderValue[1]}
                     </div>
                     <Slider
                            data-testid="price-slider"
                            range
                            value={priceSliderValue}
                            min={0}
                            max={10000}
                            onChange={(value) => {
                                   if (Array.isArray(value)) {
                                          setPriceSliderValue(value as [number, number]);
                                   }
                            }}
                            onChangeComplete={(value) => {
                                   if (Array.isArray(value) && value.length === 2) {
                                          setPriceFilter({ min: value[0], max: value[1] });
                                   }
                            }}
                     />
              </div>
       );
};
