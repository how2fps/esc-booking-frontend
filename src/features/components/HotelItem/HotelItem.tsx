"use client";

import { BarbellIcon, ForkKnifeIcon, GarageIcon, MartiniIcon, StarIcon, SwimmingPoolIcon, WashingMachineIcon } from "@phosphor-icons/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Hotel } from "../../type/HotelType";
interface Props {
       hotelData: Hotel;
}
const iconlist = {
       dryCleaning: <WashingMachineIcon />,
       outdoorPool: <SwimmingPoolIcon />,
       continentalBreakfast: <ForkKnifeIcon />,
       parkingGarage: <GarageIcon />,
       fitnessFacility: <BarbellIcon />,
       inHouseDining: <ForkKnifeIcon />,
       inHouseBar: <MartiniIcon />,
};

const HotelItem: React.FC<Props> = ({ hotelData }) => {
       const router = useNavigate();
       const prefix = hotelData.image_details?.prefix || "";
       const image_count = Math.min(hotelData.image_details?.count || 1, 10);
       const image_array: string[] = [];

       if (prefix && image_count > 0) {
              for (let i = 1; i <= image_count; i++) {
                     image_array.push(`${prefix}${i}.jpg`);
              }
       }
       const handleClickItem = (id: string) => {
              router(`/camp/hotel-details?id=${id}`);
       };
       return (
              <>
                     <div
                            className="hotel-item hover-scale"
                            onClick={() => {
                                   handleClickItem(hotelData.id);
                            }}>
                            <div className="thumb-img relative">
                                   <Swiper
                                          pagination={{
                                                 type: "fraction",
                                          }}
                                          loop={true}
                                          modules={[Pagination]}
                                          className="mySwiper rounded-xl">
                                          {image_array.map((img, index) => (
                                                 <SwiperSlide
                                                        key={index}
                                                        className="overflow-hidden">
                                                        <div className="bg-img w-full aspect-[16/11]">
                                                               <img
                                                                      src={img}
                                                                      width={2000}
                                                                      height={2000}
                                                                      alt={"ERROR"}
                                                                      className="w-full h-full object-scale-down"
                                                               />
                                                        </div>
                                                 </SwiperSlide>
                                          ))}
                                   </Swiper>
                            </div>
                            <div className="infor mt-4">
                                   <div className="flex items-center justify-between flex-wrap gap-2">
                                          <div className="flex items-center gap-1">
                                                 {Object.entries(hotelData.amenities).map(([key, value]) =>
                                                        value && iconlist[key] ? (
                                                               <span
                                                                      key={key}
                                                                      title={key}>
                                                                      {iconlist[key]}
                                                               </span>
                                                        ) : null
                                                 )}
                                          </div>
                                          <div className="flex items-center gap-1">
                                                 <div className="text-button-sm">{Number(hotelData.rating).toFixed(1)}</div>
                                                 <StarIcon
                                                        className="text-yellow"
                                                        weight="fill"
                                                 />
                                          </div>
                                   </div>
                                   <div className="name capitalize mt-1">{hotelData.name}</div>
                                   <div className="flex items-center justify-between gap-2 mt-1">
                                          <div className="text-variant1">Nov. 12 - 15</div>
                                          <div className="flex lg:items-end">
                                                 <span className="text-button">${hotelData.price}</span>
                                                 <span className="caption1 text-variant1">/night</span>
                                          </div>
                                   </div>
                            </div>
                     </div>
              </>
       );
};

export default HotelItem;
