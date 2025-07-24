"use client";

import { BarbellIcon, ForkKnifeIcon, GarageIcon, MartiniIcon, StarIcon, SwimmingPoolIcon, WashingMachineIcon } from "@phosphor-icons/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import PlaceholderCat from "../../../assets/Placeholder_Cat.png";
import type { Hotel } from "../../type/HotelType";

const iconlist = {
       dryCleaning: <WashingMachineIcon />,
       outdoorPool: <SwimmingPoolIcon />,
       continentalBreakfast: <ForkKnifeIcon />,
       parkingGarage: <GarageIcon />,
       fitnessFacility: <BarbellIcon />,
       inHouseDining: <ForkKnifeIcon />,
       inHouseBar: <MartiniIcon />,
};

const HotelItem: React.FC<{ hotelData: Hotel }> = ({ hotelData }) => {
       const router = useNavigate();
       const prefix = hotelData.image_details?.prefix || "";
       const suffix = hotelData.image_details?.suffix || "";
       const imageCount = Math.min(hotelData.image_details?.count || 1);
       const imageArray: string[] = [];
       const [failedImages, setFailedImages] = React.useState<Set<string>>(new Set());

       if (prefix && imageCount > 0) {
              for (let i = 1; i <= imageCount; i++) {
                     imageArray.push(`${prefix}${i}${suffix}`);
              }
       }

       const handleImageError = (imgSrc: string) => {
              setFailedImages((prev) => new Set([...prev, imgSrc]));
       };

       const allImagesFailed = imageArray.length > 0 && failedImages.size === imageArray.length;
       const handleClickItem = (id: string) => {
              router(`/hotel-details?id=${id}`);
       };
       return (
              <div
                     className="hotel-item hover-scale"
                     onClick={() => {
                            handleClickItem(hotelData.id);
                     }}>
                     <div className="thumb-img relative">
                            {imageArray.length > 0 && !allImagesFailed ? (
                                   <Swiper
                                          pagination={{
                                                 type: "fraction",
                                          }}
                                          loop={imageArray.length > 1}
                                          modules={[Pagination]}
                                          className="mySwiper rounded-xl">
                                          {imageArray.map((img, index) => (
                                                 <SwiperSlide
                                                        key={index}
                                                        className="overflow-hidden">
                                                        <div className="bg-img w-full aspect-[16/11]">
                                                               {failedImages.has(img) ? (
                                                                      <img
                                                                             loading="lazy"
                                                                             src={PlaceholderCat}
                                                                             width={2500}
                                                                             height={2500}
                                                                             alt="Placeholder image"
                                                                             className="w-full h-full object-scale-down"
                                                                      />
                                                               ) : (
                                                                      <img
                                                                             src={img}
                                                                             width={2000}
                                                                             height={2000}
                                                                             alt="Hotel image"
                                                                             className="w-full h-full object-scale-down"
                                                                             onError={() => handleImageError(img)}
                                                                      />
                                                               )}
                                                        </div>
                                                 </SwiperSlide>
                                          ))}
                                   </Swiper>
                            ) : (
                                   <div className="bg-img w-full aspect-[16/11]">
                                          <img
                                                 src={PlaceholderCat}
                                                 width={2000}
                                                 height={2000}
                                                 alt="Placeholder image"
                                                 className="w-full h-full object-scale-down"
                                          />
                                   </div>
                            )}
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
       );
};

export default HotelItem;
