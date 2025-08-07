import * as Icon from "phosphor-react";
import { useEffect, useState } from "react";

export const SortSelector: React.FC<{
       setSortOption: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setSortOption }) => {
       const [tempSortOption, setTempSortOption] = useState("starHighToLow");
       useEffect(() => {
              setSortOption(tempSortOption);
       }, [tempSortOption, setSortOption]);
       return (
              <div className="flex items-center gap-2">
                     <label
                            htmlFor="sort"
                            className="font-medium text-gray-700">
                            Sort By:
                     </label>
                     <div className="relative">
                            <select
                                   id="sort"
                                   name="select-filter"
                                   className="h-12 bg-white text-black pr-8 cursor-pointer p-2"
                                   onChange={(e) => {
                                          setTempSortOption(e.target.value);
                                   }}
                                   value={tempSortOption}>
                                   <option value="starHighToLow">Stars Descending</option>
                                   <option value="starLowToHigh">Stars Ascending</option>
                                   <option value="priceHighToLow">Price Descending</option>
                                   <option value="priceLowToHigh">Price Ascending</option>
                                   <option value="ratingHighToLow">Rating Descending</option>
                                   <option value="ratingLowToHigh">Rating Ascending</option>
                            </select>
                            <Icon.CaretDown className="absolute top-1/2 -translate-y-1/2 right-2 pointer-events-none text-gray-500" />
                     </div>
              </div>
       );
};
