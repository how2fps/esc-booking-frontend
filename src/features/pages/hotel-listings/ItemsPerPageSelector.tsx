import * as Icon from "phosphor-react";
import { useEffect, useState } from "react";

export const ItemsPerPageSelector: React.FC<{
       setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
       setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}> = ({ setItemsPerPage, setCurrentPage }) => {
       const [tempItemsPerPage, setTempItemsPerPage] = useState(8);
       useEffect(() => {
              setItemsPerPage(tempItemsPerPage);
       }, [tempItemsPerPage, setItemsPerPage]);
       return (
              <div className="flex items-center gap-2">
                     <label
                            htmlFor="items-per-page"
                            className="font-medium text-gray-700">
                            Items Per Page:
                     </label>
                     <div className="relative p-">
                            <select
                                   id="items-per-page"
                                   name="select-filter"
                                   className="h-12 bg-white text-black pr-8 cursor-pointer p-2"
                                   onChange={(e) => {
                                          setTempItemsPerPage(Number.parseInt(e.target.value));
                                          setCurrentPage(1);
                                   }}
                                   value={tempItemsPerPage}>
                                   <option value="8">8</option>
                                   <option value="9">9</option>
                                   <option value="12">12</option>
                                   <option value="16">16</option>
                            </select>
                            <Icon.CaretDown className="absolute top-1/2 -translate-y-1/2 right-2 pointer-events-none text-gray-500" />
                     </div>
              </div>
       );
};
