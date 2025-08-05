import * as Icon from "phosphor-react";
import "rc-slider/assets/index.css";
import React, { useCallback, useEffect, useState } from "react";
import type { HotelFilter } from "../../type/HotelType";

type FilterCheckboxProps = {
       setFilters: React.Dispatch<React.SetStateAction<HotelFilter>>;
};

type AmenityOption = { key: string; label: string };

const AmenityCheckbox = React.memo(({ amenity, checked, onChange }: { amenity: AmenityOption; checked: boolean; onChange: (key: string) => void }) => {
       return (
              <div className="amenities-item flex items-center justify-between">
                     <div className="left flex items-center cursor-pointer">
                            <div className="block-input">
                                   <input
                                          type="checkbox"
                                          name={amenity.key}
                                          id={amenity.key}
                                          checked={checked}
                                          onChange={() => onChange(amenity.key)}
                                   />
                                   <Icon.CheckSquare
                                          size={20}
                                          weight="fill"
                                          className="icon-checkbox text-primary"
                                   />
                            </div>
                            <label
                                   htmlFor={amenity.key}
                                   className="amenities-name pl-2 cursor-pointer">
                                   {amenity.label}
                            </label>
                     </div>
              </div>
       );
});

export const AmenityFilter = React.memo(({ setFilters }: FilterCheckboxProps) => {
       const [selectedOptionsSet, setSelectedOptionsSet] = useState<Set<string>>(new Set());

       const handleCheckboxChange = useCallback((option: string) => {
              setSelectedOptionsSet((prev) => {
                     const newSet = new Set(prev);
                     if (newSet.has(option)) {
                            newSet.delete(option);
                     } else {
                            newSet.add(option);
                     }
                     return newSet;
              });
       }, []);

       useEffect(() => {
              setFilters((prev) => ({ ...prev, amenities: selectedOptionsSet })); // low-priority
       }, [selectedOptionsSet, setFilters]);

       const amenityOptions: AmenityOption[] = [
              { key: "dryCleaning", label: "Dry Cleaning" },
              { key: "outdoorPool", label: "Outdoor Pool" },
              { key: "continentalBreakfast", label: "Continental Breakfast" },
              { key: "parkingGarage", label: "Parking Garage" },
              { key: "fitnessFacility", label: "Fitness Facility" },
              { key: "inHouseDining", label: "In-House Dining" },
              { key: "inHouseBar", label: "In-House Bar" },
       ];

       return (
              <div className="border-2 border-black rounded-[12px] p-4 mt-8">
                     <div className="heading6">Amenities</div>
                     <div className="list-amenities flex flex-col gap-3 mt-3">
                            {amenityOptions.map((amenity) => (
                                   <AmenityCheckbox
                                          key={amenity.key}
                                          amenity={amenity}
                                          checked={selectedOptionsSet.has(amenity.key)}
                                          onChange={handleCheckboxChange}
                                   />
                            ))}
                     </div>
              </div>
       );
});
