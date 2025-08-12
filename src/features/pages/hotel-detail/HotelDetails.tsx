'use client'

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
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

type DateRange = {
    startDate: Date;
    endDate: Date;
    key: string;
};
const HotelDetailContent = () => {
    const { id } = useParams();  
    const [searchParams] = useSearchParams();
    const destination_id = searchParams.get('destination_id');
    
    // Handle date parameters - check both parameter formats
    const startDateParam = searchParams.get('startDate') || searchParams.get('checkin');
    const endDateParam = searchParams.get('endDate') || searchParams.get('checkout');
    
    const formatDate = (dateString: string): string => {
        // If already in YYYY-MM-DD format, return as is
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return dateString;
        }
        
        // Parse other date formats
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    const checkIn = startDateParam ? formatDate(startDateParam) : null;
    const checkOut = endDateParam ? formatDate(endDateParam) : null;
    
    // Debug logging
    console.log('=== HOTEL DETAILS COMPONENT MOUNT ===');
    console.log('URL params:', { id });
    console.log('Search params:', { 
        destination_id, 
        startDate: searchParams.get('startDate'),
        endDate: searchParams.get('endDate'),
        checkin: searchParams.get('checkin'),
        checkout: searchParams.get('checkout'),
        resolvedStartDate: startDateParam,
        resolvedEndDate: endDateParam,
        formattedCheckIn: checkIn,
        formattedCheckOut: checkOut,
        allParams: Object.fromEntries(searchParams.entries())
    });
    console.log('Parsed dates:', {
        checkInDate: checkIn ? new Date(checkIn) : null,
        checkOutDate: checkOut ? new Date(checkOut) : null,
        areSame: checkIn && checkOut ? new Date(checkIn).getTime() === new Date(checkOut).getTime() : false
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
    
    // Ref to track active polling
    const pollingActiveRef = useRef<boolean>(false);
    
    const [state, setState] = useState(() => {
        const startDate = checkIn ? new Date(checkIn) : new Date();
        let endDate;
        
        if (checkOut) {
            const parsedEndDate = new Date(checkOut);
            // Ensure checkout is at least 1 day after checkin
            if (parsedEndDate <= startDate) {
                endDate = addDays(startDate, 1);
            } else {
                endDate = parsedEndDate;
            }
        } else {
            endDate = addDays(startDate, 1);
        }
        
        return [{
            startDate,
            endDate,
            key: 'selection'
        }];
    });

    const currentCheckIn = useMemo(() => {
        const date = state[0].startDate;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }, [state]);

    const currentCheckOut = useMemo(() => {
        const date = state[0].endDate;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }, [state]);

    const currentGuests = useMemo(() => {
        return guest.adult + guest.children;
    }, [guest]);

    // Helper function to get alternative image URLs
    const getImageFallbacks = useCallback((originalUrl: string, index: number) => {
        if (!hotelDetails?.image_details?.prefix) return [];
        
        const prefix = hotelDetails.image_details.prefix;
        const suffix = hotelDetails.image_details.suffix || '.jpg';
        const imgixUrl = hotelDetails.imgix_url;
        const cloudflareUrl = hotelDetails.cloudflare_image_url;
        
        const fallbacks: string[] = [];
        
        // Since we're now using 1-based indexing, the actual image index would be index + 1
        const actualImageIndex = index + 1;
        
        // Try different indexing patterns around the actual index
        const indexPatterns = [
            actualImageIndex - 1,  // 0-based equivalent
            actualImageIndex,      // 1-based (current)
            actualImageIndex + 1,  // In case we're off by one
        ].filter(i => i >= 0); // Remove negative indices
        
        // Generate different URL patterns
        for (const i of indexPatterns) {
            const candidateUrl = `${prefix}${i}${suffix}`;
            if (candidateUrl !== originalUrl && !fallbacks.includes(candidateUrl)) {
                fallbacks.push(candidateUrl);
            }
        }
        
        console.log(`Generated ${fallbacks.length} fallbacks for array index ${index} (image ${actualImageIndex}):`, fallbacks);
        return fallbacks.slice(0, 2); // Limit to 2 fallbacks to prevent infinite loops
    }, [hotelDetails?.image_details, hotelDetails?.imgix_url, hotelDetails?.cloudflare_image_url]);

    const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
    const [imageRetryAttempts, setImageRetryAttempts] = useState<Map<string, number>>(new Map());
    const [mainImage, setMainImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchHotelDetails = async () => {
            setHotelLoading(true);
            console.log('=== HOTEL DETAILS FETCH ===');
            console.log('Hotel ID:', id);
            
            let retries = 0;
            const maxRetries = 3; // Limit to 3 attempts
            const delay = 1500; // 1.5 seconds between retries
            
            while (retries < maxRetries) {
                try {
                    console.log(`Hotel fetch attempt ${retries + 1}/${maxRetries}`);
                    
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
                    setHotelLoading(false);
                    return; // Success, exit the function
                    
                } catch (error: unknown) {
                    console.error(`Hotel fetch attempt ${retries + 1} failed:`, error);
                    retries++;
                    
                    if (retries >= maxRetries) {
                        // Final attempt failed
                        if (error instanceof Error) {
                            console.error("Hotel fetch error details:", {
                                name: error.name,
                                message: error.message,
                                stack: error.stack,
                            });
                        }
                        console.error("Something went wrong while loading hotels. Please try again later.");
                        setHotelLoading(false);
                        break;
                    } else {
                        // Wait before retrying
                        console.log(`Retrying hotel fetch in ${delay}ms...`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }
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

            // Validate dates
            if (currentCheckIn === currentCheckOut) {
                console.error('❌ Invalid dates: Check-in and check-out cannot be the same day');
                console.error('Current dates:', { currentCheckIn, currentCheckOut });
                return;
            }

            // Don't start new polling if already active or if we already have room data
            if (pollingActiveRef.current || (roomDetails.length > 0 && !roomsLoading)) {
                console.log('Polling already active or room data already loaded, skipping fetch');
                return;
            }

            pollingActiveRef.current = true;
            setRoomsLoading(true);

            // Create abort controller for cleanup
            const abortController = new AbortController();
            let isActive = true;
            
            const pollRoomData = async () => {
                let retries = 0;
                const maxRetries = 3; // Limit to 3 attempts
                const delay = 1500; // 1.5 seconds between retries

                const apiUrl = `http://localhost:3000/api/hotels/${id}/prices?destination_id=${destination_id}&checkin=${currentCheckIn}&checkout=${currentCheckOut}&lang=en_US&currency=SGD&country_code=SG&guests=${currentGuests}&partner_id=1089&landing_page=wl-acme-earn&product_type=earn`;
                console.log('Room API URL:', apiUrl);

                while (isActive && retries < maxRetries && !abortController.signal.aborted) {
                    try {
                        console.log(`Room polling attempt ${retries + 1}/${maxRetries}`);
                        
                        const response = await fetch(apiUrl, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            signal: abortController.signal
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
                            // Limit rooms for performance
                            setRoomDetails(roomResult.rooms.slice(0, 20));
                            console.log('Set room details:', roomResult.rooms.length, 'rooms');
                            setRoomsLoading(false);
                            pollingActiveRef.current = false; // Reset polling flag
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
                        if (error instanceof Error && error.name === 'AbortError') {
                            console.log('Room polling aborted');
                            break;
                        }
                        console.error(`Room polling attempt ${retries + 1} failed:`, error);
                    }
                    
                    retries++;
                    if (retries < maxRetries && isActive && !abortController.signal.aborted) {
                        await new Promise((resolve) => {
                            setTimeout(resolve, delay);
                        });
                    }
                }
                
                // If we've exhausted all retries
                if (retries >= maxRetries && isActive && !abortController.signal.aborted) {
                    console.error('❌ Room data polling timed out after', maxRetries, 'attempts');
                    setRoomDetails([]);
                    setRoomsLoading(false);
                    pollingActiveRef.current = false; // Reset polling flag
                }
            };

            pollRoomData();
            
            // Cleanup function
            return () => {
                isActive = false;
                pollingActiveRef.current = false; // Reset polling flag
                abortController.abort(); // Abort any ongoing requests
            };
        };
        
        // Only fetch if we have required parameters
        if (destination_id && id) {
            fetchRoomDetails();
        } else {
            console.log('Skipping room fetch - missing parameters:', { destination_id, id });
        }
    }, [destination_id, currentCheckIn, currentCheckOut, id, currentGuests]);

    // Cleanup effect to reset polling when component unmounts
    useEffect(() => {
        return () => {
            pollingActiveRef.current = false;
        };
    }, []);

    // Image handling logic - try both indexing patterns
    const image_array = useMemo(() => {
        if (!hotelDetails?.image_details?.prefix) {
            console.log('No image prefix available');
            return [];
        }
        
        const imageDetails = hotelDetails.image_details;
        const prefix = imageDetails.prefix;
        const count = Math.min(imageDetails.count || 0, 8); // Limit to 8 images to reduce failed attempts
        const suffix = imageDetails.suffix || '.jpg';
        const images: string[] = [];

        console.log('Generating image array:', { prefix, count, suffix });

        // Try both 0-based and 1-based indexing, but start with what's more likely to work
        // Based on your API showing default_image_index: 1, let's start with 1-based
        for (let i = 1; i <= count; i++) {
            const imageUrl = `${prefix}${i}${suffix}`;
            images.push(imageUrl);
        }
    
        console.log('Generated images (1-based indexing):', images.slice(0, 3)); // Log first 3 for debugging
        console.log('Available image URLs:', { 
            imgixUrl: hotelDetails.imgix_url, 
            cloudflareUrl: hotelDetails.cloudflare_image_url, 
            prefix 
        });
        return images;
    }, [hotelDetails?.image_details, hotelDetails?.imgix_url, hotelDetails?.cloudflare_image_url]);

    // Set main image with fallback logic
    useEffect(() => {
        if (image_array.length > 0) {
            // Use the default_image_index from API (1-based) directly since our array is now 1-based
            const defaultIndex = hotelDetails?.default_image_index || 1;
            
            // Since our array now uses 1-based indexing and API default_image_index is 1-based,
            // we can use direct mapping
            const arrayIndex = Math.max(0, Math.min(defaultIndex - 1, image_array.length - 1));
            const selectedImage = image_array[arrayIndex];
            
            console.log('Setting main image:', { 
                defaultIndex, 
                arrayIndex, 
                selectedImage,
                totalImages: image_array.length 
            });
            
            setMainImage(selectedImage);
        } else {
            console.log('No images available, using placeholder');
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
                        {mainImage ? (
                            <img
                                src={mainImage}
                                alt="Main Hotel View"
                                className="w-full h-full object-cover rounded-xl"
                                style={{ width: '100%', height: '100%' }}
                                onError={(e) => {
                                    console.log('Main image failed to load:', mainImage);
                                    const imageIndex = image_array.indexOf(mainImage);
                                    const currentAttempts = imageRetryAttempts.get(mainImage) || 0;
                                    const fallbacks = getImageFallbacks(mainImage, imageIndex);
                                    
                                    console.log(`Main image fallbacks available:`, fallbacks);
                                    
                                    // Safety check: limit total attempts
                                    if (currentAttempts < fallbacks.length && currentAttempts < 3) {
                                        // Try next fallback URL
                                        const nextUrl = fallbacks[currentAttempts];
                                        console.log(`Trying main image fallback ${currentAttempts + 1}:`, nextUrl);
                                        e.currentTarget.src = nextUrl;
                                        setImageRetryAttempts(prev => new Map(prev).set(mainImage, currentAttempts + 1));
                                    } else {
                                        // All fallbacks failed or max attempts reached, use placeholder
                                        console.log('All main image fallbacks failed or max attempts reached for:', mainImage);
                                        e.currentTarget.src = "/assets/Placeholder_Cat.jpg";
                                        // Reset retry attempts
                                        setImageRetryAttempts(prev => {
                                            const newMap = new Map(prev);
                                            newMap.delete(mainImage);
                                            return newMap;
                                        });
                                    }
                                }}
                                onLoad={() => {
                                    console.log('Main image loaded successfully:', mainImage);
                                }}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-500">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 mb-4"></div>
                                <span>Loading image...</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Thumbnail Grid */}
                <div className="w-full mt-6">
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {image_array.length > 0 && hotelDetails?.image_details?.prefix ? (
                            image_array.map((imageUrl: string, index: number) => {
                                const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
                                    const currentAttempts = imageRetryAttempts.get(imageUrl) || 0;
                                    const fallbacks = getImageFallbacks(imageUrl, index);
                                    
                                    console.log(`Thumbnail image failed (attempt ${currentAttempts + 1}):`, imageUrl);
                                    console.log(`Available fallbacks:`, fallbacks);
                                    
                                    // Safety check: limit total attempts to prevent infinite loops
                                    if (currentAttempts < fallbacks.length && currentAttempts < 3) {
                                        // Try next fallback URL
                                        const nextUrl = fallbacks[currentAttempts];
                                        console.log(`Trying fallback ${currentAttempts + 1}:`, nextUrl);
                                        e.currentTarget.src = nextUrl;
                                        setImageRetryAttempts(prev => new Map(prev).set(imageUrl, currentAttempts + 1));
                                    } else {
                                        // All fallbacks failed or max attempts reached, use placeholder
                                        console.log('All fallbacks failed or max attempts reached for:', imageUrl);
                                        e.currentTarget.src = "/assets/Placeholder_Cat.jpg";
                                        setFailedImages(prev => new Set(prev).add(imageUrl));
                                        // Reset retry attempts for this image
                                        setImageRetryAttempts(prev => {
                                            const newMap = new Map(prev);
                                            newMap.delete(imageUrl);
                                            return newMap;
                                        });
                                    }
                                };

                                return (
                                    <div key={`thumb-${index}`} className="flex-shrink-0">
                                        <div className="w-[120px] h-[80px] bg-gray-100 rounded-lg overflow-hidden">
                                            <img
                                                src={imageUrl}
                                                alt={`Hotel Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover cursor-pointer transition-transform hover:scale-105"
                                                onClick={() => setMainImage(imageUrl)}
                                                onError={handleImageError}
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="w-full h-20 flex items-center justify-center bg-gray-100 rounded-lg p-4">
                                <span className="text-gray-500 text-sm">No images available</span>
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
                                    <div className="mt-4">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            {roomDetails.map((room, index) => (
                                                <div key={room.key || index} className="room-card bg-white border border-gray-200 rounded-lg p-4">
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
                                                        <h3 className="text-lg font-semibold mb-4">
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
                                                                to={`/hotels/${id}/rooms/${encodeURIComponent(room.key)}?destination_id=${destination_id}&checkin=${currentCheckIn}&checkout=${currentCheckOut}&guests=${guest.adult + guest.children}`}
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
                                                    <Icon.CaretDown className='text-2xl' />
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