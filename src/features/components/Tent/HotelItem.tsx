'use client'

import React from 'react'
import * as Icon from "@phosphor-icons/react"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination } from "swiper/modules";
import {  useNavigate } from "react-router-dom";
import type  { HotelType } from '../../type/HotelType'
import temp from "/images/logo/Vector.png"

interface Props {
    data: HotelType;
    type: string
}
const iconlist = {
    dryCleaning :<Icon.WashingMachine  />,
    outdoorPool :<Icon.SwimmingPool />,
    continentalBreakfast :<Icon.ForkKnife />,
    parkingGarage :<Icon.Garage  />,
    fitnessFacility :<Icon.Barbell   />,
    inHouseDining :<Icon.ForkKnife  />,
    inHouseBar :<Icon.Martini    />

}



const HotelItem: React.FC<Props> = ({ data, type }) => {
    
    const router = useNavigate()
    const prefix = data.image_details["prefix"]
    //const image_count = Math.min(data.image_details["count"],10)
    const image_array: string[] = []
    for (let i = 0; i < 10; i++) {
     image_array.push(prefix+i+".jpg")
    }


    const handleClickItem = (id: string) => {
        router(`/camp/hotel-detail?id=${id}`)
    }

    return (
        <>
            {type === "default" ? (
                <div
                    className="hotel-item hover-scale"
                    onClick={() => { handleClickItem(data.id) }}
                >
                    <div className="thumb-img relative">
                        <Swiper
                            pagination={{
                                type: "fraction",
                            }}
                            loop={true}
                            modules={[Pagination]}
                            className="mySwiper rounded-xl"
                        >
                            {image_array.map((img,index) => (
                                <SwiperSlide key={index} className='overflow-hidden'>
                                    <div className="bg-img w-full aspect-[16/11]">
                                        <img
                                            src={img}
                                            width={2000}
                                            height={2000}
                                            alt={"error"}
                                            
                                            className='w-full h-full object-fit: scale-down'
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        
                    </div>
                    <div className="infor mt-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-1">
                                    {Object.entries(data.amenities).map(([key, value]) =>
                              value && iconlist[key] ? (
                              <span key={key} title={key}>
                                 {iconlist[key]}   </span>
                                ) : null
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="text-button-sm">{Number(data.rating).toFixed(1)}</div>
                                <Icon.Star className='text-yellow' weight='fill' />
                            </div>
                        </div>
                        <div className="name capitalize mt-1">{data.name}</div>
                        <div className="flex items-center justify-between gap-2 mt-1">
                            
                            <div className="flex lg:items-end">
                                <span className='text-button'>${data.price}</span>
                                <span className='caption1 text-variant1'>/night</span></div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
        
                    {type === 'list' ? (
                        <>
                        
                            <div
                                className="hotel-item hover-scale style-list"
                                onClick={() => { handleClickItem(data.id) }}
                            >
        
                                <div className=" flex rounded-2xl h-full overflow-hidden border border-outline box-shadow-sm">
                                            <div className="thumb-img w-60 h-full overflow-hidden flex-shrink-0">
                                                <Swiper  className="w-full h-full object-cover">
                                                {image_array.map((img, i) => (
                                                    <SwiperSlide key={i} className="overflow-hidden">
                                                    <img 
                                                        src={img} 
                                                        alt="hotel"
                                                        className="w-full h-full object-fit: scale-down "
                                                    />
                                                    </SwiperSlide>
                                                ))}
                                                </Swiper>
                                            </div>
                                            <div className="text-container w-full max-h-[200px] overflow-hidden">
                                        <div className="flex items-center gap-2 ml-4 mt-1 mr-4">
                                            <div className="capitalize text-2xl">{data.name}</div>
                                            <div className="flex items-center gap-1 text-button">
                                            <div className="text-2xl">{data.rating}</div>
                                            <Icon.Star className="text-yellow" weight="fill" />
                                            </div>
                                        </div>
                                        
                                        <div className="flex ml-4 mt-1">
                                            <div className="max-h-48  overflow-y-auto  mr-4 scrollbar-hide">
                                            {data.description}
                                            </div>
                                        </div>

                                        <div className="-title md:">Pricing:</div>
                                        <div className="flex items-end md:justify-center sm:mt-1">
                                            <span className="flex">${data.price}</span>
                                            <span className="text-variant1">/night</span>
                                        </div>
                                        </div>
                                        </div>
                                        </div>
                                   
                            
                        </>
                    ) : (
                        <>
                            
                        </>
                    )}
                </>
            )}
        </>
    )
}

export default HotelItem