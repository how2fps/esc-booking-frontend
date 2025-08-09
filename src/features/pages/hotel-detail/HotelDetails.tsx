'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react' // ✅ Added useMemo import
import { useParams } from "react-router-dom"
import { addDays } from 'date-fns'

import * as Icon from 'phosphor-react'
import { DateRangePicker } from 'react-date-range'
import StickyBox from 'react-sticky-box'
import { useNavigate } from 'react-router-dom';

// Components

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

type DateRange = {
    startDate: Date;
    endDate: Date;
    key: string;
};
const HotelDetailContent = () => {
    const { id } = useParams();
    const hotelId = id || '4PXS';

    const navigate = useNavigate();

    // Find the hotel from JSON data
    const hotel = hotelsData.find((h: any) => h.id === hotelId);

    // If no hotel found, show error
    if (!hotel) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Hotel not found!</h2>
                    <p>Hotel ID: {hotelId}</p>
                    <div className="mt-4 text-red-500">Page has failed to load. Please reload the page.</div>
                </div>
            </div>
        );
    }

    const [viewMoreDesc, setViewMoreDesc] = useState<boolean>(false)
    const [openDate, setOpenDate] = useState(false)
    const [openGuest, setOpenGuest] = useState(false)
    const [mainImage, setMainImage] = useState<string | null>(null)
    const [imageError, setImageError] = useState(false);
    const [roomCount, setRoomCount] = useState(1);
    const [state, setState] = useState<DateRange[]>([
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

    // Only display images that actually exist, fallback if none
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

    const [validImages, setValidImages] = useState<string[]>([]);

    useEffect(() => {
        let isMounted = true;
        const checkImages = async () => {
            const results: string[] = [];
            await Promise.all(
                image_array.map((url) =>
                    new Promise<void>((resolve) => {
                        const img = new window.Image();
                        img.src = url;
                        img.onload = () => {
                            if (isMounted) results.push(url);
                            resolve();
                        };
                        img.onerror = () => resolve();
                    })
                )
            );
            if (isMounted) {
                setValidImages(results.length > 0 ? results : ['/assets/cityhero.jpg']);
            }
        };
        checkImages();
        return () => { isMounted = false; };
    }, [image_array]);

    // Set main image after validImages is created
    useEffect(() => {
        const firstImage = validImages.length > 0
            ? validImages[0]
            : '/assets/cityhero.jpg';
        setMainImage(firstImage);
    }, [validImages]);

    const handleOpenDate = () => {
        setOpenDate(!openDate)
        setOpenGuest(false)
    }

    const handleOpenGuest = () => {
        setOpenGuest(!openGuest);
        setOpenDate(false);
    }

    // Check if the click event occurs outside the popup.
    const handleClickOutsideDatePopup: EventListener = useCallback((event) => {
        const targetElement = event.target as Element;
        // Only close if click is outside both the trigger and the dropdown
        if (
            openDate &&
            !targetElement.closest('.sidebar-date-trigger') &&
            !targetElement.closest('.sidebar-date-dropdown')
        ) {
            setOpenDate(false);
        }
    }, [openDate]);

    const handleClickOutsideGuestPopup: EventListener = useCallback((event) => {
        const targetElement = event.target as Element;
        if (
            openGuest &&
            !targetElement.closest('.sub-menu-guest') &&
            !targetElement.closest('.select-block')
        ) {
            setOpenGuest(false);
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
    const serviceTax = 0.19 * (basePrice * nights * roomCount);
    const total = (basePrice * nights * roomCount) + serviceTax;

    return (
        <div className='hotel-detail'>

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
                                setImageError(true);
                                e.currentTarget.src = "/images/placeholder-hotel.jpg";
                            }}
                        />
                        {imageError && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                                <span className="text-red-500 font-semibold">Images/Content has failed to load. Please reload the page.</span>
                            </div>
                        )}
                    </div>
                </div>
                {/* Thumbnail Grid */}
                <div className="w-full mt-6">
                    <div className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {validImages.length > 0 ? (
                            validImages.map((imageUrl, index) => (
                                <div key={index} className="aspect-[16/11] min-w-[120px] w-[120px] flex-shrink-0">
                                    <img
                                        src={imageUrl}
                                        alt={`Hotel Thumbnail ${index + 1}`}
                                        className="w-full h-full rounded-xl shadow-md object-cover cursor-pointer transition-transform hover:scale-105"
                                        onClick={() => setMainImage(imageUrl)}
                                        onError={(e) => {
                                            setImageError(true);
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
                                <h1 className="heading3" role="heading" aria-level={1}>{hotel.name}</h1>
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
                                        <div className="body2 text-variant1 mt-3 text-justify">
                                            {viewMoreDesc ? hotel.description : hotel.description.substring(0, 300)}
                                            {!viewMoreDesc && hotel.description.length > 300 && '...'}
                                        </div>
                                        {hotel.description.length > 300 && (
                                            <span
                                                className="text-button-sm underline inline-block duration-300 cursor-pointer mt-3 hover:text-primary"
                                                role="button"
                                                aria-label={viewMoreDesc ? 'Show less' : 'View More'}
                                                onClick={() => setViewMoreDesc(!viewMoreDesc)}
                                            >
                                                {viewMoreDesc ? 'Show less' : 'View More'}
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <div className="body2 text-variant1 mt-3 text-justify">No description available</div>
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


                            {/* Map */}
                            {hotel.latitude && hotel.longitude && (
                                <div className="map lg:mt-10 mt-6 lg:pt-10 pt-6 border-t border-outline">
                                    <div className="heading5">Map</div>
                                    <div className="bg-img relative mt-3">
                                        <iframe
                                            className='w-full h-[360px]'
                                            src={`https://maps.google.com/maps?q=${hotel.latitude}, ${hotel.longitude}&hl=en&z=14&output=embed`}
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
                                        <div className="relative">
                                            <div className="grid grid-cols-2 border-b border-outline sidebar-date-trigger">
                                                <div className="left pl-5 py-4 border-r border-outline cursor-pointer" onClick={handleOpenDate}>
                                                    <div className="flex items-center gap-1">
                                                        <Icon.CalendarBlank className='text-xl' />
                                                        <div className="text-button">Check In</div>
                                                    </div>
                                                    <div className="body2 mt-1">{state[0].startDate.toLocaleDateString()}</div>
                                                </div>
                                                <div className="left pr-5 py-4 cursor-pointer" onClick={handleOpenDate}>
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Icon.CalendarBlank className='text-xl' />
                                                        <div className="text-button">Check Out</div>
                                                    </div>
                                                    <div className="body2 mt-1 text-end">{state[0].endDate.toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            {/* Date Picker dropdown */}
                                            {openDate && (
                                                <div className="w-full mt-2 sidebar-date-dropdown">
                                                    <DateRangePicker
                                                        className="form-date-picker box-shadow open w-full border border-outline rounded-none bg-white"
                                                        onChange={item => {
                                                            const selection = item.selection;
                                                            if (selection.startDate && selection.endDate && selection.startDate <= selection.endDate) {
                                                                setState([
                                                                    {
                                                                        startDate: selection.startDate,
                                                                        endDate: selection.endDate,
                                                                        key: selection.key ?? 'selection',
                                                                    },
                                                                ]);
                                                            }
                                                        }}
                                                        moveRangeOnFirstSelection={false}
                                                        months={2}
                                                        ranges={state}
                                                        direction="horizontal"
                                                        minDate={new Date()}
                                                        showMonthAndYearPickers={true}
                                                        showDateDisplay={true}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Guests */}
                                        <div className="guest px-5 py-4 relative">
                                            <div className="flex items-center justify-between select-block w-full">
                                                <div
                                                    className="flex flex-col cursor-pointer"
                                                    style={{ minWidth: 0 }}
                                                    onClick={handleOpenGuest}
                                                    tabIndex={0}
                                                    role="button"
                                                    aria-label="Open guest dropdown"
                                                >
                                                    <div className="flex items-center gap-1">
                                                        <Icon.Users className='text-xl' />
                                                        <div className="text-button">Guest</div>
                                                    </div>
                                                    <div className="body2 mt-1 truncate">
                                                        {guest.adult > 0 ? (guest.adult === 1 ? guest.adult + " adult" : guest.adult + " adults") : "0 adults"}
                                                        {guest.children > 0 ? (guest.children === 1 ? " - " + guest.children + " child" : " - " + guest.children + " children") : " - 0 children"}
                                                    </div>
                                                </div>
                                                <span
                                                    className="cursor-pointer flex items-center"
                                                    onClick={handleOpenGuest}
                                                    tabIndex={0}
                                                    role="button"
                                                    aria-label="Open guest dropdown"
                                                >
                                                    <Icon.CaretDown className='text-2xl' />
                                                </span>
                                            </div>
                                            <div className={`sub-menu-guest bg-white rounded-b-xl overflow-hidden p-5 absolute top-full md:mt-5 mt-3 left-0 w-full box-shadow md:border-t border-outline ${openGuest ? "open" : ""}`}>
                                                <div className="item flex items-center justify-between pb-4 border-b border-outline">
                                                    <div className="left">
                                                        <p>Adults</p>
                                                        <div className="caption1 text-variant1">(12 Years+)</div>
                                                    </div>
                                                    <div className="right flex items-center gap-5">
                                                        <div
                                                            className={`minus w-8 h-8 flex items-center justify-center rounded-full border border-outline duration-300 ${guest.adult === 0 ? "opacity-[0.4] cursor-default" : "cursor-pointer hover:bg-black hover:text-white"}`}
                                                            role="button"
                                                            aria-label="Minus adult"
                                                            onClick={() => decreaseGuest("adult")}>
                                                            <Icon.Minus weight="bold" />
                                                        </div>
                                                        <div className="text-title">{guest.adult}</div>
                                                        <div
                                                            className="plus w-8 h-8 flex items-center justify-center rounded-full border border-outline cursor-pointer duration-300 hover:bg-black hover:text-white"
                                                            role="button"
                                                            aria-label="Plus adult"
                                                            onClick={() => increaseGuest("adult")}>
                                                            <Icon.Plus weight="bold" />
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
                                                            className={`minus w-8 h-8 flex items-center justify-center rounded-full border border-outline duration-300 ${guest.children === 0 ? "opacity-[0.4] cursor-default" : "cursor-pointer hover:bg-black hover:text-white"}`}
                                                            role="button"
                                                            aria-label="Minus child"
                                                            onClick={() => decreaseGuest("children")}>
                                                            <Icon.Minus weight="bold" />
                                                        </div>
                                                        <div className="text-title">{guest.children}</div>
                                                        <div
                                                            className="plus w-8 h-8 flex items-center justify-center rounded-full border border-outline cursor-pointer duration-300 hover:bg-black hover:text-white"
                                                            role="button"
                                                            aria-label="Plus child"
                                                            onClick={() => increaseGuest("children")}>
                                                            <Icon.Plus weight="bold" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className="button-main w-full text-center mt-4"
                                                    onClick={() => setOpenGuest(false)}>
                                                    Done
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    {/* Room Numbers */}
                                    <div className="room-numbers mt-5">
                                        <div className="flex items-center justify-between w-full">
                                            <div className="heading6">Number of Rooms</div>
                                            <div className="flex items-center gap-5">
                                                <div
                                                    className={`minus w-8 h-8 flex items-center justify-center rounded-full border border-outline duration-300 ${roomCount === 1 ? "opacity-[0.4] cursor-default" : "cursor-pointer hover:bg-black hover:text-white"}`}
                                                    role="button"
                                                    aria-label="Minus room"
                                                    onClick={() => roomCount > 1 && setRoomCount(roomCount - 1)}
                                                >
                                                    <Icon.Minus weight="bold" />
                                                </div>
                                                <div className="text-title">{roomCount}</div>
                                                <div
                                                    className="plus w-8 h-8 flex items-center justify-center rounded-full border border-outline cursor-pointer duration-300 hover:bg-black hover:text-white"
                                                    role="button"
                                                    aria-label="Plus room"
                                                    onClick={() => setRoomCount(roomCount + 1)}
                                                >
                                                    <Icon.Plus weight="bold" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price Summary */}
                                    <div className="price-block mt-5">
                                        <div className="heading6">Price Summary</div>
                                        <div className="list mt-2">
                                            <div className="flex items-center justify-between">
                                                <div>${basePrice} x {nights} Nights x {roomCount} Room{roomCount > 1 ? "s" : ""}</div>
                                                <div className="text-button">${basePrice * nights * roomCount}</div>
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <div>Service Tax</div>
                                                <div className="text-button">${serviceTax.toFixed(2)}</div>
                                            </div>
                                        </div>
                                        <div className="total-block mt-5 pt-5 border-t border-outline flex items-center justify-between">
                                            <div className="heading6">Total</div>
                                            <div className="heading5">${total.toFixed(2)}</div>
                                        </div>
                                        <div
                                            className="button-main w-full text-center mt-5 cursor-pointer"
                                            onClick={() =>
                                                navigate('/booking', {
                                                    state: {
                                                        hotelName: hotel.name,
                                                        hotelImage: mainImage,
                                                        roomType: "Double Room",
                                                        price: total.toFixed(2),
                                                        startDate: state[0].startDate.toISOString(),
                                                        endDate: state[0].endDate.toISOString(),
                                                        numberOfRooms: roomCount,
                                                        adults: guest.adult,
                                                        children: guest.children,
                                                    },
                                                })
                                            }
                                        >
                                            Book Now
                                        </div>
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
        </div>
    )
}

export default HotelDetailContent