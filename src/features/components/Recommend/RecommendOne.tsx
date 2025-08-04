import React from "react";
import { useEffect, useState } from "react";
import type { Hotel } from "../../type/HotelType";
import HotelItem from "../HotelItem/HotelItem";
import TextHeading from "../TextHeading/TextHeading";
import * as Icon from "phosphor-react";
import { SpinnerIcon } from "@phosphor-icons/react";

interface Props {
       IDs: Array<string>;
       names: Array<string>;
       start: number;
       end: number;
}

const RecommendOne: React.FC<Props> = ({ IDs, names, start, end }) => {
       const [showedHotel, setShowedHotel] = useState(0);
       const [hotelToShow, setHotelToShow] = useState<Hotel[]>();
       const [isLoading, setIsLoading] = useState<boolean>(true);
       const loadRecommend = async (ID: string, max: number) => {
              
              const response = await fetch("http://localhost:3000/api/hotels?destination_id=" + ID);
              const data: Array<Hotel> = await response.json();
              data.sort((a, b) => {
                     return b.rating - a.rating;
              });

              return data.slice(0, max);
       };
       const loadAllRecommend = async (IDs: Array<string>) => {
              const recommendHotels: Array<Hotel> = [];
              for (const element of IDs) {
              const hotels = await loadRecommend(element, end);
              console.log(hotels)
              recommendHotels.push(hotels); // push all hotels from the result
              }
              return recommendHotels;}

       
       

       useEffect(() => {
              async function fetchData() {
                     setIsLoading(true);       // Start loading before fetching
                     try {
                            const data = await loadAllRecommend(IDs);
                            console.log('Recommended Hotels:', data);
                            setHotelToShow(data);
                     } catch (error) {
                            console.error('Error loading recommended hotels:', error);
                            // Optionally, handle error state here
                     } finally {
                            setIsLoading(false);    // Stop loading after fetch finishes (success or error)
                     }
              }

              if (IDs.length > 0) {
                     fetchData();
              } else {
                     // If no IDs, ensure loading is false
                     setIsLoading(false);
              }
       }, [IDs]);

       const handleNext = () => {
              setShowedHotel((showedHotel+1)%end)
       };
       const handlePrev = () => {
     
              setShowedHotel((end-1+showedHotel)%end)
       };
       return (
              <div className="recommend-block lg:pt-20 md:pt-14">
                     <div className="container">
                            
                            <div className="text-4xl font-semibold mb-5">Popular Destinations</div>
                            <div className="flex justify-center gap-5 min-w-xl">
                                   <Icon.ArrowCircleLeft size={28} onClick={handlePrev} />
                                   <div className=" text-xl  min-w-[12rem] max-w-[16rem] text-center truncate">{names[showedHotel]}</div>
                                   <Icon.ArrowCircleRight size={28} onClick={handleNext} />
                            </div>

                            <div className="relative min-h-[100px]">
                                   <div className="list-cate grid lg:grid-cols-4 md:grid-cols-3 min-[360px]:grid-cols-2 lg:gap-[30px] gap-4 gap-y-7 md:mt-10 mt-6 ">
                                          {!isLoading ? (
                                                 hotelToShow?.[showedHotel]?.map((hotel, index) => (
                                                        <div key={index}>
                                                               <HotelItem
                                                                      image_size={10}
                                                                      hotelData={hotel}
                                                                      type={"compact"}
                                                               />
                                                        </div>
                                                 ))
                                          ) : (
                                                 // Show nothing inside the grid while loading
                                                 null
                                          )}
                                   </div>

                                   {isLoading && (
                                          <div
                                                 role="status"
                                                 className="absolute inset-0 flex justify-center items-center bg-opacity-75 z-10"
                                          >
                                                 <SpinnerIcon
                                                        className="animate-spin text-blue-500"
                                                        size={96}
                                                 />
                                          </div>
                                   )}
                            </div>
                     </div>
              </div>
       );
};

export default RecommendOne;
