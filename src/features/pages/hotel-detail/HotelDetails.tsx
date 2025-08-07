'use client'

import React, { useState, useEffect, useMemo,  useCallback } from 'react'
import { useParams, Link } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';
import * as Icon from 'phosphor-react'
import { DateRangePicker } from 'react-date-range'
import { addDays } from 'date-fns'
import StickyBox from 'react-sticky-box'
import type { Room } from "../../type/RoomType";
import type { Hotel } from "../../type/HotelType";

// Styles
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

interface GuestType {
    adult: number;
    children: number;
}

const HotelDetailContent = () => {
    const { id } = useParams();  
    const [searchParams] = useSearchParams();
    const destination_id = searchParams.get('destination_id');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    
    // Debug logging
    console.log('=== HOTEL DETAILS COMPONENT MOUNT ===');
    console.log('URL params:', { id });
    console.log('Search params:', { 
        destination_id, 
        checkIn, 
        checkOut,
        allParams: Object.fromEntries(searchParams.entries())
    });
    
    const [viewMoreDesc, setViewMoreDesc] = useState<boolean>(false)
    const [hotelDetails, setHotelDetails] = useState<Hotel | null>(null);
    const [roomDetails, setRoomDetails] = useState<Room[]>([]);
    const [roomsLoading, setRoomsLoading] = useState<boolean>(false);
    const [hotelLoading, setHotelLoading] = useState<boolean>(true);
    const [openDate, setOpenDate] = useState(false);
    const [openGuest, setOpenGuest] = useState(false);

    const [guest, setGuest] = useState<GuestType>({
        adult: 2,
        children: 0
    });
    
    const [state, setState] = useState([
        {
            startDate: checkIn ? new Date(checkIn) : new Date(),
            endDate: checkOut ? new Date(checkOut) : addDays(new Date(), 1),
            key: 'selection'
        }
    ]);

    const currentCheckIn = useMemo(() => {
        return state[0].startDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    }, [state]);

    const currentCheckOut = useMemo(() => {
        return state[0].endDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    }, [state]);

    const currentGuests = useMemo(() => {
        return guest.adult + guest.children;
    }, [guest]);

    const [mainImage, setMainImage] = useState<string | null>(null)

    useEffect(() => {
        const fetchHotelDetails = async () => {
            setHotelLoading(true);
            console.log('=== HOTEL DETAILS FETCH ===');
            console.log('Hotel ID:', id);
            
            try {
                const response = await fetch(`http://localhost:3000/api/hotels/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                
                console.log('Hotel API Response status:', response.status);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const hotelResult: Hotel = await response.json();
                console.log('Hotel data received:', hotelResult);
                setHotelDetails(hotelResult);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error("Hotel fetch error details:", {
                        name: error.name,
                        message: error.message,
                        stack: error.stack,
                    });
                }
                console.error("Something went wrong while loading hotels. Please try again later.");
            } finally {
                setHotelLoading(false);
            }
        };
        
        if (id) {
            fetchHotelDetails();
        } else {
            console.warn('No hotel ID provided');
            setHotelLoading(false);
        }
    }, [id]);

    useEffect(() => {
        const fetchRoomDetails = async () => {
            console.log('=== ROOM DETAILS FETCH ===');
            console.log('Params:', { destination_id, id, currentCheckIn, currentCheckOut, currentGuests });
            
            if (!destination_id || !id) {
                console.warn('Missing required parameters for room fetch:', { destination_id, id });
                return;
            }

            setRoomsLoading(true);

            try {
                const apiUrl = `http://localhost:3000/api/hotels/${id}/prices?destination_id=${destination_id}&checkin=${currentCheckIn}&checkout=${currentCheckOut}&lang=en_US&currency=SGD&country_code=SG&guests=${currentGuests}&partner_id=1089&landing_page=wl-acme-earn&product_type=earn`;
                console.log('Room API URL:', apiUrl);
                
                const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            console.log('Room API Response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const roomResult = await response.json();
            console.log('Room data received:', roomResult);
            
            if (roomResult.rooms && Array.isArray(roomResult.rooms)) {
                // Limit rooms for performance
                setRoomDetails(roomResult.rooms.slice(0, 20));
                console.log('Set room details:', roomResult.rooms.length, 'rooms');
            } else {
                console.warn('No rooms found in API response:', roomResult);
                setRoomDetails([]);
            }
            } catch (error: unknown) {
                if (error instanceof Error) {
                        console.error("Room fetch error details:", {
                                name: error.name,
                                message: error.message,
                                stack: error.stack,
                        });
                }
                console.error("Something went wrong while loading rooms. Please try again later.");
                setRoomDetails([]);
            } finally {
            setRoomsLoading(false); 
            }
        };
        
        // Only fetch if we have required parameters
        if (destination_id && id) {
            fetchRoomDetails();
        } else {
            console.log('Skipping room fetch - missing parameters:', { destination_id, id });
        }
    }, [destination_id, currentCheckIn, currentCheckOut, id, currentGuests]);

    // Image handling logic - optimized
    const image_array = useMemo(() => {
        if (!hotelDetails?.image_details) return ['/assets/Placeholder_Cat.png'];
        
        const prefix = hotelDetails?.image_details?.prefix || '';
        const count = Math.min(hotelDetails?.image_details?.count || 0, 10); // Limit to 10 images
        const suffix = hotelDetails?.image_details?.suffix || '.jpg';
        const images: string[] = [];

        for (let i = 0; i < count; i++) {
            images.push(`${prefix}${i}${suffix}`);
        }
    
        return images.length > 0 ? images : ['/assets/Placeholder_Cat.png'];
    }, [hotelDetails?.image_details]);

    // Set main image immediately without validation
    useEffect(() => {
        if (image_array.length > 0 && image_array[0] !== '/assets/Placeholder_Cat.png') {
            const defaultIndex = hotelDetails?.default_image_index || 0;
            const safeIndex = Math.min(defaultIndex, image_array.length - 1);
            setMainImage(image_array[safeIndex] || image_array[0]);
        } else {
            setMainImage('/assets/Placeholder_Cat.jpg');
        }
    }, [image_array, hotelDetails?.default_image_index]);

    const handleOpenDate = () => {
        setOpenDate(!openDate);
        setOpenGuest(false);
        }
    
    const handleOpenGuest = () => {
        setOpenGuest(!openGuest);
        setOpenDate(false);
    }

    // Check if the click event occurs outside the popup.
    const handleClickOutsideDatePopup = useCallback((event: Event) => {
        const targetElement = event.target as Element;
        if (
            openDate &&
            !targetElement.closest('.sidebar-date-trigger') &&
            !targetElement.closest('.sidebar-date-dropdown')
        ) {
            setOpenDate(false);
        }
    }, [openDate]);

    const handleClickOutsideGuestPopup = useCallback((event: Event) => {
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

    // Show loading state while hotel details are being fetched
    if (hotelLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Show error state if hotel details failed to load
    if (!hotelDetails) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="text-red-600 text-lg mb-4">Failed to load hotel details</div>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

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
                            src={mainImage || "/assets/Placeholder_Cat.jpg"}
                            alt="Main Hotel View"
                            className="w-full h-full object-cover rounded-xl"
                            style={{ width: '100%', height: '100%' }}
                            onError={(e) => {
                                e.currentTarget.src = "/assets/Placeholder_Cat.jpg";
                            }}
                        />
                    </div>
                </div>

                {/* Thumbnail Grid */}
                <div className="w-full mt-6">
                    <div className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {image_array.length > 0 && image_array[0] !== '/assets/Placeholder_Cat.png' ? (
                            image_array.map((imageUrl: string, index: number) => (
                                <div key={index} className="aspect-[16/11] min-w-[120px] w-[120px] flex-shrink-0">
                                    <img
                                        src={imageUrl}
                                        alt={`Hotel Thumbnail ${index + 1}`}
                                        className="w-full h-full rounded-xl shadow-md object-cover cursor-pointer transition-transform hover:scale-105"
                                        onClick={() => setMainImage(imageUrl)}
                                        onError={(e) => {
                                            e.currentTarget.src = "/assets/Placeholder_Cat.jpg";
                                        }}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl p-4">
                                <span className="text-gray-500">No images available</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Hotel Details Section */}
            <div className="content-detail lg:py-20 md:py-14 py-10">
                <div className="container">
                    <div className="flex flex-col lg:flex-row gap-y-10 justify-between">
                        <div className="content xl:w-2/3 lg:w-[60%] lg:pr-[15px] w-full">
                            
                            {/* Hotel Header */}
                            <div className="flex items-center justify-between gap-6">
                                <h1 className="heading3" role="heading" aria-level={1}>{hotelDetails?.name}</h1>
                                <div className="share w-12 h-12 rounded-full bg-white border border-outline flex-shrink-0 flex items-center justify-center cursor-pointer duration-300 hover:bg-black hover:text-white">
                                    <Icon.ShareNetwork className='text-2xl' />
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-4 flex-wrap gap-y-1 mt-2">
                                <div className="flex items-center gap-1.5">
                                    <Icon.MapPin className='text-variant1' />
                                    <span className='text-variant1 capitalize'>{hotelDetails?.address}</span>
                                </div>
                                {hotelDetails?.latitude && hotelDetails?.longitude && (
                                    <a 
                                        href={`http://maps.google.com/?q=${hotelDetails?.latitude},${hotelDetails?.longitude}`} 
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
                                    <div className="text-lg font-semibold">{hotelDetails?.rating?.toFixed(1) || 'N/A'}</div>
                                    <Icon.Star className='text-yellow-400' weight='fill' />
                                </div>
                                {hotelDetails?.trustyou?.score?.overall && (
                                    <div className="text-variant1">
                                        TrustYou Score: {hotelDetails?.trustyou.score.overall}
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="desc lg:mt-10 mt-6 lg:pt-10 pt-6 border-t border-outline">
                                <div className="heading5">Description</div>
                                {hotelDetails?.description ? (
                                    <>
                                        <div className="body2 text-variant1 mt-3 text-justify">
                                            {viewMoreDesc ? hotelDetails?.description : hotelDetails?.description.substring(0, 300)}
                                            {!viewMoreDesc && hotelDetails.description.length > 300 && '...'}
                                        </div>
                                        {hotelDetails.description.length > 300 && (
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
                                    {hotelDetails?.amenities_ratings && hotelDetails?.amenities_ratings.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {hotelDetails?.amenities_ratings.map((item: any, index: number) => (
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

                            {/* Rooms */}
                            <div className="rooms lg:mt-10 mt-6 lg:pt-10 pt-6 border-t border-outline">
                                <div className="heading5">
                                    Available Rooms ({roomDetails.length})
                                    {roomsLoading && (
                                        <span className="text-sm text-gray-500 ml-2">
                                            (Updating for {currentCheckIn} to {currentCheckOut}...)
                                        </span>
                                    )}
                                </div>
                                
                                {roomsLoading ? (
                                    <div className="flex justify-center items-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                                        <span>Loading rooms for selected dates...</span>
                                    </div>
                                ) : roomDetails.length > 0 ? (
                                    <div className="overflow-x-auto pb-4 mt-4">
                                        <div className="flex gap-4" style={{ width: 'max-content' }}>
                                            {roomDetails.map((room, index) => (
                                                <div key={room.key || index} className="room-card bg-white border border-gray-200 rounded-lg p-4 min-w-[300px] flex-shrink-0">
                                                    <div className="room-image mb-4">
                                                        <img
                                                            src={room.images?.find(img => img.hero_image)?.high_resolution_url || '/assets/Placeholder_Cat.jpg'}
                                                            alt={room.roomNormalizedDescription}
                                                            className="w-full h-48 object-cover rounded-lg"
                                                            onError={(e) => {
                                                                e.currentTarget.src = "/assets/default-room.jpg";
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="room-details">
                                                        <h3 className="text-lg font-semibold mb-2">
                                                            {room.roomNormalizedDescription}
                                                        </h3>
                                                        <div className="pricing-section">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div>
                                                                    <div className="text-xl font-bold">
                                                                        SGD {room.converted_price?.toLocaleString()}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">per night</div>
                                                                </div>
                                                                <div className="text-right text-sm">
                                                                    <div className="text-gray-600">
                                                                        {room.rooms_available} left
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <Link 
                                                                to={`/hotels/${id}/rooms/${room.key}?destination_id=${destination_id}&checkin=${currentCheckIn}&checkout=${currentCheckOut}&guests=${guest.adult + guest.children}`}
                                                                className="block w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition-colors text-center"
                                                                aria-label={`Book ${room.roomNormalizedDescription}`}
                                                            >
                                                                Book Now
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        No rooms available for the selected dates
                                    </div>
                                )}
                            </div>

                            {/* Map */}
                            {hotelDetails?.latitude && hotelDetails?.longitude && (
                                <div className="map lg:mt-10 mt-6 lg:pt-10 pt-6 border-t border-outline">
                                    <div className="heading5">Map</div>
                                    <div className="bg-img relative mt-3">
                                        <iframe
                                            className='w-full h-[360px]'
                                            src={`https://maps.google.com/maps?q=${hotelDetails?.latitude}, ${hotelDetails?.longitude}&hl=en&z=14&output=embed`}
                                            title={`Map of ${hotelDetails?.name}`}
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
                                                <div className="absolute top-full left-0 w-full mt-2 sidebar-date-dropdown z-50">
                                                    <DateRangePicker
                                                        className="form-date-picker box-shadow open w-full border border-outline rounded-none bg-white"
                                                        onChange={item => {
                                                            const selection = item.selection;
                                                            if (selection && selection.startDate && selection.endDate && selection.startDate <= selection.endDate) {
                                                                setState([{
                                                                    startDate: selection.startDate,
                                                                    endDate: selection.endDate,
                                                                    key: 'selection'
                                                                }]);
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
                                                    <Icon.CaretDown className='text-2xl'/>
                                                </span>
                                            </div>
                                            <div className={`sub-menu-guest bg-white rounded-b-xl overflow-hidden p-5 absolute top-full md:mt-5 mt-3 left-0 w-full box-shadow md:border-t border-outline z-50 ${openGuest ? "block" : "hidden"}`}>
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