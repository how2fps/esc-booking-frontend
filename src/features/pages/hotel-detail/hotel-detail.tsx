'use client'

import React, { useState, useEffect, useCallback } from 'react'

import Link from 'next/link'
import * as Icon from 'phosphor-react'
import HeaderOne from '../../components/Header/HeaderOne'
import Footer from '../../components/Footer/Footer'
import tentData from '../../components/data/Tent.json'

import { TentType } from '../../type/TentType'
import { useSearchParams } from "react-router";
import { Suspense } from 'react'

import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { addDays } from 'date-fns';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

import StickyBox from 'react-sticky-box';

interface GuestType {
    adult: number;
    children: number;
    infant: number;
    pet: number;
}
function getParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  return searchParams;
}
const HotelDetailContent = () => {
    const params = getParams()
    let tentId = params.get('id')
    const [viewMoreDesc, setViewMoreDesc] = useState<boolean>(false)
    const [openDate, setOpenDate] = useState(false)
    const [openGuest, setOpenGuest] = useState(false)
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: 'selection'
        }
    ]);

    if (tentId === null || undefined) {
        tentId = '1'
    }

    const tentMain = tentData.find(tent => tent.id === tentId) as TentType

    const [guest, setGuest] = useState<GuestType>(
        {
            adult: 0,
            children: 0,
            infant: 0,
            pet: 0
        }
    );

    const settings = {
        arrows: true,
        infinite: true,
        speed: 300,
        slidesToShow: 3,
        slidesToScroll: 1,
        touchThreshold: 100,
        swipe: true,
        swipeToSlide: true,
        draggable: true,
        useTransform: false,
        centerMode: true,
        centerPadding: '300px',
        responsive: [
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerPadding: '24px',
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerPadding: '160px',
                }
            },
            {
                breakpoint: 1340,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 2000,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
        ]
    };

    const handleOpenDate = () => {
        setOpenDate(!openDate)
        setOpenGuest(false)
    }

    const handleOpenGuest = () => {
        setOpenGuest(!openGuest)
        setOpenDate(false)
    }

    // Check if the click event occurs outside the popup.
    const handleClickOutsideDatePopup: EventListener = useCallback((event) => {
        // Cast event.target to Element to use the closest method.
        const targetElement = event.target as Element;

        if (openDate && !targetElement.closest('.form-date-picker')) {
            setOpenDate(false)
        }
    }, [openDate]);

    // Check if the click event occurs outside the popup.
    const handleClickOutsideGuestPopup: EventListener = useCallback((event) => {
        // Cast event.target to Element to use the closest method.
        const targetElement = event.target as Element;

        if (openGuest && !targetElement.closest('.sub-menu-guest')) {
            setOpenGuest(false)
        }
    }, [openGuest]);

    useEffect(() => {
        // Add a global click event to track clicks outside the popup.
        document.addEventListener('click', handleClickOutsideDatePopup);
        document.addEventListener('click', handleClickOutsideGuestPopup);

        // Cleanup to avoid memory leaks.
        return () => {
            document.removeEventListener('click', handleClickOutsideDatePopup);
            document.removeEventListener('click', handleClickOutsideGuestPopup);
        };
    }, [handleClickOutsideDatePopup, handleClickOutsideGuestPopup])

    // Increase number
    const increaseGuest = (type: keyof GuestType) => {
        setGuest((prevGuest) => ({
            ...prevGuest,
            [type]: prevGuest[type] + 1
        }));
    };

    // Decrease number
    const decreaseGuest = (type: keyof GuestType) => {
        if (guest[type] > 0) {
            setGuest((prevGuest) => ({
                ...prevGuest,
                [type]: prevGuest[type] - 1
            }));
        }
    };


    return (
        <>
            <div className='ten-detail'>
                <HeaderOne />
                <div className="list-img-detail overflow-hidden">
                    <Slider {...settings} className="h-full">
                        {tentMain.listImage.map((img, index) => (
                            <div className="bg-img w-full aspect-[4/3]" key={index}>
                                <img
                                    src={img}
                                    width={3000}
                                    height={3000}
                                    alt={img}
                                    
                                    className='w-full h-full object-cover'
                                />
                            </div>
                        ))}
                    </Slider>
                </div>
                <div className="content-detail lg:py-20 md:py-14 py-10">
                    <div className="container">
                        <div className="flex max-lg:flex-col-reverse gap-y-10 justify-between">
                            <div className="content xl:w-2/3 lg:w-[60%] lg:pr-[15px] w-full">
                                <div className="flex items-center justify-between gap-6">
                                    <div className="heading3">{tentMain.name}</div>
                                    <div className="share w-12 h-12 rounded-full bg-white border border-outline flex-shrink-0 flex items-center justify-center cursor-pointer duration-300 hover:bg-black hover:text-white">
                                        <Icon.ShareNetwork className='text-2xl' />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 flex-wrap gap-y-1 mt-2">
                                    <div className="flex items-center gap-1.5">
                                        <Icon.MapPin className='text-variant1' />
                                        <span className='text-variant1 capitalize'>{tentMain.location}</span>
                                    </div>
                                    <Link href={`http://maps.google.com/?q=${tentMain.locationMap.lat},${tentMain.locationMap.lng}`} target='_blank' className='text-primary underline'>Show on map</Link>
                                </div>
                                <div className="desc lg:mt-10 mt-6 lg:pt-10 pt-6 border-t border-outline">
                                    <div className="heading5">Description</div>
                                    <div className="body2 text-variant1 mt-3">{tentMain.shortDesc}</div>
                                    <div className={`body2 text-variant1 ${viewMoreDesc ? '' : 'hidden'}`}>{tentMain.description}</div>
                                    <div
                                        className="text-button-sm underline inline-block duration-300 cursor-pointer mt-3 hover:text-primary"
                                        onClick={() => setViewMoreDesc(!viewMoreDesc)}
                                    >

                                        {viewMoreDesc ? (
                                            <>
                                                Hidden less
                                            </>
                                        ) : (
                                            <>
                                                View More
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="rule lg:mt-8 mt-5">
                                    <div className="heading5">House Rules</div>
                                    <div className="list xl:grid grid-cols-3 xl:gap-16 max-xl:flex max-xl:flex-wrap max-xl:gap-8 max-xl:gap-y-2 xl:gap-y-2 mt-4">
                                        <div className="flex items-center gap-2">
                                            <Icon.Clock className='text-2xl' />
                                            <div className="body2">Check-in: From 1pm</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Icon.Confetti className='text-2xl' />
                                            <div className="body2">Parties and events</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Icon.PawPrint className='text-2xl' />
                                            <div className="body2">Pet allowed</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Icon.Alarm className='text-2xl' />
                                            <div className="body2">Check-out: By 11am</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Icon.ShieldSlash className='text-2xl' />
                                            <div className="body2">No smoking</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="feature lg:mt-10 mt-6 lg:pt-10 pt-6 border-t border-outline">
                                    <div className="heading5">Amenities and features</div>
                                    <div className="list flex justify-between w-full mt-4">
                                        <div className='w-fit'>
                                            <div className="text-title">Services:</div>
                                            <div className="list flex flex-col gap-2 mt-3">
                                                {tentMain.services.map((item, index) => (
                                                    <div key={index} className="item capitalize">
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className='w-fit'>
                                            <div className="text-title">Amenities:</div>
                                            <div className="list flex flex-col gap-2 mt-3">
                                                {tentMain.amenities.map((item, index) => (
                                                    <div key={index} className="item capitalize">
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className='w-fit max-sm:hidden'>
                                            <div className="text-title">Activities:</div>
                                            <div className="list flex flex-col gap-2 mt-3">
                                                {tentMain.activities.map((item, index) => (
                                                    <div key={index} className="item capitalize">
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="date lg:mt-10 mt-6 lg:pt-10 pt-6 border-t border-outline">
                                    <div className="heading5">Dates & Availability</div>
                                    <div className="bg-img relative mt-1">
                                        <DateRangePicker
                                            className={`form-date-picker style-detail w-full border border-outline rounded-none open`}
                                            onChange={item => setState([item.selection] as any)}
                                            // showSelectionPreview={true}
                                            moveRangeOnFirstSelection={false}
                                            months={2}
                                            ranges={state}
                                            direction="horizontal"
                                        />
                                    </div>
                                </div>
                                <div className="map lg:mt-10 mt-6 lg:pt-10 pt-6 border-t border-outline">
                                    <div className="heading5">Map</div>
                                    <div className="bg-img relative mt-3">
                                        <iframe
                                            className='w-full h-[360px]'
                                            src={`https://maps.google.com/maps?q=${tentMain.locationMap.lat}, ${tentMain.locationMap.lng}&hl=es&z=14&amp&output=embed`}
                                        ></iframe>
                                    </div>
                                </div>
                                
                            </div>
                            <div className="sidebar xl:w-1/3 lg:w-[40%] lg:pl-[45px] w-full">
                                <StickyBox offsetTop={100} offsetBottom={20}>
                                    <div className="reservation bg-surface p-6 rounded-md">
                                        <div className="heading4 text-center">Reservation</div>
                                        <div className="date-sidebar-detail bg-white border border-outline mt-5">
                                            <div className="relative cursor-pointer">
                                                <div className="grid grid-cols-2 border-b border-outline" onClick={handleOpenDate}>
                                                    <div className="left pl-5 py-4 border-r border-outline">
                                                        <div className="flex items-center gap-1">
                                                            <Icon.CalendarBlank className='text-xl' />
                                                            <div className="text-button">Check In</div>
                                                        </div>
                                                        <div className="body2 mt-1">{state[0].startDate.toLocaleDateString()}</div>
                                                    </div>
                                                    <div className="left pr-5 py-4">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Icon.CalendarBlank className='text-xl' />
                                                            <div className="text-button">Check Out</div>
                                                        </div>
                                                        <div className="body2 mt-1 text-end">{state[0].endDate.toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                                <DateRangePicker
                                                    className={`form-date-picker box-shadow ${openDate ? 'open' : ''}`}
                                                    onChange={item => setState([item.selection] as any)}
                                                    moveRangeOnFirstSelection={false}
                                                    months={2}
                                                    ranges={state}
                                                    direction="horizontal"
                                                />
                                            </div>
                                            <div className="guest px-5 py-4 relative cursor-pointer">
                                                <div className="flex items-center justify-between" onClick={handleOpenGuest}>
                                                    <div>
                                                        <div className="flex items-center gap-1">
                                                            <Icon.Users className='text-xl' />
                                                            <div className="text-button">Guest</div>
                                                        </div>
                                                        <div className="body2 mt-1">{guest.adult} adults - {guest.children} childrens</div>
                                                    </div>
                                                    <Icon.CaretDown className='text-2xl' />
                                                </div>
                                                <div className={`sub-menu-guest bg-white rounded-b-xl overflow-hidden p-5 absolute top-full -mt-px left-0 w-full box-shadow ${openGuest ? 'open' : ''}`}>
                                                    <div className="item flex items-center justify-between pb-4 border-b border-outline">
                                                        <div className="left">
                                                            <p>Adults</p>
                                                            <div className="caption1 text-variant1">(12 Years+)</div>
                                                        </div>
                                                        <div className="right flex items-center gap-5">
                                                            <div
                                                                className={`minus w-8 h-8 flex items-center justify-center rounded-full border border-outline duration-300 ${guest.adult === 0 ? 'opacity-[0.4] cursor-default' : 'cursor-pointer hover:bg-black hover:text-white'}`}
                                                                onClick={() => decreaseGuest('adult')}
                                                            >
                                                                <Icon.Minus weight='bold' />
                                                            </div>
                                                            <div className="text-title">{guest.adult}</div>
                                                            <div
                                                                className="plus w-8 h-8 flex items-center justify-center rounded-full border border-outline cursor-pointer duration-300 hover:bg-black hover:text-white"
                                                                onClick={() => increaseGuest('adult')}
                                                            >
                                                                <Icon.Plus weight='bold' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="item flex items-center justify-between pb-4 pt-4 border-b border-outline">
                                                        <div className="left">
                                                            <p>Children</p>
                                                            <div className="caption1 text-variant1">(2-12 Years)</div>
                                                        </div>
                                                        <div className="right flex items-center gap-5">
                                                            <div
                                                                className={`minus w-8 h-8 flex items-center justify-center rounded-full border border-outline duration-300 ${guest.children === 0 ? 'opacity-[0.4] cursor-default' : 'cursor-pointer hover:bg-black hover:text-white'}`}
                                                                onClick={() => decreaseGuest('children')}
                                                            >
                                                                <Icon.Minus weight='bold' />
                                                            </div>
                                                            <div className="text-title">{guest.children}</div>
                                                            <div
                                                                className="plus w-8 h-8 flex items-center justify-center rounded-full border border-outline cursor-pointer duration-300 hover:bg-black hover:text-white"
                                                                onClick={() => increaseGuest('children')}
                                                            >
                                                                <Icon.Plus weight='bold' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    
                                                    <div
                                                        className="button-main w-full text-center"
                                                        onClick={() => setOpenGuest(false)}
                                                    >
                                                        Done
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/*  PRICE Display */}
                                        <div className="price-block mt-5">
                                            <div className="heading6">Price Summary</div>
                                            <div className="list mt-2">
                                                <div className="flex items-center justify-between">
                                                    <div>$200 x 5 Nights</div>
                                                    <div className="text-button">05 x $200</div>
                                                </div>
                                                <div className="flex items-center justify-between mt-1">
                                                    <div>Cleaning Fee</div>
                                                    <div className="text-button">$40</div>
                                                </div>
                                                <div className="flex items-center justify-between mt-1">
                                                    <div>Services Fee</div>
                                                    <div className="text-button">$60</div>
                                                </div>
                                            </div>
                                            <div className="total-block mt-5 pt-5 border-t border-outline flex items-center justify-between">
                                                <div className="heading6">Total Before Taxes</div>
                                                <div className="heading5">$1100</div>
                                            </div>
                                            <div className="button-main w-full text-center mt-5">Booking Tent</div>
                                        </div>
                                    </div>

                                    
                                    <div className="reservation bg-surface p-6 rounded-md md:mt-10 mt-6">
                                        <div className="heading6 mt-5">Property Hightlishts</div>
                                        <div className="text-title mt-4">Breakfast Info</div>
                                        <div className="text-variant1 mt-1">Continental, Breakfast to go</div>
                                        <div className="heading6 mt-4">Rooms with:</div>
                                        <div className="list mt-1">
                                            <div className="flex items-center gap-2">
                                                <Icon.UsersThree className='text-xl' />
                                                <div>Front desk <span className='text-variant1'>(24-hour)</span></div>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Icon.Person className='text-xl' />
                                                <div>Concierge</div>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Icon.CurrencyCircleDollar className='text-xl' />
                                                <div>Currency exchange</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="reservation bg-surface p-6 rounded-md md:mt-10 mt-6">
                                        <div className="heading6 mt-5">Why Book With Us?</div>
                                        <div className="list mt-4">
                                            <div className="flex items-center gap-2">
                                                <Icon.Lock className='text-xl' />
                                                <div>Secure Booking</div>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Icon.CoinVertical className='text-xl' />
                                                <div>Best Price Guarantee</div>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Icon.HandPointing className='text-xl' />
                                                <div>Easy Booking Process</div>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Icon.PhoneCall className='text-xl' />
                                                <div>Available Support 24/7</div>
                                            </div>
                                        </div>
                                    </div>
                                </StickyBox>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}
const HotelDetail = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <HotelDetailContent />
    </Suspense>
)
export default HotelDetail