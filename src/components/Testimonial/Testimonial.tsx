'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import TextHeading from '../TextHeading/TextHeading'
import TestimonialItem from './TestimonialItem';
import { TestimonialType } from '@/type/TestimonialType';

interface Props {
    data: Array<TestimonialType>
}

const Testimonial: React.FC<Props> = ({ data }) => {
    return (
        <>
            <div className="testimonial-block lg:pt-20 md:pt-14 pt-10">
                <div className="container">
                    <TextHeading title='What’s people say’s' subTitle='Discover exceptional experiences through testimonials from our satisfied customers.' />
                    <div className="list md:mt-10 mt-6">
                        <Swiper
                            spaceBetween={12}
                            slidesPerView={1}
                            loop={true}
                            pagination={{ clickable: true }}
                            modules={[Pagination, Autoplay]}
                            autoplay={{
                                delay: 3000
                            }}
                            breakpoints={{
                                576: {
                                    slidesPerView: 1,
                                    spaceBetween: 12,
                                },
                                768: {
                                    slidesPerView: 1,
                                    spaceBetween: 20,
                                },
                                992: {
                                    slidesPerView: 2,
                                    spaceBetween: 30,
                                },
                            }}
                            className='pb-14'
                        >
                            {data.slice(0, 5).map((prd, index) => (
                                <SwiperSlide key={index}>
                                    <TestimonialItem data={prd} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Testimonial