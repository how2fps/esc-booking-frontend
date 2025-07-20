import * as Icon from "phosphor-react";
import "rc-slider/assets/index.css";

type FilterCheckboxProps = {
       header: string;
       options: string[];
};

export const FilterCheckbox = ({ header, options }: FilterCheckboxProps) => {
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
                                                               checked={true}
                                                               onChange={() => {}}
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
