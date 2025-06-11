'use client'

import React from 'react'
import Image from 'next/image'
import * as Icon from 'phosphor-react'
import { TentType } from '@/type/TentType'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { useWishlist } from '@/context/WishlistContext'
import { useRouter } from 'next/navigation'

interface Props {
    data: TentType;
    type: string
}

const TentItem: React.FC<Props> = ({ data, type }) => {
    const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist()
    const router = useRouter()

    const handleClickItem = (id: string) => {
        router.push(`/camp/tent-detail?id=${id}`)
    }

    const handleAddToWishlist = () => {
        // if product existed in wishlit, remove from wishlist and set state to false
        if (wishlistState.wishlistArray.some(item => item.id === data.id)) {
            removeFromWishlist(data.id);
        } else {
            // else, add to wishlist and set state to true
            addToWishlist(data);
        }
    };

    return (
        <>
            {type === "default" ? (
                <div
                    className="tent-item hover-scale"
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
                            {data.listImage.map((img, index) => (
                                <SwiperSlide key={index} className='overflow-hidden'>
                                    <div className="bg-img w-full aspect-square">
                                        <Image
                                            src={img}
                                            width={2000}
                                            height={2000}
                                            alt={img}
                                            priority={true}
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <div
                            className={`wishlist-icon absolute top-3 right-3 z-[1] flex items-center justify-center w-8 h-8 text-white rounded-full duration-300 ${wishlistState.wishlistArray.some(item => item.id === data.id) ? 'active' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleAddToWishlist()
                            }}
                        >

                            {wishlistState.wishlistArray.some(item => item.id === data.id) ? (
                                <>
                                    <Icon.Heart weight='fill' className='body2 text-white duration-500' />
                                </>
                            ) : (
                                <>
                                    <Icon.Heart className='body2 duration-500' />
                                </>
                            )}
                        </div>
                    </div>
                    <div className="infor mt-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-1">
                                <Icon.MapPin className='md:text-xl text-variant1' />
                                <div className="caption1 text-variant1">100 km</div>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="text-button-sm">{data.rate}</div>
                                <Icon.Star className='text-yellow' weight='fill' />
                            </div>
                        </div>
                        <div className="name text-title capitalize mt-1">{data.name}</div>
                        <div className="flex items-center justify-between gap-2 mt-1">
                            <div className="text-variant1">Nov. 12 - 15</div>
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
                                className="tent-item hover-scale style-list"
                                onClick={() => { handleClickItem(data.id) }}
                            >
                                <div className="tent-main relative flex max-sm:flex-wrap items-center justify-between rounded-2xl overflow-hidden box-shadow-sm border border-outline">
                                    <div className="thumb-img sm:absolute top-0 left-0 h-full xl:w-1/4 lg:w-1/3 md:w-[36%] sm:w-1/2 w-full overflow-hidden">
                                        <Swiper
                                            pagination={{
                                                type: "fraction",
                                            }}
                                            loop={true}
                                            modules={[Pagination]}
                                            className="mySwiper w-full h-full -left-[0.5px]"
                                        >
                                            {data.listImage.map((img, index) => (
                                                <SwiperSlide key={index} className='overflow-hidden'>
                                                    <div className="bg-img w-full h-full">
                                                        <Image
                                                            src={img}
                                                            width={2000}
                                                            height={2000}
                                                            alt={img}
                                                            priority={true}
                                                            className='w-full h-full object-cover'
                                                        />
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                        <div
                                            className={`wishlist-icon absolute top-3 right-3 z-[1] flex items-center justify-center w-8 h-8 text-white rounded-full duration-300 ${wishlistState.wishlistArray.some(item => item.id === data.id) ? 'active' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleAddToWishlist()
                                            }}
                                        >

                                            {wishlistState.wishlistArray.some(item => item.id === data.id) ? (
                                                <>
                                                    <Icon.Heart weight='fill' className='body2 text-white duration-500' />
                                                </>
                                            ) : (
                                                <>
                                                    <Icon.Heart className='body2 duration-500' />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="infor xl:p-10 sm:p-8 p-6 flex items-center justify-between xl:gap-10 lg:gap-8 gap-4 w-full max-md:flex-wrap">
                                        <div className="xl:w-2/3 md:w-1/2 w-full flex-shrink-0 ">
                                            <div className="flex items-center gap-1">
                                                <Icon.MapPin className='md:text-xl text-variant1' />
                                                <div className="caption1 text-variant1">100 km</div>
                                            </div>
                                            <div className="name heading5 capitalize mt-1">{data.name}</div>
                                            <div className="flex items-center gap-1 mt-2">
                                                <div className="text-button">{data.rate}</div>
                                                <Icon.Star className='text-yellow' weight='fill' />
                                                <div className="text-variant1">(18 Review)</div>
                                            </div>
                                            <div className="text-title sm:mt-4 mt-3 max-xl:hidden max-sm:block">Description:</div>
                                            <div className="text-variant1 sm:mt-2 max-xl:hidden max-sm:block">{data.shortDesc}</div>
                                        </div>
                                        <div className="w-px h-full bg-outline max-md:hidden"></div>
                                        <div className="flex flex-col md:items-center justify-between h-full">
                                            <div>
                                                <div className="text-title md:text-center">Date:</div>
                                                <div className="sm:mt-1 md:text-center">November 10 - 15</div>
                                            </div>
                                            <div className='xl:mt-6 mt-3'>
                                                <div className="text-title md:text-center">Pricing:</div>
                                                <div className="flex items-end md:justify-center sm:mt-1">
                                                    <span className='heading4'>${data.price}</span>
                                                    <span className='text-variant1'>/night</span>
                                                </div>
                                                <button className='button-main w-full text-center whitespace-nowrap mt-3'>View Details</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div
                                className="tent-item hover-scale style-list"
                                onClick={() => { handleClickItem(data.id) }}
                            >
                                <div className="tent-main relative flex max-sm:flex-wrap items-center justify-between rounded-2xl overflow-hidden box-shadow-sm border border-outline">
                                    <div className="thumb-img sm:absolute top-0 left-0 h-full 2xl:w-[30%] lg:w-1/3 md:w-[36%] sm:w-1/2 w-full overflow-hidden">
                                        <Swiper
                                            pagination={{
                                                type: "fraction",
                                            }}
                                            loop={true}
                                            modules={[Pagination]}
                                            className="mySwiper w-full h-full -left-[0.5px]"
                                        >
                                            {data.listImage.map((img, index) => (
                                                <SwiperSlide key={index} className='overflow-hidden'>
                                                    <div className="bg-img w-full h-full">
                                                        <Image
                                                            src={img}
                                                            width={2000}
                                                            height={2000}
                                                            alt={img}
                                                            priority={true}
                                                            className='w-full h-full object-cover'
                                                        />
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                        <div
                                            className={`wishlist-icon absolute top-3 right-3 z-[1] flex items-center justify-center w-8 h-8 text-white rounded-full duration-300 ${wishlistState.wishlistArray.some(item => item.id === data.id) ? 'active' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleAddToWishlist()
                                            }}
                                        >

                                            {wishlistState.wishlistArray.some(item => item.id === data.id) ? (
                                                <>
                                                    <Icon.Heart weight='fill' className='body2 text-white duration-500' />
                                                </>
                                            ) : (
                                                <>
                                                    <Icon.Heart className='body2 duration-500' />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="infor 2xl:p-9 sm:p-8 p-6 flex items-center justify-between xl:gap-7 lg:gap-5 gap-3 w-full max-md:flex-wrap">
                                        <div className="2xl:w-3/5 md:w-1/2 w-full flex-shrink-0">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    <Icon.MapPin className='md:text-xl text-variant1' />
                                                    <div className="caption1 text-variant1">100 km</div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <div className="text-button">{data.rate}</div>
                                                    <Icon.Star className='text-yellow' weight='fill' />
                                                </div>
                                            </div>
                                            <div className="name heading6 capitalize mt-2">{data.name}</div>
                                            <div className="text-title sm:mt-3 mt-2 max-2xl:hidden max-sm:block">Description:</div>
                                            <div className="text-variant1 sm:mt-1 max-2xl:hidden max-sm:block">{data.shortDesc}</div>
                                        </div>
                                        <div className="w-px h-[200px] bg-outline flex-shrink-0 max-2xl:hidden"></div>
                                        <div className="flex flex-col md:items-center justify-between h-full">
                                            <div>
                                                <div className="text-title md:text-center">Date:</div>
                                                <div className="sm:mt-1 md:text-center">November 10 - 15</div>
                                            </div>
                                            <div className='xl:mt-5 mt-3'>
                                                <div className="text-title md:text-center">Pricing:</div>
                                                <div className="flex items-end md:justify-center sm:mt-1">
                                                    <span className='heading5'>${data.price}</span>
                                                    <span className='text-variant1'>/night</span>
                                                </div>
                                                <button className='button-main w-full text-center whitespace-nowrap mt-3'>View Details</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    )
}

export default TentItem