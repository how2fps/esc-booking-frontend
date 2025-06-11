import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import * as Icon from 'phosphor-react'
import TextHeading from '../TextHeading/TextHeading'
import { useRouter } from 'next/navigation'

const LocationTwo = () => {
    const router = useRouter()

    const handleClickCountry = (country: string) => {
        router.push(`/camp/topmap-grid?country=${country}`)
    }

    return (
        <>
            <div className="location-block lg:pt-20 md:pt-14 pt-10">
                <div className="container">
                    <TextHeading title='Locations on Glamping Hub' subTitle='Discover the Most Popular Places to Visit' />
                    <div className="list-location grid xl:grid-cols-3 md:grid-cols-2 lg:gap-[30px] gap-y-7 gap-4 md:mt-10 mt-6">
                        <div className={`item hover-scale flex items-center bg-surface rounded-lg overflow-hidden box-shadow-sm`}
                            onClick={() => handleClickCountry('Namibia')}
                        >
                            <div className="left h-full w-1/2 pr-4">
                                <div className="bg-img w-full h-full overflow-hidden">
                                    <Image
                                        src={'/images/location/410x273.png'}
                                        width={3000}
                                        height={2000}
                                        alt='1.png'
                                        priority={true}
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                            </div>
                            <div className="right lg:pl-1.5 max-md:pl-1.5 lg:pr-6 md:pr-2 max-md:pr-3 py-6">
                            <div className="name heading5">Namibia</div>
                                <div className="text-variant1 sm:mt-1">460 accommodations</div>
                                <div className="flex items-center gap-1 sm:mt-2 mt-1">
                                    <div className="text-button-sm">Explore Now</div>
                                    <Icon.CaretRight className='text-xs' />
                                </div>
                            </div>
                        </div>
                        <div className={`item hover-scale flex items-center bg-surface rounded-lg overflow-hidden box-shadow-sm`}
                            onClick={() => handleClickCountry('Vietnam')}
                        >
                            <div className="left h-full w-1/2 pr-4">
                                <div className="bg-img w-full h-full overflow-hidden">
                                    <Image
                                        src={'/images/location/410x273.png'}
                                        width={3000}
                                        height={2000}
                                        alt='1.png'
                                        priority={true}
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                            </div>
                            <div className="right lg:pl-1.5 max-md:pl-1.5 lg:pr-6 md:pr-2 max-md:pr-3 py-6">
                                <div className="name heading5">Vietnam</div>
                                <div className="text-variant1 sm:mt-1">460 accommodations</div>
                                <div className="flex items-center gap-1 sm:mt-2 mt-1">
                                    <div className="text-button-sm">Explore Now</div>
                                    <Icon.CaretRight className='text-xs' />
                                </div>
                            </div>
                        </div>
                        <div className={`item hover-scale flex items-center bg-surface rounded-lg overflow-hidden box-shadow-sm`}
                            onClick={() => handleClickCountry('Singapore')}
                        >
                            <div className="left h-full w-1/2 pr-4">
                                <div className="bg-img w-full h-full overflow-hidden">
                                    <Image
                                        src={'/images/location/410x273.png'}
                                        width={3000}
                                        height={2000}
                                        alt='1.png'
                                        priority={true}
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                            </div>
                            <div className="right lg:pl-1.5 max-md:pl-1.5 lg:pr-6 md:pr-2 max-md:pr-3 py-6">
                                <div className="name heading5">Singapore</div>
                                <div className="text-variant1 sm:mt-1">460 accommodations</div>
                                <div className="flex items-center gap-1 sm:mt-2 mt-1">
                                    <div className="text-button-sm">Explore Now</div>
                                    <Icon.CaretRight className='text-xs' />
                                </div>
                            </div>
                        </div>
                        <div className={`item hover-scale flex items-center bg-surface rounded-lg overflow-hidden box-shadow-sm`}
                            onClick={() => handleClickCountry('United State')}
                        >
                            <div className="left h-full w-1/2 pr-4">
                                <div className="bg-img w-full h-full overflow-hidden">
                                    <Image
                                        src={'/images/location/410x273.png'}
                                        width={3000}
                                        height={2000}
                                        alt='1.png'
                                        priority={true}
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                            </div>
                            <div className="right lg:pl-1.5 max-md:pl-1.5 lg:pr-6 md:pr-2 max-md:pr-3 py-6">
                                <div className="name heading5">United State</div>
                                <div className="text-variant1 sm:mt-1">460 accommodations</div>
                                <div className="flex items-center gap-1 sm:mt-2 mt-1">
                                    <div className="text-button-sm">Explore Now</div>
                                    <Icon.CaretRight className='text-xs' />
                                </div>
                            </div>
                        </div>
                        <div className={`item hover-scale flex items-center bg-surface rounded-lg overflow-hidden box-shadow-sm`}
                            onClick={() => handleClickCountry('Switzerland')}
                        >
                            <div className="left h-full w-1/2 pr-4">
                                <div className="bg-img w-full h-full overflow-hidden">
                                    <Image
                                        src={'/images/location/410x273.png'}
                                        width={3000}
                                        height={2000}
                                        alt='1.png'
                                        priority={true}
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                            </div>
                            <div className="right lg:pl-1.5 max-md:pl-1.5 lg:pr-6 md:pr-2 max-md:pr-3 py-6">
                                <div className="name heading5">Switzerland</div>
                                <div className="text-variant1 sm:mt-1">460 accommodations</div>
                                <div className="flex items-center gap-1 sm:mt-2 mt-1">
                                    <div className="text-button-sm">Explore Now</div>
                                    <Icon.CaretRight className='text-xs' />
                                </div>
                            </div>
                        </div>
                        <div className={`item hover-scale flex items-center bg-surface rounded-lg overflow-hidden box-shadow-sm`}
                            onClick={() => handleClickCountry('Brazil')}
                        >
                            <div className="left h-full w-1/2 pr-4">
                                <div className="bg-img w-full h-full overflow-hidden">
                                    <Image
                                        src={'/images/location/410x273.png'}
                                        width={3000}
                                        height={2000}
                                        alt='1.png'
                                        priority={true}
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                            </div>
                            <div className="right lg:pl-1.5 max-md:pl-1.5 lg:pr-6 md:pr-2 max-md:pr-3 py-6">
                                <div className="name heading5">Brazil</div>
                                <div className="text-variant1 sm:mt-1">460 accommodations</div>
                                <div className="flex items-center gap-1 sm:mt-2 mt-1">
                                    <div className="text-button-sm">Explore Now</div>
                                    <Icon.CaretRight className='text-xs' />
                                </div>
                            </div>
                        </div>
                        <div className={`item hover-scale flex items-center bg-surface rounded-lg overflow-hidden box-shadow-sm`}
                            onClick={() => handleClickCountry('Australia')}
                        >
                            <div className="left h-full w-1/2 pr-4">
                                <div className="bg-img w-full h-full overflow-hidden">
                                    <Image
                                        src={'/images/location/410x273.png'}
                                        width={3000}
                                        height={2000}
                                        alt='1.png'
                                        priority={true}
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                            </div>
                            <div className="right lg:pl-1.5 max-md:pl-1.5 lg:pr-6 md:pr-2 max-md:pr-3 py-6">
                                <div className="name heading5">Australia</div>
                                <div className="text-variant1 sm:mt-1">460 accommodations</div>
                                <div className="flex items-center gap-1 sm:mt-2 mt-1">
                                    <div className="text-button-sm">Explore Now</div>
                                    <Icon.CaretRight className='text-xs' />
                                </div>
                            </div>
                        </div>
                        <div className={`item hover-scale flex items-center bg-surface rounded-lg overflow-hidden box-shadow-sm`}
                            onClick={() => handleClickCountry('New Zealand')}
                        >
                            <div className="left h-full w-1/2 pr-4">
                                <div className="bg-img w-full h-full overflow-hidden">
                                    <Image
                                        src={'/images/location/410x273.png'}
                                        width={3000}
                                        height={2000}
                                        alt='1.png'
                                        priority={true}
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                            </div>
                            <div className="right lg:pl-1.5 max-md:pl-1.5 lg:pr-6 md:pr-2 max-md:pr-3 py-6">
                                <div className="name heading5">New Zealand</div>
                                <div className="text-variant1 sm:mt-1">460 accommodations</div>
                                <div className="flex items-center gap-1 sm:mt-2 mt-1">
                                    <div className="text-button-sm">Explore Now</div>
                                    <Icon.CaretRight className='text-xs' />
                                </div>
                            </div>
                        </div>
                        <div className={`item hover-scale flex items-center bg-surface rounded-lg overflow-hidden box-shadow-sm`}
                            onClick={() => handleClickCountry('Norway')}
                        >
                            <div className="left h-full w-1/2 pr-4">
                                <div className="bg-img w-full h-full overflow-hidden">
                                    <Image
                                        src={'/images/location/410x273.png'}
                                        width={3000}
                                        height={2000}
                                        alt='1.png'
                                        priority={true}
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                            </div>
                            <div className="right lg:pl-1.5 max-md:pl-1.5 lg:pr-6 md:pr-2 max-md:pr-3 py-6">
                                <div className="name heading5">Norway</div>
                                <div className="text-variant1 sm:mt-1">460 accommodations</div>
                                <div className="flex items-center gap-1 sm:mt-2 mt-1">
                                    <div className="text-button-sm">Explore Now</div>
                                    <Icon.CaretRight className='text-xs' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LocationTwo