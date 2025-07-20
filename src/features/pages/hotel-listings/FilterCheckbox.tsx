import * as Icon from "phosphor-react";
import "rc-slider/assets/index.css";
import { useState } from "react";
type Amenity = string;
type PriceRange = { min: number; max: number };

interface Hotel {
       id: string;
       name: string;
       address: string;
       amenities: Set<Amenity>;
       priceRange: PriceRange;
}

type FilterCheckboxProps = {
       header: string;
       options: string[];
       setFilters: React.Dispatch<React.SetStateAction<Hotel>>;
};

export const FilterCheckbox = ({ header, options, setFilters }: FilterCheckboxProps) => {
       const [selectedOptionsSet, setSelectedOptionsSet] = useState<Set<string>>(new Set());
       const handleCheckboxChange = (option: string) => {
              const newSet = new Set(selectedOptionsSet);
              if (newSet.has(option)) {
                     newSet.delete(option);
              } else {
                     newSet.add(option);
              }
              setSelectedOptionsSet(newSet);
              setFilters((prev) => {
                     return { ...prev, amenities: newSet };
              });
       };

       return (
              <div className="filter-amenities mt-7">
                     <div className="heading6">{header}</div>
                     <div className="list-amenities flex flex-col gap-3 mt-3">
                            {options.map((option, index) => (
                                   <div
                                          key={index}
                                          className="amenities-item flex items-center justify-between">
                                          <div className="left flex items-center cursor-pointer">
                                                 <div className="block-input">
                                                        <input
                                                               type="checkbox"
                                                               name={option}
                                                               id={option}
                                                               checked={selectedOptionsSet.has(option)}
                                                               onChange={() => handleCheckboxChange(option)}
                                                        />
                                                        <Icon.CheckSquare
                                                               size={20}
                                                               weight="fill"
                                                               className="icon-checkbox text-primary"
                                                        />
                                                 </div>
                                                 <label
                                                        htmlFor={option}
                                                        className="amenities-name capitalize pl-2 cursor-pointer">
                                                        {option}
                                                 </label>
                                          </div>
                                   </div>
                            ))}
                     </div>
              </div>
       );
};
