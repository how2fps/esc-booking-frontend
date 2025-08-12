"use client";

import { BarbellIcon, ForkKnifeIcon, GarageIcon, MartiniIcon, StarHalfIcon, StarIcon, SwimmingPoolIcon, WashingMachineIcon } from "@phosphor-icons/react";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import PlaceholderCat from "../../../assets/Placeholder_Cat.png";
import type { Hotel } from "../../type/HotelType";

// Format date helper function (same as in HotelListingsPage)
function formatDate(dateString: string): string {
       if (!dateString) {
              const today = new Date();
              const year = today.getFullYear();
              const month = String(today.getMonth() + 1).padStart(2, "0");
              const day = String(today.getDate()).padStart(2, "0");
              return `${year}-${month}-${day}`;
       }
       return dateString;
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

const HotelItem: React.FC<{ hotelData: Hotel; dateRange: string; destination_id: string }> = ({ hotelData, dateRange, destination_id }) => {
       const router = useNavigate();
       const [searchParams] = useSearchParams();

       // Extract and format dates from URL parameters (same as HotelListingsPage)
       const checkIn = formatDate(searchParams.get("startDate") as string);
       const checkOut = formatDate(searchParams.get("endDate") as string);
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
              router(`/hotels/${id}?destination_id=${destination_id}&checkin=${checkIn}&checkout=${checkOut}`);
       };

       const renderStars = (rating: number) => {
              const fullStars = Math.floor(rating);
              const hasHalfStar = rating - fullStars >= 0.5;
              const stars = [];
              for (let i = 0; i < fullStars; i++) {
                     stars.push(
                            <StarIcon
                                   key={`full-${i}`}
                                   weight="fill"
                                   color="#facc15"
                            />
                     );
              }
              if (hasHalfStar) {
                     stars.push(
                            <StarHalfIcon
                                   key="half"
                                   weight="fill"
                                   color="#facc15"
                            />
                     );
              }
              return stars;
       };

       return (
              <div
                     onClick={() => handleClickItem(hotelData.id)}
                     role="listitem"
                     className="hotel-item hover-scale animate-fadeIn opacity-0 animate-duration-300 animate-fill-forwards">
                     <div className="thumb-img relative">
                            {imageArray.length > 0 && !allImagesFailed ? (
                                   <Swiper
                                          pagination={{
                                                 type: "fraction",
                                          }}
                                          loop={imageArray.length > 1}
                                          modules={[Pagination]}
                                          className="mySwiper rounded-xl"
                                          slidesPerView={1}
                                          spaceBetween={0}
                                          allowTouchMove={true}
                                          touchRatio={1}
                                          touchAngle={45}
                                          simulateTouch={true}
                                          preventClicks={false}
                                          preventClicksPropagation={true}>
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
                                                                             className="w-full h-full object-cover"
                                                                      />
                                                               ) : (
                                                                      <img
                                                                             src={img}
                                                                             width={2000}
                                                                             height={2000}
                                                                             alt="Hotel image"
                                                                             className="w-full h-full object-cover"
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
                     <div
                            className="infor mt-4"
                            onClick={() => handleClickItem(hotelData.id)}
                            style={{ cursor: "pointer" }}>
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                   <div className="flex items-center gap-1">
                                          {Object.entries(hotelData.amenities).map(([key, value]) =>
                                                 value && iconlist[key as keyof typeof iconlist] ? (
                                                        <span
                                                               key={key}
                                                               title={key}>
                                                               {iconlist[key as keyof typeof iconlist]}
                                                        </span>
                                                 ) : null
                                          )}
                                   </div>
                                   <div className="flex flex-col">
                                          <div className="flex">{renderStars(Number(hotelData.rating))}</div>
                                          <div className="text-button-sm">Rating: {Number(hotelData.trustyou.score.overall)}</div>
                                   </div>
                            </div>
                            <div
                                   data-testid="hotel-name"
                                   className="name capitalize mt-1">
                                   {hotelData.name}
                            </div>
                            <div className="flex items-center justify-between gap-2 mt-1">
                                   <div className="text-variant1">{dateRange}</div>
                                   <div className="flex lg:items-end">
                                          <span className="text-button">${hotelData.price ?? "-"}</span>
                                          <span className="caption1 text-variant1">/night</span>
                                   </div>
                            </div>
                     </div>
              </div>
       );
};

export default HotelItem;
