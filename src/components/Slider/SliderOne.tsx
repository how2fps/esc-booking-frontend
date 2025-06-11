import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'
import Link from 'next/link'
import * as Icon from 'phosphor-react'
import { addDays } from 'date-fns';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

interface GuestType {
    adult: number;
    children: number;
    infant: number;
    pet: number;
}

const SliderOne = () => {
    const router = useRouter()
    const [openDate, setOpenDate] = useState(false)
    const [openGuest, setOpenGuest] = useState(false)
    const [location, setLocation] = useState('')
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: 'selection'
        }
    ]);

    const [guest, setGuest] = useState<GuestType>(
        {
            adult: 0,
            children: 0,
            infant: 0,
            pet: 0
        }
    );

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

    const handleSearch = () => {
        router.push(`/camp/topmap-grid?location=${location}&startDate=${state[0].startDate.toLocaleDateString()}&endDate=${state[0].endDate.toLocaleDateString()}&adult=${guest.adult}&children=${guest.children}&infant=${guest.infant}&pet=${guest.pet}`)
    }

    return (
        <>
            <div className="slider-block style-one relative h-[620px]">
                <div className="bg-img absolute top-0 left-0 w-full h-full">
                    <Image
                        src={'/images/slider/slider-home1.png'}
                        width={4000}
                        height={3000}
                        alt='slider'
                        priority={true}
                        className='w-full h-full object-cover'
                    />
                </div>
                <div className="container py-[176px]">
                    <div className="content w-full relative">
                        <div className="heading flex-col items-center justify-center">
                            <div className="heading2 text-white text-center">Find yourself outside</div>
                            <div className="heading6 text-white text-center mt-3">Reserve beautiful private RV spots and campsites—found <br className='max-sm:hidden' />only on Hipcamp.</div>
                        </div>

                        <div className="form-search md:mt-10 mt-6 w-full">
                            <form className='bg-white rounded-lg p-5 flex max-lg:flex-wrap items-center justify-between gap-5 relative'>
                                <div className="select-block lg:w-full md:w-[48%] w-full">
                                    <Icon.MapPin className='icon text-xl left-5' />
                                    <input
                                        className='body2 w-full pl-12 pr-5 py-3 border border-outline rounded-lg'
                                        type="text"
                                        placeholder='Search destination'
                                        value={location || ''}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>
                                <div className="relative lg:w-full md:w-[48%] w-full">
                                    <div className='select-block w-full' onClick={handleOpenDate}>
                                        <Icon.CalendarBlank className='icon text-xl left-5' />
                                        {/* <input className='body2 w-full pl-12 pr-5 py-3 border border-outline rounded-lg' type="text" placeholder='Add Dates' /> */}
                                        <input
                                            className='body2 w-full pl-12 pr-5 py-3 border border-outline rounded-lg'
                                            type="text"
                                            placeholder='Add Dates'
                                            value={`${state[0].startDate.toLocaleDateString()} - ${state[0].endDate.toLocaleDateString()}`}
                                            readOnly // prevent user edit value
                                        />
                                    </div>
                                    <DateRangePicker
                                        className={`form-date-picker box-shadow md:border-t border-outline ${openDate ? 'open' : ''}`}
                                        onChange={item => setState([item.selection] as any)}
                                        // showSelectionPreview={true}
                                        staticRanges={[]}
                                        inputRanges={[]}
                                        moveRangeOnFirstSelection={false}
                                        months={2}
                                        ranges={state}
                                        direction="horizontal"
                                    />
                                </div>
                                <div className="relative lg:w-full md:w-[48%] w-full">
                                    <div className="select-block w-full" onClick={handleOpenGuest}>
                                        <Icon.Users className='icon text-xl left-5' />
                                        <input
                                            className='body2 w-full pl-12 pr-5 py-3 border border-outline rounded-lg'
                                            type="text"
                                            placeholder='Add Guest'
                                            value={`${guest.adult > 0 ? (guest.adult === 1 ? (guest.adult + ' adult') : (guest.adult + ' adults')) : ('')}${guest.children > 0 ? (guest.children === 1 ? (', ' + guest.children + ' children') : (', ' + guest.children + ' childrens')) : ('')}${guest.infant > 0 ? (guest.infant === 1 ? (', ' + guest.infant + ' infant') : (', ' + guest.infant + ' infants')) : ('')}${guest.pet > 0 ? (guest.pet === 1 ? (', ' + guest.pet + ' pet') : (', ' + guest.pet + ' pets')) : ('')}`}
                                            readOnly
                                        />
                                    </div>
                                    <div className={`sub-menu-guest bg-white rounded-b-xl overflow-hidden p-5 absolute top-full md:mt-5 mt-3 left-0 w-full box-shadow md:border-t border-outline ${openGuest ? 'open' : ''}`}>
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
                                        <div className="item flex items-center justify-between pb-4 pt-4 border-b border-outline">
                                            <div className="left">
                                                <p>Infants</p>
                                                <div className="caption1 text-variant1">(0-2 Years)</div>
                                            </div>
                                            <div className="right flex items-center gap-5">
                                                <div
                                                    className={`minus w-8 h-8 flex items-center justify-center rounded-full border border-outline duration-300 ${guest.infant === 0 ? 'opacity-[0.4] cursor-default' : 'cursor-pointer hover:bg-black hover:text-white'}`}
                                                    onClick={() => decreaseGuest('infant')}
                                                >
                                                    <Icon.Minus weight='bold' />
                                                </div>
                                                <div className="text-title">{guest.infant}</div>
                                                <div
                                                    className="plus w-8 h-8 flex items-center justify-center rounded-full border border-outline cursor-pointer duration-300 hover:bg-black hover:text-white"
                                                    onClick={() => increaseGuest('infant')}
                                                >
                                                    <Icon.Plus weight='bold' />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="item flex items-center justify-between pb-4 pt-4">
                                            <div className="left">
                                                <p>Pets</p>
                                            </div>
                                            <div className="right flex items-center gap-5">
                                                <div
                                                    className={`minus w-8 h-8 flex items-center justify-center rounded-full border border-outline duration-300 ${guest.pet === 0 ? 'opacity-[0.4] cursor-default' : 'cursor-pointer hover:bg-black hover:text-white'}`}
                                                    onClick={() => decreaseGuest('pet')}
                                                >
                                                    <Icon.Minus weight='bold' />
                                                </div>
                                                <div className="text-title">{guest.pet}</div>
                                                <div
                                                    className="plus w-8 h-8 flex items-center justify-center rounded-full border border-outline cursor-pointer duration-300 hover:bg-black hover:text-white"
                                                    onClick={() => increaseGuest('pet')}
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
                                <div className="button-block flex-shrink-0 max-lg:w-[48%] max-md:w-full">
                                    <div className='button-main max-lg:w-full' onClick={handleSearch}>Searching</div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>




            </div>
        </>
    )
}

export default SliderOne