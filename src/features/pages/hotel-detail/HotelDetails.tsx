'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react' // ✅ Added useMemo import
import { useParams } from "react-router-dom"
import { addDays } from 'date-fns'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import * as Icon from 'phosphor-react'
import { DateRangePicker } from 'react-date-range'
import StickyBox from 'react-sticky-box'

// Components
import HeaderOne from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'

// Data
import hotelsData from '../../components/data/hotels.json'

// Styles
import "swiper/css"
import "swiper/css/pagination"
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

interface GuestType {
    adult: number;
    children: number;
}

const HotelDetailContent = () => {
    const { id } = useParams();  
    const hotelId = id || '4PXS';
    
    // Find the hotel from JSON data
    const hotel = hotelsData.find((h: any) => h.id === hotelId);
    
    // If no hotel found, show error
    if (!hotel) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Hotel not found!</h2>
                    <p>Hotel ID: {hotelId}</p>
                </div>
            </div>
        );
    }
    
    const [viewMoreDesc, setViewMoreDesc] = useState<boolean>(false)
    const [openDate, setOpenDate] = useState(false)
    const [openGuest, setOpenGuest] = useState(false)
    const [mainImage, setMainImage] = useState<string | null>(null) // ✅ Fixed: Added proper typing
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: 'selection'
        }
    ]);
    const [guest, setGuest] = useState<GuestType>({
        adult: 0,
        children: 0,
    });

    // ✅ Fixed: Moved useMemo before useEffect
    const image_array = useMemo(() => {
        const prefix = hotel.image_details?.prefix || '';
        const count = hotel.image_details?.count || 0;
        const suffix = hotel.image_details?.suffix || '.jpg';
        const image_count = Math.min(count, 10);
        const images: string[] = [];

        for (let i = 0; i < image_count; i++) {
            images.push(`${prefix}${i}${suffix}`);
        }

        return images;
    }, [hotel.id]);

    // ✅ Fixed: Set main image after image_array is created
    useEffect(() => {
        const firstImage = image_array.length > 0 
            ? image_array[0] 
            : '/assets/cityhero.jpg';
        setMainImage(firstImage);
    }, [image_array]);

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
        const targetElement = event.target as Element;
        if (openDate && !targetElement.closest('.form-date-picker')) {
            setOpenDate(false)
        }
    }, [openDate]);

    const handleClickOutsideGuestPopup: EventListener = useCallback((event) => {
        const targetElement = event.target as Element;
        if (openGuest && !targetElement.closest('.sub-menu-guest')) {
            setOpenGuest(false)
        }
    }, [openGuest]);

    useEffect(() => {
        document.addEventListener('click', handleClickOutsideDatePopup);
        document.addEventListener('click', handleClickOutsideGuestPopup);
        return () => {
            document.removeEventListener('click', handleClickOutsideDatePopup);
            document.removeEventListener('click', handleClickOutsideGuestPopup);
        };
    }, [handleClickOutsideDatePopup, handleClickOutsideGuestPopup])

    // Increase number of guests
    const increaseGuest = (type: keyof GuestType) => {
        setGuest((prevGuest) => ({
            ...prevGuest,
            [type]: prevGuest[type] + 1
        }));
    };

    // Decrease number of guests
    const decreaseGuest = (type: keyof GuestType) => {
        if (guest[type] > 0) {
            setGuest((prevGuest) => ({
                ...prevGuest,
                [type]: prevGuest[type] - 1
            }));
        }
    };

    // ✅ Fixed: Added missing variables
    const basePrice = 200;
    const nights = Math.ceil((state[0].endDate.getTime() - state[0].startDate.getTime()) / (1000 * 60 * 60 * 24));
    const cleaningFee = 40; // ✅ Added missing variable
    const serviceFee = 60;  // ✅ Added missing variable
    const serviceTax = 1.9 * (basePrice * nights); 
    const total = (basePrice * nights) + serviceTax;

    return (
        <div className='hotel-detail'>
            <HeaderOne />
            
            {/* Image Gallery */}
            <div className="container mt-10">
                {/* Main Image */}
                <div className="w-full mx-auto">
                    <div
                        className="aspect-[2/3] w-full h-[500px] max-w-full mx-auto overflow-hidden rounded-xl shadow-lg bg-gray-100 flex items-center justify-center"
                        style={{ maxWidth: '100%' }}
                    >
                        <img
                            src={mainImage || "/assets/cityhero.jpg"}
                            alt="Main Hotel View"
                            className="w-full h-full object-cover rounded-xl"
                            style={{ width: '100%', height: '100%' }}
                            onError={(e) => {
                                e.currentTarget.src = "/images/placeholder-hotel.jpg";
                            }}
                        />
                    </div>
                </div>
                {/* Thumbnail Grid */}
                <div className="w-full mt-6">
                    <div className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {image_array.length > 0 ? (
                            image_array.slice(0, 10).map((imageUrl, index) => (
                                <div key={index} className="aspect-[16/11] min-w-[120px] w-[120px] flex-shrink-0">
                                    <img
                                        src={imageUrl}
                                        alt={`Hotel Thumbnail ${index + 1}`}
                                        className="w-full h-full rounded-xl shadow-md object-cover cursor-pointer transition-transform hover:scale-105"
                                        onClick={() => setMainImage(imageUrl)}
                                        onError={(e) => {
                                            e.currentTarget.src = "/images/placeholder-hotel.jpg";
                                        }}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
                                <span className="text-gray-500">No images available</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="content-detail lg:py-20 md:py-14 py-10">
                <div className="container">
                    <div className="flex flex-col lg:flex-row gap-y-10 justify-between">
                        <div className="content xl:w-2/3 lg:w-[60%] lg:pr-[15px] w-full">
                            
                            {/* Hotel Header */}
                            <div className="flex items-center justify-between gap-6">
                                <div className="heading3">{hotel.name}</div>
                                <div className="share w-12 h-12 rounded-full bg-white border border-outline flex-shrink-0 flex items-center justify-center cursor-pointer duration-300 hover:bg-black hover:text-white">
                                    <Icon.ShareNetwork className='text-2xl' />
                                </div>
                            </div>

                            {/* Location & Rating */}
                            <div className="flex items-center gap-4 flex-wrap gap-y-1 mt-2">
                                <div className="flex items-center gap-1.5">
                                    <Icon.MapPin className='text-variant1' />
                                    <span className='text-variant1 capitalize'>{hotel.address}</span>
                                </div>
                                {hotel.latitude && hotel.longitude && (
                                    <a 
                                        href={`http://maps.google.com/?q=${hotel.latitude},${hotel.longitude}`} 
                                        target='_blank' 
                                        rel='noopener noreferrer'
                                        className='text-primary underline'
                                    >
                                        Show on map
                                    </a>
                                )}
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mt-3">
                                <div className="flex items-center gap-1">
                                    <div className="text-lg font-semibold">{hotel.rating?.toFixed(1) || 'N/A'}</div>
                                    <Icon.Star className='text-yellow-400' weight='fill' />
                                </div>
                                {hotel.trustyou?.score?.overall && (
                                    <div className="text-variant1">
                                        TrustYou Score: {hotel.trustyou.score.overall}
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="desc lg:mt-10 mt-6 lg:pt-10 pt-6 border-t border-outline">
                                <div className="heading5">Description</div>
                                {hotel.description ? (
                                    <>
                                        <div className="body2 text-variant1 mt-3">
                                            {viewMoreDesc ? hotel.description : hotel.description.substring(0, 300)}
                                            {!viewMoreDesc && hotel.description.length > 300 && '...'}
                                        </div>
                                        {hotel.description.length > 300 && (
                                            <div
                                                className="text-button-sm underline inline-block duration-300 cursor-pointer mt-3 hover:text-primary"
                                                onClick={() => setViewMoreDesc(!viewMoreDesc)}
                                            >
                                                {viewMoreDesc ? 'Show less' : 'View More'}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="body2 text-variant1 mt-3">No description available</div>
                                )}
                            </div>

                            {/* Amenities */}
                            <div className="feature lg:mt-10 mt-6 lg:pt-10 pt-6 border-t border-outline">
                                <div className="heading5">Amenities and Features</div>
                                <div className="list w-full mt-4">
                                    {hotel.amenities_ratings && hotel.amenities_ratings.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {hotel.amenities_ratings.map((item: any, index: number) => (
                                                <div key={index} className="item">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="capitalize font-medium">{item.name}</span>
                                                        <span className="text-button font-semibold">{item.score}/100</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className="bg-primary h-2 rounded-full transition-all duration-300" 
                                                            style={{ width: `${item.score}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-variant1">No amenities information available</div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Date Picker */}
                            <div className="date lg:mt-10 mt-6 lg:pt-10 pt-6 border-t border-outline">
                                <div className="heading5">Dates & Availability</div>
                                <div className="relative">
                                    {/* Dropdown trigger: Check In / Check Out */}
                                    <div className="grid grid-cols-2 border border-outline rounded-lg cursor-pointer bg-white" onClick={handleOpenDate}>
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
                                    {/* Dropdown content: DateRangePicker */}
                                    <div className={`absolute left-0 w-full z-10 mt-2 ${openDate ? '' : 'hidden'}`} style={{ minWidth: '300px' }}>
                                        <DateRangePicker
                                            className="form-date-picker style-detail w-full border border-outline rounded-none open bg-white"
                                            onChange={item => setState([item.selection] as any)}
                                            moveRangeOnFirstSelection={false}
                                            months={2}
                                            ranges={state}
                                            direction="horizontal"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Map */}
                            {hotel.latitude && hotel.longitude && (
                                <div className="map lg:mt-10 mt-6 lg:pt-10 pt-6 border-t border-outline">
                                    <div className="heading5">Map</div>
                                    <div className="bg-img relative mt-3">
                                        <iframe
                                            className='w-full h-[360px]'
                                            src={`https://maps.google.com/maps?q=${hotel.latitude}, ${hotel.longitude}&hl=es&z=14&output=embed`}
                                            title={`Map of ${hotel.name}`}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="sidebar xl:w-1/3 lg:w-[40%] lg:pl-[45px] w-full">
                            <StickyBox offsetTop={100} offsetBottom={20}>
                                {/* Reservation Details */}
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

                                        {/* Guests */}
                                        <div className="guest px-5 py-4 relative cursor-pointer">
                                            <div className="flex items-center justify-between" onClick={handleOpenGuest}>
                                                <div>
                                                    <div className="flex items-center gap-1">
                                                        <Icon.Users className='text-xl' />
                                                        <div className="text-button">Guest</div>
                                                    </div>
                                                    <div className="body2 mt-1">{guest.adult} adults - {guest.children} children</div>
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
                                                    className="button-main w-full text-center mt-4"
                                                    onClick={() => setOpenGuest(false)}
                                                >
                                                    Done
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price Summary */}
                                    <div className="price-block mt-5">
                                        <div className="heading6">Price Summary</div>
                                        <div className="list mt-2">
                                            <div className="flex items-center justify-between">
                                                <div>${basePrice} x {nights} Nights</div>
                                                <div className="text-button">${basePrice * nights}</div>
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <div>Cleaning Fee</div>
                                                <div className="text-button">${cleaningFee}</div>
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <div>Services Fee</div>
                                                <div className="text-button">${serviceFee}</div>
                                            </div>
                                        </div>
                                        <div className="total-block mt-5 pt-5 border-t border-outline flex items-center justify-between">
                                            <div className="heading6">Total Before Taxes</div>
                                            <div className="heading5">${total}</div>
                                        </div>
                                        <div className="button-main w-full text-center mt-5">Book Now</div>
                                    </div>
                                </div>

                                {/* Why Book With Us */}
                                <div className="reservation bg-surface p-6 rounded-md md:mt-10 mt-6">
                                    <div className="heading6">Why Book With Us?</div>
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
    )
}

export default HotelDetailContent