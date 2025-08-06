import { StarHalfIcon, StarIcon } from "@phosphor-icons/react";
import { useState } from "react";

export const StarRatingPicker = ({ value, onChange }: { value: number; onChange: (val: number) => void }) => {
       const [hoverValue, setHoverValue] = useState<number | null>(null);

       const getStarClass = (active: boolean) => (active ? "text-yellow-400 transition-colors duration-150" : "text-gray-300 transition-colors duration-150 group-hover:text-yellow-200");

       const handleClick = (index: number, isHalf: boolean) => {
              const newValue = isHalf ? index + 0.5 : index + 1;
              onChange(newValue);
       };

       const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
              const { left, width } = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - left;
              setHoverValue(x < width / 2 ? index + 0.5 : index + 1);
       };

       const displayValue = hoverValue ?? value;

       return (
              <div className="flex items-center gap-3 mb-8">
                     <span className="font-semibold text-gray-800">Minimum Stars:</span>
                     <div className="flex gap-1 cursor-pointer select-none">
                            {[0, 1, 2, 3, 4].map((i) => {
                                   const starValue = i + 1;
                                   const isFull = displayValue >= starValue;
                                   const isHalf = displayValue >= starValue - 0.5 && displayValue < starValue;
                                   return (
                                          <div
                                                 key={i}
                                                 onClick={(e) => {
                                                        const { left, width } = e.currentTarget.getBoundingClientRect();
                                                        const clickX = e.clientX - left;
                                                        handleClick(i, clickX < width / 2);
                                                 }}
                                                 onMouseMove={(e) => handleMouseMove(e, i)}
                                                 onMouseLeave={() => setHoverValue(null)}
                                                 className="group relative w-6 h-6 flex items-center justify-center">
                                                 {isFull ? (
                                                        <>
                                                               <StarIcon
                                                                      weight="fill"
                                                                      size={24}
                                                                      color="#facc15"
                                                                      className={`${getStarClass(true)} transform transition-transform duration-150 ${hoverValue !== null ? "scale-110" : "scale-100"}`}
                                                               />
                                                        </>
                                                 ) : isHalf ? (
                                                        <>
                                                               <StarHalfIcon
                                                                      weight="fill"
                                                                      size={24}
                                                                      color="#facc15"
                                                                      className={`${getStarClass(true)} transform transition-transform duration-150 ${hoverValue !== null ? "scale-110" : "scale-100"}`}
                                                               />
                                                        </>
                                                 ) : (
                                                        <StarIcon
                                                               weight="regular"
                                                               size={24}
                                                               color="#facc15"
                                                               className={`${getStarClass(false)} transform transition-transform duration-150 ${hoverValue !== null ? "scale-110" : "scale-100"}`}
                                                        />
                                                 )}
                                          </div>
                                   );
                            })}
                     </div>
              </div>
       );
};
