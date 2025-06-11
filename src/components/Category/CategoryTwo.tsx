'use client'

import React from 'react'
import Link from 'next/link'
import * as Icon from 'phosphor-react'
import TextHeading from '../TextHeading/TextHeading'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { useRouter } from 'next/navigation'

const CategoryTwo = () => {
    const router = useRouter()

    const handleClickCate = (cate: string) => {
        router.push(`/camp/topmap-grid?category=${cate}`)
    }

    return (
        <>
            <div className="category-block overflow-hidden lg:pt-20 md:pt-14 pt-10">
                <div className="container">
                    <TextHeading title='Try Searching For' subTitle='Explore Distinctive Selections with Our Thoughtfully Curated Categories' />
                    <div className="list-cate style-navigation md:mt-10 mt-6">
                        <div className="custom-swiper-button-prev">
                            <Icon.CaretLeft className='text-xl' />
                        </div>
                        <Swiper
                            spaceBetween={12}
                            slidesPerView={2}
                            navigation={{
                                nextEl: '.custom-swiper-button-next',
                                prevEl: '.custom-swiper-button-prev',
                            }}
                            loop={true}
                            modules={[Navigation, Autoplay]}
                            breakpoints={{
                                576: {
                                    slidesPerView: 3,
                                    spaceBetween: 12,
                                },
                                768: {
                                    slidesPerView: 4,
                                    spaceBetween: 12,
                                },
                                992: {
                                    slidesPerView: 4,
                                    spaceBetween: 12,
                                },
                                1180: {
                                    slidesPerView: 5,
                                    spaceBetween: 20,
                                },
                                1290: {
                                    slidesPerView: 6,
                                    spaceBetween: 20,
                                },
                            }}
                            className='h-full'
                        >
                            <SwiperSlide>
                                <div
                                    className={`item bg-white py-4 px-6 flex flex-col rounded-xl border border-outline duration-300 cursor-pointer hover:bg-black hover:text-white`}
                                    onClick={() => handleClickCate('Cabin')}
                                >
                                    <span className='icon-cabin text-4xl'></span>
                                    <div className="text-title mt-2">Cabin</div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div
                                    className={`item bg-white py-4 px-6 flex flex-col rounded-xl border border-outline duration-300 cursor-pointer hover:bg-black hover:text-white`}
                                    onClick={() => handleClickCate('Tented Cabins')}
                                >
                                    <span className='icon-tented-cabin text-4xl'></span>
                                    <div className="text-title mt-2">Tented Cabins</div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div
                                    className={`item bg-white py-4 px-6 flex flex-col rounded-xl border border-outline duration-300 cursor-pointer hover:bg-black hover:text-white`}
                                    onClick={() => handleClickCate('Safari Tents')}
                                >
                                    <span className='icon-safari-tent text-4xl'></span>
                                    <div className="text-title mt-2">Safari Tents</div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div
                                    className={`item bg-white py-4 px-6 flex flex-col rounded-xl border border-outline duration-300 cursor-pointer hover:bg-black hover:text-white`}
                                    onClick={() => handleClickCate('Cottages')}
                                >
                                    <span className='icon-cottages text-4xl'></span>
                                    <div className="text-title mt-2">Cottages</div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div
                                    className={`item bg-white py-4 px-6 flex flex-col rounded-xl border border-outline duration-300 cursor-pointer hover:bg-black hover:text-white`}
                                    onClick={() => handleClickCate('Tiny Houses')}
                                >
                                    <span className='icon-tiny-house text-4xl'></span>
                                    <div className="text-title mt-2">Tiny Houses</div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div
                                    className={`item bg-white py-4 px-6 flex flex-col rounded-xl border border-outline duration-300 cursor-pointer hover:bg-black hover:text-white`}
                                    onClick={() => handleClickCate('Caravans')}
                                >
                                    <span className='icon-cravan text-4xl'></span>
                                    <div className="text-title mt-2">Caravans</div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div
                                    className={`item bg-white py-4 px-6 flex flex-col rounded-xl border border-outline duration-300 cursor-pointer hover:bg-black hover:text-white`}
                                    onClick={() => handleClickCate('Domes')}
                                >
                                    <span className='icon-domes text-4xl'></span>
                                    <div className="text-title mt-2">Domes</div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div
                                    className={`item bg-white py-4 px-6 flex flex-col rounded-xl border border-outline duration-300 cursor-pointer hover:bg-black hover:text-white`}
                                    onClick={() => handleClickCate('Log Cabins')}
                                >
                                    <span className='icon-log-cabin text-4xl'></span>
                                    <div className="text-title mt-2">Log Cabins</div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div
                                    className={`item bg-white py-4 px-6 flex flex-col rounded-xl border border-outline duration-300 cursor-pointer hover:bg-black hover:text-white`}
                                    onClick={() => handleClickCate('Yurts')}
                                >
                                    <span className='icon-yurt text-4xl'></span>
                                    <div className="text-title mt-2">Yurts</div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div
                                    className={`item bg-white py-4 px-6 flex flex-col rounded-xl border border-outline duration-300 cursor-pointer hover:bg-black hover:text-white`}
                                    onClick={() => handleClickCate('Bell Tents')}
                                >
                                    <span className='icon-bell-tent text-4xl'></span>
                                    <div className="text-title mt-2">Bell Tents</div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div
                                    className={`item bg-white py-4 px-6 flex flex-col rounded-xl border border-outline duration-300 cursor-pointer hover:bg-black hover:text-white`}
                                    onClick={() => handleClickCate('Containers')}
                                >
                                    <span className='icon-container text-4xl'></span>
                                    <div className="text-title mt-2">Containers</div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div
                                    className={`item bg-white py-4 px-6 flex flex-col rounded-xl border border-outline duration-300 cursor-pointer hover:bg-black hover:text-white`}
                                    onClick={() => handleClickCate('Tree')}
                                >
                                    <span className='icon-cottages text-4xl'></span>
                                    <div className="text-title mt-2">Tree Houses</div>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                        <div className="custom-swiper-button-next">
                            <Icon.CaretRight className='text-xl' />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CategoryTwo