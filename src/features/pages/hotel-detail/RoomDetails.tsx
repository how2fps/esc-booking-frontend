'use client'

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useParams, Link, useNavigate } from "react-router-dom";
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
type DateRange = {
  startDate?: Date;
  endDate?: Date;
  key: string;
};

const RoomDetailContent = () => {
    const { id } = useParams();  
    const { roomKey } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const destination_id = searchParams.get('destination_id');
    const checkIn = searchParams.get('checkin'); // Note: your URL uses 'checkin' not 'checkIn'
    const checkOut = searchParams.get('checkout'); // Note: your URL uses 'checkout' not 'checkOut'
    
    // Debug logging
    console.log('=== ROOM DETAILS PAGE PARAMS ===');
    console.log('URL params:', { id, roomKey });
    console.log('Search params:', { 
        destination_id, 
        checkIn, 
        checkOut,
        allParams: Object.fromEntries(searchParams.entries())
    });
    console.log('Current URL:', window.location.href);
    
    const [viewMoreDesc, setViewMoreDesc] = useState<boolean>(false)
    const [viewMoreAmenities, setViewMoreAmenities] = useState<boolean>(false)
    const [hotelDetails, setHotelDetails] = useState<Hotel | null>(null);
    const [roomDetail, setRoomDetail] = useState<Room | null>(null);
    const [hotelLoading, setHotelLoading] = useState<boolean>(true);
    const [roomLoading, setRoomLoading] = useState<boolean>(true);
    const [openDate, setOpenDate] = useState(false);
    const [openGuest, setOpenGuest] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState<'SGD' | 'USD'>('SGD');
    const [roomQuantity, setRoomQuantity] = useState<number>(1);
    const [retryTrigger, setRetryTrigger] = useState<number>(0);
    const [roomName, setRoomName] = useState<string>(''); // Store room name for error messages

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

    // Calculate number of nights
    const numberOfNights = useMemo(() => {
        const checkInDate = new Date(state[0].startDate);
        const checkOutDate = new Date(state[0].endDate);
        const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
        const nights = Math.ceil(timeDifference / (1000 * 3600 * 24));
        return Math.max(1, nights); // Ensure at least 1 night
    }, [state]);

    // Price calculations using API values directly
    const priceCalculations = useMemo(() => {
        if (!roomDetail) return null;

        // Get values directly from API response
        const baseRateSGD = roomDetail.base_rate_in_currency || 0;
        const baseRateUSD = roomDetail.base_rate || 0;
        const taxesAndFeesSGD = roomDetail.included_taxes_and_fees_total_in_currency || 0;
        const taxesAndFeesUSD = roomDetail.included_taxes_and_fees_total || 0;
        const additionalFeesSGD = roomDetail.excluded_taxes_and_fees_total_in_currency || 0;
        const additionalFeesUSD = roomDetail.excluded_taxes_and_fees_total || 0;

        // Calculate per room per night prices (API already provides per-night rates)
        const perRoomPerNightSGD = baseRateSGD + taxesAndFeesSGD + additionalFeesSGD;
        const perRoomPerNightUSD = baseRateUSD + taxesAndFeesUSD + additionalFeesUSD;

        return {
            baseRateSGD,
            baseRateUSD,
            taxesAndFeesSGD,
            taxesAndFeesUSD,
            additionalFeesSGD,
            additionalFeesUSD,
            perRoomPerNightSGD,
            perRoomPerNightUSD,
            totalSGD: perRoomPerNightSGD * roomQuantity * numberOfNights,
            totalUSD: perRoomPerNightUSD * roomQuantity * numberOfNights
        };
    }, [roomDetail, roomQuantity, numberOfNights]);

    const [mainImage, setMainImage] = useState<string | null>(null)

    // Extract room name from room key for better error messages
    useEffect(() => {
        if (roomKey) {
            try {
                // Try to decode the room key and extract room name
                const decodedKey = decodeURIComponent(roomKey);
                
                // Many room keys contain room name information
                // Look for patterns like room names in the key
                const roomNameMatch = decodedKey.match(/room[_-]?name[_-]?([^&|_-]+)/i) ||
                                    decodedKey.match(/([A-Za-z\s]+(?:room|suite|king|queen|double|single|deluxe|standard|premium))/i) ||
                                    decodedKey.match(/^([A-Za-z\s]+)/);
                
                if (roomNameMatch && roomNameMatch[1]) {
                    const extractedName = roomNameMatch[1]
                        .replace(/[_-]/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim();
                    setRoomName(extractedName);
                } else {
                    // Fallback: use a cleaned version of the room key
                    const cleanedKey = decodedKey
                        .replace(/[^A-Za-z\s]/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim()
                        .substring(0, 50); // Limit length
                    setRoomName(cleanedKey || 'Unknown Room');
                }
            } catch (error) {
                console.error('Error extracting room name from key:', error);
                setRoomName('Unknown Room');
            }
        }
    }, [roomKey]);

    useEffect(() => {
        const fetchHotelDetails = async () => {
            setHotelLoading(true);
            try {
                const response = await fetch(`http://18.138.130.229:3000/api/hotels/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const hotelResult: Hotel = await response.json();
            setHotelDetails(hotelResult);
            } catch (error: unknown) {
                if (error instanceof Error) {
                        console.error("Fetch error details:", {
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
        fetchHotelDetails();
    }, [id]);
    

    useEffect(() => {
        const fetchRoomDetails = async () => {
            // Reset states
            setRoomLoading(true);
            setRoomDetail(null);
            
            // Validate required parameters
            if (!id || !roomKey || !destination_id) {
                console.warn('Missing required parameters:', { id, roomKey, destination_id });
                setRoomLoading(false);
                return;
            }

            console.log('=== ROOM DETAILS FETCH ===');
            console.log('Parameters:', { id, roomKey, destination_id, currentCheckIn, currentCheckOut, currentGuests });

            const maxAttempts = 3;
            const delayBetweenAttempts = 1500; // 1.5 seconds
            
            const apiUrl = `http://18.138.130.229:3000/api/hotels/${id}/prices?destination_id=${destination_id}&checkin=${currentCheckIn}&checkout=${currentCheckOut}&lang=en_US&currency=SGD&country_code=SG&guests=${currentGuests}&partner_id=1089&landing_page=wl-acme-earn&product_type=earn`;

            for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                try {
                    console.log(`🔄 Room data attempt ${attempt}/${maxAttempts}`);
                    
                    const response = await fetch(apiUrl, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" }
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    
                    const roomResult = await response.json();
                    
                    // Check if the API has completed processing and has rooms
                    if (roomResult.completed && roomResult.rooms && Array.isArray(roomResult.rooms)) {
                        console.log(`✅ Room data completed on attempt ${attempt}`);
                        
                        // Find the specific room using both original and decoded keys
                        let specificRoom = roomResult.rooms.find((room: Room) => room.key === roomKey);
                        
                        if (!specificRoom) {
                            const decodedRoomKey = decodeURIComponent(roomKey);
                            specificRoom = roomResult.rooms.find((room: Room) => room.key === decodedRoomKey);
                        }
                        
                        if (specificRoom) {
                            console.log('✅ Room found:', specificRoom.roomNormalizedDescription);
                            setRoomDetail(specificRoom);
                            // Update room name with the actual room name from API
                            if (specificRoom.roomNormalizedDescription) {
                                setRoomName(specificRoom.roomNormalizedDescription);
                            }
                            setRoomLoading(false);
                            return; // Success - exit function
                        } else {
                            console.log('❌ Room not found in completed data');
                            // Try to get room name from any room in the response for better error message
                            const firstRoom = roomResult.rooms[0];
                            if (firstRoom?.roomNormalizedDescription && !roomName) {
                                // Use the first room's type as a reference if we haven't set a name yet
                                setRoomName(`${firstRoom.roomNormalizedDescription} (or similar)`);
                            }
                            // If data is complete but room not found, no point in retrying
                            setRoomDetail(null);
                            setRoomLoading(false);
                            return;
                        }
                    } else {
                        console.log(`⏳ Attempt ${attempt}: Data not ready yet...`);
                    }
                    
                } catch (error: unknown) {
                    console.error(`❌ Attempt ${attempt} failed:`, error);
                }
                
                // Wait before next attempt (except after last attempt)
                if (attempt < maxAttempts) {
                    await new Promise(resolve => setTimeout(resolve, delayBetweenAttempts));
                }
            }
            
            // All attempts failed
            console.error(`❌ Room data unsuccessful after ${maxAttempts} attempts`);
            setRoomDetail(null);
            setRoomLoading(false);
        };

        fetchRoomDetails();
    }, [destination_id, currentCheckIn, currentCheckOut, id, currentGuests, roomKey, retryTrigger]);

    // Image handling logic - optimized
    const image_array = useMemo(() => {
        try {
            if (roomDetail?.images && Array.isArray(roomDetail.images) && roomDetail.images.length > 0) {
                // Limit to max 10 images for performance and filter out invalid images
                return roomDetail.images
                    .filter(img => img && img.high_resolution_url)
                    .slice(0, 10)
                    .map(img => img.high_resolution_url);
            }
            return ['/assets/Placeholder_Cat.png'];
        } catch (error) {
            console.error('Error processing room images:', error);
            return ['/assets/Placeholder_Cat.png'];
        }
    }, [roomDetail?.images]);

    // Set main image immediately without pre-validation
    useEffect(() => {
        try {
            if (roomDetail?.images && Array.isArray(roomDetail.images) && roomDetail.images.length > 0) {
                const heroImage = roomDetail.images.find(img => img && img.hero_image);
                if (heroImage?.high_resolution_url) {
                    setMainImage(heroImage.high_resolution_url);
                } else if (roomDetail.images[0]?.high_resolution_url) {
                    setMainImage(roomDetail.images[0].high_resolution_url);
                } else {
                    setMainImage('/assets/Placeholder_Cat.png');
                }
            } else {
                setMainImage('/assets/Placeholder_Cat.png');
            }
        } catch (error) {
            console.error('Error setting main image:', error);
            setMainImage('/assets/Placeholder_Cat.png');
        }
    }, [roomDetail?.images]);

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

    // Add loading states
    if (hotelLoading || roomLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
                    <div className="text-lg font-semibold mb-2">
                        {hotelLoading ? 'Loading hotel information...' : 'Finding your room...'}
                    </div>
                    <div className="text-gray-600">
                        {roomLoading && !hotelLoading && 'This may take a moment while we fetch the latest room availability and pricing.'}
                    </div>
                </div>
            </div>
        );
    }

    if (!roomDetail) {
        return (
            <div className="container mt-10 text-center">
                <div className="text-gray-600 text-lg mb-4">
                    {roomName ? `"${roomName}" is not available` : 'Room not found'}
                </div>
                <div className="text-sm text-gray-500 mb-2">
                    {roomName ? `Room: ${roomName}` : `Room key: ${roomKey}`}
                </div>
                <div className="text-sm text-gray-500 mb-4">
                    We couldn't find this room. This might happen if:
                </div>
                <ul className="text-sm text-gray-500 mb-6 list-disc list-inside">
                    <li>The room is no longer available for your selected dates</li>
                    <li>The room has been booked by another guest</li>
                    <li>The pricing has changed since your search</li>
                    <li>There was an error processing the request</li>
                </ul>
                <div className="space-y-3">
                    <Link 
                        to={`/hotels/${id}?destination_id=${destination_id}&checkin=${checkIn}&checkout=${checkOut}&guests=${currentGuests}`} 
                        className="inline-block bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition-colors"
                    >
                        View All Available Rooms
                    </Link>
                    <div>
                        <button 
                            onClick={() => setRetryTrigger(prev => prev + 1)} 
                            className="text-primary underline hover:no-underline"
                        >
                            Try Again
                        </button>
                    </div>
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
                            image_array.map((imageUrl, index) => (
                                <div key={index} className="aspect-[16/11] min-w-[120px] w-[120px] flex-shrink-0">
                                    <img
                                        src={imageUrl}
                                        alt={`Room Image ${index + 1}`}
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
                            
                            {/* Room Header */}
                            <div className="flex items-center justify-between gap-6">
                                <h1 className="heading3" role="heading" aria-level={1}>
                                    {roomDetail?.roomNormalizedDescription || hotelDetails?.name}
                                </h1>
                                <div className="share w-12 h-12 rounded-full bg-white border border-outline flex-shrink-0 flex items-center justify-center cursor-pointer duration-300 hover:bg-black hover:text-white">
                                    <Icon.ShareNetwork className='text-2xl' />
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-4 flex-wrap gap-y-1 mt-2">
                                <div className="flex items-center gap-1.5">
                                    <Icon.MapPin className='text-variant1' />
                                    <span className='text-variant1 capitalize'>{hotelDetails?.name}, {hotelDetails?.address}</span>
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

                            {/* Refundable */}
                            <div className="flex items-center gap-2 mt-3">
                                <div className="flex items-center gap-1">
                                    <div className="text-lg font-semibold">{hotelDetails?.rating?.toFixed(1) || 'N/A'}</div>
                                    <Icon.Star className='text-yellow-400' weight='fill' />
                                </div>
                                {roomDetail?.free_cancellation !== undefined && (
                                    <div className={`flex items-center gap-1 ${roomDetail.free_cancellation ? 'text-green-600' : 'text-red-600'}`}>
                                        {roomDetail.free_cancellation ? (
                                            <Icon.CheckCircle className="text-lg text-green-600" weight='fill' />
                                        ) : (
                                            <Icon.XCircle className="text-lg text-red-600" weight='fill' />
                                        )}
                                        <span className="font-medium">
                                            {roomDetail.free_cancellation ? 'Free Cancellation' : 'Non-refundable'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="desc lg:mt-10 mt-6 lg:pt-10 pt-6 border-t border-outline">
                                <div className="heading5 text-left">Room Description</div>
                                {roomDetail?.long_description ? (
                                    <>
                                        <div className="body2 text-variant1 mt-3 text-left">
                                            <div dangerouslySetInnerHTML={{ 
                                                __html: viewMoreDesc 
                                                    ? roomDetail.long_description 
                                                    : roomDetail.long_description.substring(0, 300) + (roomDetail.long_description.length > 300 ? '...' : '')
                                            }} />
                                        </div>
                                        {roomDetail.long_description.length > 300 && (
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
                                ) : roomDetail?.description ? (
                                    <div className="body2 text-variant1 mt-3 text-left">
                                        {roomDetail.description}
                                    </div>
                                ) : (
                                    <div className="body2 text-variant1 mt-3 text-left">No description available</div>
                                )}
                            </div>

                            {/* Room Amenities */}
                            <div className="feature lg:mt-10 mt-6 lg:pt-10 pt-6 border-t border-outline">
                                <div className="heading5 text-left">Room Amenities</div>
                                <div className="list w-full mt-4">
                                    {roomDetail?.amenities && roomDetail?.amenities.length > 0 ? (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {(viewMoreAmenities ? roomDetail.amenities : roomDetail.amenities.slice(0, 9)).map((amenity: string, index: number) => (
                                                    <div key={index} className="item flex items-start gap-2">
                                                        <Icon.Check className="text-primary text-lg flex-shrink-0 mt-0.5" weight="bold" />
                                                        <span className="body2 text-variant1 text-left">{amenity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            {roomDetail.amenities.length > 9 && (
                                                <span
                                                    className="text-button-sm underline inline-block duration-300 cursor-pointer mt-3 hover:text-primary"
                                                    role="button"
                                                    aria-label={viewMoreAmenities ? 'Show less amenities' : 'View More amenities'}
                                                    onClick={() => setViewMoreAmenities(!viewMoreAmenities)}
                                                >
                                                    {viewMoreAmenities ? 'Show less' : `View More (${roomDetail.amenities.length - 9} more)`}
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-variant1">No amenities information available</div>
                                    )}
                                </div>
                            </div>

                            {/* Additional Room Information */}
                            {roomDetail?.roomAdditionalInfo?.displayFields && (
                                <div className="additional-info lg:mt-10 mt-6 lg:pt-10 pt-6 border-t border-outline">
                                    <div className="heading5 text-left">Additional Information</div>
                                    
                                    {/* Special Check-in Instructions */}
                                    {roomDetail.roomAdditionalInfo.displayFields.special_check_in_instructions && (
                                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg mt-4">
                                            <h5 className="font-medium text-green-800 mb-2 flex items-center">
                                                <Icon.Info className="mr-2" />
                                                Special Check-in Instructions
                                            </h5>
                                            <div className="text-green-700 text-justify">
                                                {roomDetail.roomAdditionalInfo.displayFields.special_check_in_instructions}
                                            </div>
                                        </div>
                                    )}

                                    {/* Breakfast Information */}
                                    {roomDetail.roomAdditionalInfo.breakfastInfo && (
                                        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                            <h5 className="font-medium text-orange-800 mb-2 flex items-center">
                                                <Icon.Coffee className="mr-2" />
                                                Breakfast Information
                                            </h5>
                                            <div className="text-orange-700 capitalize text-justify">
                                                {roomDetail.roomAdditionalInfo.breakfastInfo.replace(/_/g, ' ')}
                                            </div>
                                        </div>
                                    )}

                                    {/* Check-in Instructions */}
                                    <div className="grid grid-cols-1 gap-6">
                                        {roomDetail.roomAdditionalInfo.displayFields.check_in_instructions && (
                                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                                <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                                                    <Icon.ClipboardText className="mr-2" />
                                                    Check-in Instructions
                                                </h5>
                                                <div 
                                                    className="text-gray-700 text-justify" 
                                                    dangerouslySetInnerHTML={{ 
                                                        __html: roomDetail.roomAdditionalInfo.displayFields.check_in_instructions 
                                                    }} 
                                                />
                                            </div>
                                        )}

                                        {roomDetail.roomAdditionalInfo.displayFields.fees_optional && (
                                            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                                                <h5 className="font-medium text-purple-800 mb-2 flex items-center">
                                                    <Icon.Money className="mr-2" />
                                                    Optional Fees
                                                </h5>
                                                <div 
                                                    className="text-purple-700 text-justify" 
                                                    dangerouslySetInnerHTML={{ 
                                                        __html: roomDetail.roomAdditionalInfo.displayFields.fees_optional 
                                                    }} 
                                                />
                                            </div>
                                        )}

                                        {roomDetail.roomAdditionalInfo.displayFields.know_before_you_go && (
                                            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                                                <h5 className="font-medium text-indigo-800 mb-2 flex items-center">
                                                    <Icon.Lightbulb className="mr-2" />
                                                    Know Before You Go
                                                </h5>
                                                <div 
                                                    className="text-indigo-700 text-justify" 
                                                    dangerouslySetInnerHTML={{ 
                                                        __html: roomDetail.roomAdditionalInfo.displayFields.know_before_you_go 
                                                    }} 
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Map */}
                            {hotelDetails?.latitude && hotelDetails?.longitude && (
                                <div className="map lg:mt-10 mt-6 lg:pt-10 pt-6 border-t border-outline">
                                    <div className="heading5 text-left">Map</div>
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

                                {/* Points & Bonuses */}
                                {roomDetail && (roomDetail.points > 0 || roomDetail.bonuses > 0) && (
                                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                                        <div className="text-sm font-medium text-green-800 mb-2">Rewards</div>
                                        {roomDetail.points > 0 && (
                                            <div className="flex items-center justify-between text-green-700">
                                                <span className="flex items-center gap-1">
                                                    <Icon.Star className="text-sm" weight="fill" />
                                                    Points Earned
                                                </span>
                                                <span className="font-medium">{roomDetail.points?.toLocaleString()}</span>
                                            </div>
                                        )}
                                        {roomDetail.bonuses > 0 && (
                                            <div className="flex items-center justify-between text-green-700 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Icon.Gift className="text-sm" weight="fill" />
                                                    Bonus
                                                </span>
                                                <span className="font-medium">{roomDetail.bonuses?.toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Reservation Details */}
                                <div className="reservation bg-surface p-6 rounded-md border border-outline mt-8">
                                    <div className="heading4">Reservation</div>
                                    
                                    {/* Date Selection */}
                                    <div className="date-sidebar-detail bg-white border border-outline rounded-lg">
                                        {/* Room Information */}
                                        {roomDetail && (
                                            <div className="guest px-5 py-4 relative border-b border-outline">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1">
                                                        <Icon.Info className='text-xl' />
                                                        <div className="text-button">Availability:</div>
                                                    </div>
                                                    <div className="body2 text-green-600 font-medium">
                                                        {roomDetail.rooms_available} rooms left
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="relative">
                                            <div className="grid grid-cols-2 border-b border-outline sidebar-date-trigger">
                                                <div className="left pl-5 py-4 border-r border-outline cursor-pointer" onClick={handleOpenDate}>
                                                    <div className="flex items-center gap-1">
                                                        <Icon.CalendarBlank className='text-xl' />
                                                        <div className="text-button">Check In</div>
                                                    </div>
                                                    <div className="body2 mt-1">{state[0].startDate ? state[0].startDate.toLocaleDateString() : ''}</div>
                                                </div>
                                                <div className="left pr-5 py-4 cursor-pointer" onClick={handleOpenDate}>
                                                    <div className="flex items-center gap-1">
                                                        <Icon.CalendarBlank className='text-xl' />
                                                        <div className="text-button">Check Out</div>
                                                    </div>
                                                    <div className="body2 mt-1">{state[0].endDate.toLocaleDateString()}</div>
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

                                        {/* Room Quantity Selector */}
                                        {roomDetail && (
                                            <div className="guest px-5 py-4 relative border-t border-outline">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1">
                                                        <Icon.Buildings className='text-xl' />
                                                        <div className="text-button">Rooms:</div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`minus w-8 h-8 flex items-center justify-center rounded-full border border-outline duration-300 ${roomQuantity === 1 ? "opacity-[0.4] cursor-default" : "cursor-pointer hover:bg-black hover:text-white"}`}
                                                            onClick={() => roomQuantity > 1 && setRoomQuantity(roomQuantity - 1)}
                                                            role="button"
                                                            aria-label="Decrease room quantity"
                                                        >
                                                            <Icon.Minus weight="bold" />
                                                        </div>
                                                        <div className="text-title min-w-[24px] text-center">{roomQuantity}</div>
                                                        <div
                                                            className={`plus w-8 h-8 flex items-center justify-center rounded-full border border-outline duration-300 ${roomQuantity >= (roomDetail.rooms_available || 1) ? "opacity-[0.4] cursor-default" : "cursor-pointer hover:bg-black hover:text-white"}`}
                                                            onClick={() => roomQuantity < (roomDetail.rooms_available || 1) && setRoomQuantity(roomQuantity + 1)}
                                                            role="button"
                                                            aria-label="Increase room quantity"
                                                        >
                                                            <Icon.Plus weight="bold" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Booking Summary */}
                                    {roomDetail && (
                                        <div className="mt-6 bg-white p-6 rounded-md border border-outline">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="heading6 text-left">Booking Summary</div>
                                                {/* Currency Toggle */}
                                                <div className="flex items-center bg-white rounded-lg p-1 border border-outline shadow-sm">
                                                    <button
                                                        className={`px-4 py-2 text-sm rounded-md transition-all duration-200 ease-in-out ${
                                                            selectedCurrency === 'SGD' 
                                                                ? 'bg-primary text-white shadow-sm transform scale-105' 
                                                                : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                                                        }`}
                                                        onClick={() => setSelectedCurrency('SGD')}
                                                    >
                                                        SGD
                                                    </button>
                                                    <button
                                                        className={`px-4 py-2 text-sm rounded-md transition-all duration-200 ease-in-out ${
                                                            selectedCurrency === 'USD' 
                                                                ? 'bg-primary text-white shadow-sm transform scale-105' 
                                                                : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                                                        }`}
                                                        onClick={() => setSelectedCurrency('USD')}
                                                    >
                                                        USD
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Price Breakdown */}
                                            <div className="p-4 bg-gray-50 rounded-lg transition-all duration-300 ease-in-out">
                                                <div className="text-sm font-medium text-gray-800 mb-3">Price Breakdown</div>
                                                {priceCalculations && (
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex items-center justify-between transition-all duration-200">
                                                            <span className="text-gray-600 text-left">Base Rate</span>
                                                            <span className="font-medium">
                                                                {selectedCurrency === 'SGD' 
                                                                    ? `SGD ${priceCalculations.baseRateSGD.toFixed(2)}` 
                                                                    : `USD ${priceCalculations.baseRateUSD.toFixed(2)}`
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between transition-all duration-200">
                                                            <span className="text-gray-600 text-left">Taxes & Fees</span>
                                                            <span className="font-medium">
                                                                {selectedCurrency === 'SGD' 
                                                                    ? `SGD ${priceCalculations.taxesAndFeesSGD.toFixed(2)}` 
                                                                    : `USD ${priceCalculations.taxesAndFeesUSD.toFixed(2)}`
                                                                }
                                                            </span>
                                                        </div>
                                                        {((selectedCurrency === 'SGD' && priceCalculations.additionalFeesSGD > 0) || 
                                                          (selectedCurrency === 'USD' && priceCalculations.additionalFeesUSD > 0)) && (
                                                            <div className="flex items-center justify-between text-red-600 transition-all duration-200">
                                                                <span>Additional Fees (per room/night)</span>
                                                                <span className="font-medium">
                                                                    {selectedCurrency === 'SGD' 
                                                                        ? `SGD ${priceCalculations.additionalFeesSGD.toFixed(2)}` 
                                                                        : `USD ${priceCalculations.additionalFeesUSD.toFixed(2)}`
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                        
                                                        <div className="border-t border-gray-300 pt-2 mt-2">
                                                            <div className="flex items-center justify-between font-medium transition-all duration-200">
                                                                <span>Subtotal per room/night</span>
                                                                <span>
                                                                    {selectedCurrency === 'SGD' 
                                                                        ? `SGD ${priceCalculations.perRoomPerNightSGD.toFixed(2)}` 
                                                                        : `USD ${priceCalculations.perRoomPerNightUSD.toFixed(2)}`
                                                                    }
                                                                </span>
                                                            </div>
                                                            
                                                            <div className="mt-3 space-y-1">
                                                                <div className="flex items-center justify-between text-sm text-gray-600">
                                                                    <span>Number of rooms:</span>
                                                                    <span>{roomQuantity}</span>
                                                                </div>
                                                                <div className="flex items-center justify-between text-sm text-gray-600">
                                                                    <span>Number of nights:</span>
                                                                    <span>{numberOfNights}</span>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="border-t border-gray-300 pt-3 mt-3">
                                                                <div className="flex items-center justify-between font-semibold text-lg transition-all duration-200">
                                                                    <span>Total</span>
                                                                    <span className="text-primary">
                                                                        {selectedCurrency === 'SGD' 
                                                                            ? `SGD ${priceCalculations.totalSGD.toFixed(2)}` 
                                                                            : `USD ${priceCalculations.totalUSD.toFixed(2)}`
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div className="text-xs text-gray-500 text-right mt-1">
                                                                    {roomQuantity === 1 
                                                                        ? `for ${numberOfNights} night${numberOfNights > 1 ? 's' : ''}` 
                                                                        : `for ${roomQuantity} rooms × ${numberOfNights} night${numberOfNights > 1 ? 's' : ''}`
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Booking Button */}
                                            <div
                                                className="button-main w-full text-center mt-5 cursor-pointer"
                                                onClick={() => {
                                                    if (roomDetail.rooms_available === 0 || roomQuantity > roomDetail.rooms_available) {
                                                        return; // Don't navigate if room is not available
                                                    }
                                                    navigate('/booking', {
                                                        state: {
                                                            hotelName: hotelDetails?.name,
                                                            hotelImage: mainImage,
                                                            roomType: roomDetail?.roomNormalizedDescription || "Room",
                                                            price: priceCalculations 
                                                                ? (selectedCurrency === 'SGD' 
                                                                    ? priceCalculations.totalSGD.toFixed(2)
                                                                    : priceCalculations.totalUSD.toFixed(2))
                                                                : '0.00',
                                                            currency: selectedCurrency,
                                                            startDate: state[0].startDate.toISOString(),
                                                            endDate: state[0].endDate.toISOString(),
                                                            numberOfRooms: roomQuantity,
                                                            numberOfNights: numberOfNights,
                                                            adults: guest.adult,
                                                            children: guest.children,
                                                        },
                                                    })
                                                }}
                                            >
                                                {roomDetail.rooms_available === 0 
                                                    ? 'Sold Out' 
                                                    : roomQuantity > roomDetail.rooms_available
                                                        ? 'Not enough rooms available'
                                                        : `Book ${roomQuantity} Room${roomQuantity > 1 ? 's' : ''} Now`
                                                }
                                            </div>
                                        </div>
                                    )}
                                
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

export default RoomDetailContent