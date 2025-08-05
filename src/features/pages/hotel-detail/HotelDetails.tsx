'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useParams } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';
import * as Icon from 'phosphor-react'
import StickyBox from 'react-sticky-box'
import type { Room } from "../../type/RoomType";
import type { Hotel } from "../../type/HotelType";

// Components
import HeaderOne from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'

// Styles
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

const HotelDetailContent = () => {
    const { id } = useParams();  
    const [searchParams] = useSearchParams();
    const destination_id = searchParams.get('destination_id');
    const checkIn = '2025-10-10'; // Fixed date
    const checkOut = '2025-10-17'; // Fixed date
    console.log(searchParams)
    const [viewMoreDesc, setViewMoreDesc] = useState<boolean>(false)
    const [hotelDetails, setHotelDetails] = useState<Hotel | null>(null);
    const [roomDetails, setRoomDetails] = useState<Room[]>([]);
    const [roomsLoading, setRoomsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchHotelDetails = async () => {
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
            }
        };
        fetchHotelDetails();
    }, [id]);
    

    useEffect(() => {
        const fetchRoomDetails = async () => {
            // if (!destination_id || !id) {
            //     return;
            // }

            setRoomsLoading(true);

            try {
                const response = await fetch(`http://localhost:3000/api/hotels/${id}/prices?destination_id=${destination_id}&checkin=${checkIn}&checkout=${checkOut}&lang=en_US&currency=SGD&country_code=SG&guests=2&partner_id=1089&landing_page=wl-acme-earn&product_type=earn`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            console.log(response)
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const roomResult = await response.json();
            if (roomResult.rooms && Array.isArray(roomResult.rooms)) {
                setRoomDetails(roomResult.rooms);
            } else {
                console.warn('No rooms found in API response:', roomResult);
                setRoomDetails([]);
            }
            } catch (error: unknown) {
                if (error instanceof Error) {
                        console.error("Fetch error details:", {
                                name: error.name,
                                message: error.message,
                                stack: error.stack,
                        });
                }
                console.error("Something went wrong while loading rooms. Please try again later.");
            } finally {
            setRoomsLoading(false); 
            }
        };
        fetchRoomDetails();
        console.log("running")
    }, [destination_id]);

    // Image handling logic 
    const [mainImage, setMainImage] = useState<string | null>(null) 
    const [imageError, setImageError] = useState(false);

    const image_array = useMemo(() => {
        // only run if there are image_details
        if (!hotelDetails?.image_details) return [];
        
        const prefix = hotelDetails?.image_details?.prefix || '';
        const count = hotelDetails?.image_details?.count || 0;
        const suffix = hotelDetails?.image_details?.suffix || '.jpg';
        const hiresIndices = hotelDetails.hires_image_index?.split(',').map(num => parseInt(num.trim())) || [];
        const images: string[] = [];
        // add all high res images
        hiresIndices.forEach(index => {
        if (index < count) {
            images.push(`${prefix}${index}${suffix}`);
        }
        });
        // add remaining images (avoid duplicates)
        for (let i = 0; i < count; i++) {
            const imageUrl = `${prefix}${i}${suffix}`;
            if (!images.includes(imageUrl)) {
                images.push(imageUrl);
            }
        }
        return images;
    }, [hotelDetails?.image_details, hotelDetails?.hires_image_index]);

    const [validImages, setValidImages] = useState<string[]>([]);

    useEffect(() => {
        if (image_array.length === 0) {
            setValidImages(['/assets/Placeholder_Cat.png']); // Use consistent fallback
            return;
        }
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
                setValidImages(results.length > 0 ? results : ['/assets/Placeholder_Cat.png']);
            }
        };
        checkImages();
        return () => { isMounted = false; };
    }, [image_array]);

    // Set main image after validImages is created
    useEffect(() => {
        if (validImages.length > 0) {
        // Use default_image_index if available
        const defaultIndex = hotelDetails?.default_image_index || 0;
        const defaultImage = validImages[defaultIndex] || validImages[0];
        setMainImage(defaultImage);
    } else {
        setMainImage('/assets/Placeholder_Cat.jpg');
    }
}, [validImages, hotelDetails?.default_image_index]);

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
                            src={mainImage || "/assets/Placeholder_Cat.jpg"}
                            alt="Main Hotel View"
                            className="w-full h-full object-cover rounded-xl"
                            style={{ width: '100%', height: '100%' }}
                            onError={(e) => {
                                setImageError(true);
                                e.currentTarget.src = "/assets/Placeholder_Cat.jpg";
                            }}
                        />
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
                                            e.currentTarget.src = "/assets/Placeholder_Cat.jpg";
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
                                <div className="heading5">Available Rooms ({roomDetails.length})</div>
                                
                                {roomsLoading ? (
                                    <div className="flex justify-center items-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                                        <span>Loading rooms...</span>
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
                                                            <button className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition-colors">
                                                                View More Details
                                                            </button>
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