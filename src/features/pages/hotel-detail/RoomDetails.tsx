'use client'

import React, { useState, useEffect, useMemo,  useCallback } from 'react'
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
    const [hotelDetails, setHotelDetails] = useState<Hotel | null>(null);
    const [roomDetail, setRoomDetail] = useState<Room | null>(null);
    const [hotelLoading, setHotelLoading] = useState<boolean>(true);
    const [roomLoading, setRoomLoading] = useState<boolean>(true);
    const [openDate, setOpenDate] = useState(false);
    const [openGuest, setOpenGuest] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState<'SGD' | 'USD'>('SGD');
    const [roomQuantity, setRoomQuantity] = useState<number>(1);

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
            try {
                const response = await fetch(`http://localhost:3000/api/hotels/${id}`, {
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
            try {
                setRoomLoading(true);
                console.log('=== ROOM DETAILS FETCH DEBUG ===');
                console.log('URL roomKey:', roomKey);
                console.log('Hotel ID:', id);
                console.log('Destination ID:', destination_id);
                
                if (!id || !roomKey || !destination_id) {
                    console.warn('Missing required parameters:', { id, roomKey, destination_id });
                    setRoomLoading(false);
                    return;
                }

                // Polling logic similar to HotelListings
                let timeoutId: ReturnType<typeof setTimeout>;
                let isActive = true;
                
                const pollRoomData = async () => {
                    let retries = 0;
                    const maxRetries = 40; // 40 retries * 2 seconds = 80 seconds max
                    const delay = 2000; // 2 seconds between retries

                    const apiUrl = `http://localhost:3000/api/hotels/${id}/prices?destination_id=${destination_id}&checkin=${currentCheckIn}&checkout=${currentCheckOut}&lang=en_US&currency=SGD&country_code=SG&guests=${currentGuests}&partner_id=1089&landing_page=wl-acme-earn&product_type=earn`;
                    console.log('Room API URL:', apiUrl);

                    while (isActive && retries < maxRetries) {
                        try {
                            console.log(`Polling attempt ${retries + 1}/${maxRetries}`);
                            
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
                            console.log('Room polling response:', {
                                completed: roomResult.completed,
                                hasRooms: roomResult.rooms?.length > 0,
                                totalRooms: roomResult.rooms?.length || 0
                            });
                            
                            // Check if the API has completed processing and has rooms
                            if (roomResult.completed && roomResult.rooms && Array.isArray(roomResult.rooms)) {
                                console.log('✅ Room data completed! Processing...');
                                
                                // Log all available room keys for debugging
                                const availableKeys = roomResult.rooms.map((room: Room) => room.key);
                                console.log('Available room keys:', availableKeys);
                                console.log('Looking for roomKey:', roomKey);
                                
                                // Find the specific room
                                const specificRoom = roomResult.rooms.find((room: Room) => room.key === roomKey);
                                
                                if (specificRoom) {
                                    console.log('✅ ROOM FOUND!');
                                    console.log('Room details:', {
                                        key: specificRoom.key,
                                        description: specificRoom.roomNormalizedDescription,
                                        price: specificRoom.converted_price,
                                        availability: specificRoom.rooms_available
                                    });
                                    setRoomDetail(specificRoom);
                                    setRoomLoading(false);
                                    isActive = false; // Stop the polling loop
                                    break; // Exit the while loop
                                }
                                
                                console.log('❌ ROOM NOT FOUND in completed data');
                                console.log('Exact comparison results:');
                                roomResult.rooms.forEach((room: Room, index: number) => {
                                    console.log(`Room ${index + 1}:`, {
                                        key: room.key,
                                        matches: room.key === roomKey,
                                        keyLength: room.key?.length,
                                        targetLength: roomKey?.length,
                                        description: room.roomNormalizedDescription
                                    });
                                });
                                
                                // Try URL decoding as fallback
                                const decodedRoomKey = decodeURIComponent(roomKey);
                                console.log('Trying with decoded key:', decodedRoomKey);
                                
                                const decodedMatch = roomResult.rooms.find((room: Room) => room.key === decodedRoomKey);
                                if (decodedMatch) {
                                    console.log('✅ Found with decoded key');
                                    setRoomDetail(decodedMatch);
                                    setRoomLoading(false);
                                    isActive = false; // Stop the polling loop
                                    break; // Exit the while loop
                                }
                                
                                console.log('❌ No match even with decoded key');
                                setRoomDetail(null);
                                setRoomLoading(false);
                                isActive = false; // Stop the polling loop
                                break; // Exit the while loop
                            } else {
                                console.log(`⏳ Room data not ready yet (attempt ${retries + 1}), retrying in ${delay}ms...`);
                                console.log('Response status:', {
                                    completed: roomResult.completed,
                                    hasRoomsArray: Array.isArray(roomResult.rooms),
                                    roomsLength: roomResult.rooms?.length
                                });
                            }
                            
                        } catch (error: unknown) {
                            console.error(`Polling attempt ${retries + 1} failed:`, error);
                        }
                        
                        retries++;
                        if (retries < maxRetries && isActive) {
                            await new Promise((resolve) => {
                                timeoutId = setTimeout(resolve, delay);
                            });
                        }
                    }
                    
                    // If we've exhausted all retries
                    if (retries >= maxRetries && isActive) {
                        console.error('❌ Room data polling timed out after', maxRetries, 'attempts');
                        setRoomDetail(null);
                        setRoomLoading(false);
                    }
                };

                pollRoomData();
                
                // Cleanup function
                return () => {
                    isActive = false;
                    clearTimeout(timeoutId);
                };
            } catch (error: unknown) {
                console.error("Room fetch setup error:", error);
                setRoomDetail(null);
                setRoomLoading(false);
            }
        };

        fetchRoomDetails();
    }, [destination_id, currentCheckIn, currentCheckOut, id, currentGuests, roomKey]);

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
                <div className="text-gray-600 text-lg mb-4">Room not found</div>
                <div className="text-sm text-gray-500 mb-2">Room key: {roomKey}</div>
                <div className="text-sm text-gray-500 mb-4">
                    We couldn't find a room matching this key. This might happen if:
                </div>
                <ul className="text-sm text-gray-500 mb-6 list-disc list-inside">
                    <li>The room is no longer available</li>
                    <li>The room key has changed</li>
                    <li>There was an error processing the request</li>
                </ul>
                <div className="space-y-3">
                    <Link 
                        to={`/hotels/${id}?destination_id=${destination_id}&checkin=${checkIn}&checkout=${checkOut}&guests=${currentGuests}`} 
                        className="inline-block bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition-colors"
                    >
                        View All Rooms at This Hotel
                    </Link>
                    <div>
                        <button 
                            onClick={() => window.location.reload()} 
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

                            {/* Hotel Name as Subtitle */}
                            {roomDetail?.roomNormalizedDescription && (
                                <div className="text-lg text-gray-600 mt-1">
                                    at {hotelDetails?.name}
                                </div>
                            )}

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
                                {roomDetail?.free_cancellation !== undefined && (
                                    <div className={`flex items-center gap-1 ${roomDetail.free_cancellation ? 'text-green-600' : 'text-red-600'}`}>
                                        <Icon.CheckCircle className={`text-lg ${roomDetail.free_cancellation ? 'text-green-600' : 'text-red-600'}`} weight='fill' />
                                        <span className="font-medium">
                                            {roomDetail.free_cancellation ? 'Free Cancellation' : 'Non-refundable'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="desc lg:mt-10 mt-6 lg:pt-10 pt-6 border-t border-outline">
                                <div className="heading5">Room Description</div>
                                {roomDetail?.long_description ? (
                                    <>
                                        <div className="body2 text-variant1 mt-3 text-justify">
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
                                    <div className="body2 text-variant1 mt-3 text-justify">
                                        {roomDetail.description}
                                    </div>
                                ) : (
                                    <div className="body2 text-variant1 mt-3 text-justify">No description available</div>
                                )}
                            </div>

                            {/* Room Amenities */}
                            <div className="feature lg:mt-10 mt-6 lg:pt-10 pt-6 border-t border-outline">
                                <div className="heading5">Room Amenities</div>
                                <div className="list w-full mt-4">
                                    {roomDetail?.amenities && roomDetail?.amenities.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {roomDetail.amenities.map((amenity: string, index: number) => (
                                                <div key={index} className="item flex items-center gap-2">
                                                    <Icon.Check className="text-primary text-lg flex-shrink-0" weight="bold" />
                                                    <span className="text-sm">{amenity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-variant1">No amenities information available</div>
                                    )}
                                </div>
                            </div>

                            {/* Additional Room Information */}
                            {roomDetail?.roomAdditionalInfo?.displayFields && (
                                <div className="additional-info lg:mt-10 mt-6 lg:pt-10 pt-6 border-t border-outline">
                                    <div className="heading5">Additional Information</div>
                                    
                                    {/* Special Check-in Instructions - Moved to top */}
                                    {roomDetail.roomAdditionalInfo.displayFields.special_check_in_instructions && (
                                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg mt-4">
                                            <h5 className="font-medium text-green-800 mb-2 flex items-center">
                                                <Icon.Info className="mr-2" />
                                                Special Check-in Instructions
                                            </h5>
                                            <div className="text-green-700">
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
                                            <div className="text-orange-700 capitalize">
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
                                                    className="text-gray-700" 
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
                                                    className="text-purple-700" 
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
                                                    className="text-indigo-700" 
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
                                {/* Information */}
                                {roomDetail && (
                                    <div className="room-info mb-4">
                                        <h3 className="text-lg font-semibold mb-3">Room Information</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Availability:</span>
                                                <span className="font-medium text-green-600">
                                                    {roomDetail.rooms_available} rooms left
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

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

                                {/* Room Quantity Selector */}
                                {roomDetail && (
                                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                        <div className="text-sm font-medium text-gray-800 mb-3">Number of Rooms</div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Rooms</span>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    className={`w-8 h-8 flex items-center justify-center rounded-full border border-outline duration-300 ${
                                                        roomQuantity === 1 
                                                            ? "opacity-[0.4] cursor-default" 
                                                            : "cursor-pointer hover:bg-black hover:text-white"
                                                    }`}
                                                    onClick={() => roomQuantity > 1 && setRoomQuantity(roomQuantity - 1)}
                                                    disabled={roomQuantity === 1}
                                                >
                                                    <Icon.Minus weight="bold" />
                                                </button>
                                                <span className="font-medium text-lg w-8 text-center">{roomQuantity}</span>
                                                <button
                                                    className={`w-8 h-8 flex items-center justify-center rounded-full border border-outline cursor-pointer duration-300 hover:bg-black hover:text-white ${
                                                        roomQuantity >= (roomDetail.rooms_available || 1)
                                                            ? "opacity-[0.4] cursor-default"
                                                            : ""
                                                    }`}
                                                    onClick={() => roomQuantity < (roomDetail.rooms_available || 1) && setRoomQuantity(roomQuantity + 1)}
                                                    disabled={roomQuantity >= (roomDetail.rooms_available || 1)}
                                                >
                                                    <Icon.Plus weight="bold" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-2">
                                            Available: {roomDetail.rooms_available} rooms
                                        </div>
                                    </div>
                                )}

                                {/* Room Pricing and Booking */}
                                {roomDetail && (
                                    <div className="reservation bg-surface p-6 rounded-md md:mt-10 mt-6">
                                        <div className="heading6">Room Details & Pricing</div>
                                        <div className="room-card bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                                            <div className="pricing-info mb-4">
                                                <h3 className="text-lg font-semibold mb-3">Pricing</h3>
                                                <div className="text-2xl font-bold text-blue-600 mb-2">
                                                    SGD {roomDetail.base_rate?.toLocaleString()}
                                                </div>
                                                <div className="text-sm text-gray-500 mb-3">per room per night</div>

                                                {roomDetail.included_taxes_and_fees_total && (
                                                    <div className="text-sm text-gray-600">
                                                        Taxes & Fees: SGD {roomDetail.included_taxes_and_fees_total?.toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="flex flex-col gap-3">
                                                <Link 
                                                    to={`/hotels/${id}?destination_id=${destination_id}&checkin=${currentCheckIn}&checkout=${currentCheckOut}`}
                                                    className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded text-center hover:bg-gray-300 transition-colors"
                                                >
                                                    Back to Hotel
                                                </Link>
                                                
                                                <button 
                                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 transition-colors"
                                                    disabled={roomDetail.rooms_available === 0}
                                                >
                                                    {roomDetail.rooms_available === 0 ? 'Sold Out' : 'Proceed to Booking'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Booking Summary */}
                                {roomDetail && (
                                    <div className="reservation bg-surface p-6 rounded-md md:mt-10 mt-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="heading6">Booking Summary</div>
                                            {/* Currency Toggle */}
                                            <div className="flex items-center bg-white rounded-lg p-1 border border-outline">
                                                <button
                                                    className={`px-3 py-1 text-sm rounded transition-colors ${
                                                        selectedCurrency === 'SGD' 
                                                            ? 'bg-primary text-white' 
                                                            : 'text-gray-600 hover:text-primary'
                                                    }`}
                                                    onClick={() => setSelectedCurrency('SGD')}
                                                >
                                                    SGD
                                                </button>
                                                <button
                                                    className={`px-3 py-1 text-sm rounded transition-colors ${
                                                        selectedCurrency === 'USD' 
                                                            ? 'bg-primary text-white' 
                                                            : 'text-gray-600 hover:text-primary'
                                                    }`}
                                                    onClick={() => setSelectedCurrency('USD')}
                                                >
                                                    USD
                                                </button>
                                            </div>
                                        </div>

                                        {/* Price Breakdown */}
                                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                            <div className="text-sm font-medium text-gray-800 mb-3">Price Breakdown</div>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600">Base Rate (per room)</span>
                                                    <span className="font-medium">
                                                        {selectedCurrency === 'SGD' 
                                                            ? `SGD ${roomDetail.base_rate_in_currency?.toLocaleString()}` 
                                                            : `USD ${roomDetail.base_rate?.toLocaleString()}`
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600">Taxes & Fees (per room)</span>
                                                    <span className="font-medium">
                                                        {selectedCurrency === 'SGD' 
                                                            ? `SGD ${roomDetail.included_taxes_and_fees_total_in_currency?.toLocaleString()}` 
                                                            : `USD ${roomDetail.included_taxes_and_fees_total?.toLocaleString()}`
                                                        }
                                                    </span>
                                                </div>
                                                {roomDetail.excluded_taxes_and_fees_total > 0 && (
                                                    <div className="flex items-center justify-between text-red-600">
                                                        <span>Additional Fees (per room)</span>
                                                        <span className="font-medium">
                                                            {selectedCurrency === 'SGD' 
                                                                ? `SGD ${roomDetail.excluded_taxes_and_fees_total_in_currency?.toLocaleString()}` 
                                                                : `USD ${roomDetail.excluded_taxes_and_fees_total?.toLocaleString()}`
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="border-t border-gray-300 pt-2 mt-2">
                                                    <div className="flex items-center justify-between font-medium">
                                                        <span>Subtotal per room</span>
                                                        <span>
                                                            {selectedCurrency === 'SGD' 
                                                                ? `SGD ${roomDetail.converted_price?.toLocaleString()}` 
                                                                : `USD ${roomDetail.price?.toLocaleString()}`
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="border-t border-gray-300 pt-2 mt-2">
                                                        <div className="flex items-center justify-between font-semibold text-lg">
                                                            <span>Total</span>
                                                            <span className="text-primary">
                                                                {selectedCurrency === 'SGD' 
                                                                    ? `SGD ${((roomDetail.converted_price || 0) * roomQuantity).toLocaleString()}` 
                                                                    : `USD ${((roomDetail.price || 0) * roomQuantity).toLocaleString()}`
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-gray-500 text-right">
                                                            {roomQuantity === 1 ? 'per night' : `for ${roomQuantity} rooms per night`}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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
                                                        price: selectedCurrency === 'SGD' 
                                                            ? ((roomDetail.converted_price || 0) * roomQuantity).toFixed(2)
                                                            : ((roomDetail.price || 0) * roomQuantity).toFixed(2),
                                                        currency: selectedCurrency,
                                                        startDate: state[0].startDate.toISOString(),
                                                        endDate: state[0].endDate.toISOString(),
                                                        numberOfRooms: roomQuantity,
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