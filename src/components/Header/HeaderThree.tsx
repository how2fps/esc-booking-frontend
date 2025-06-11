'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image'
import Link from 'next/link'
import * as Icon from "phosphor-react";
import { addDays } from 'date-fns';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

interface GuestType {
    adult: number;
    children: number;
}

const HeaderThree = () => {
    const router = useRouter()
    const pathname = usePathname()
    const [fixedHeader, setFixedHeader] = useState(false)
    const [lastScrollPosition, setLastScrollPosition] = useState(0);
    const [openMenuMobile, setOpenMenuMobile] = useState<boolean>(false)
    const [openSubNavMobile, setOpenSubNavMobile] = useState<number | null>(null)

    const handleOpenSubNavMobile = (index: number) => {
        setOpenSubNavMobile(openSubNavMobile === index ? null : index)
    }

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setFixedHeader(scrollPosition > 0 && scrollPosition < lastScrollPosition);
            setLastScrollPosition(scrollPosition);
        };

        // Add event scroll when component mounted
        window.addEventListener('scroll', handleScroll);

        // Remove event scroll when component mounted
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollPosition]);

    const [openDate, setOpenDate] = useState(false)
    const [openGuest, setOpenGuest] = useState(false)
    const [location, setLocation] = useState('namibia')
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
            children: 0
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
        router.push(`/camp/topmap-grid?location=${location}&startDate=${state[0].startDate.toLocaleDateString()}&endDate=${state[0].endDate.toLocaleDateString()}&adult=${guest.adult}&children=${guest.children}`)
    }

    return (
        <>
            <div id="header" className='header'>
                <div className={`header-main h-20 w-full bg-white min-[1322px]:px-10 px-4 flex items-center justify-between ${fixedHeader ? 'fixed box-shadow' : ''}`}>
                    <Link href={'/'} className="logo">
                        <Image
                            src={'/images/logo.png'}
                            width={2000}
                            height={1000}
                            alt='logo'
                            priority={true}
                            className='sm:w-[220px] w-[160px]'
                        />
                    </Link>
                    <div className="menu-main style-three relative flex items-center justify-center gap-5 max-xl:hidden">
                        <div className="select-block item flex items-center gap-2 py-2.5 border border-outline rounded-lg">
                            <Icon.MapPin className='icon text-xl left-5' />
                            <input
                                className='body2 pl-12 pr-5 border-0 max-w-[160px]'
                                type="text"
                                placeholder='Search'
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <div className="item py-2.5 px-5 border border-outline rounded-lg cursor-pointer">
                            <div className='flex items-center gap-2' onClick={handleOpenDate}>
                                <Icon.MapPin className='text-xl' />
                                <div className="body2">{state[0].startDate.toLocaleDateString()} - {state[0].endDate.toLocaleDateString()}</div>
                            </div>
                            <DateRangePicker
                                className={`form-date-picker box-shadow ${openDate ? 'open' : ''}`}
                                onChange={item => setState([item.selection] as any)}
                                staticRanges={[]}
                                inputRanges={[]}
                                moveRangeOnFirstSelection={false}
                                months={2}
                                ranges={state}
                                direction="horizontal"
                            />
                        </div>
                        <div className="item py-2.5 px-5 border border-outline rounded-lg">
                            <div className='flex items-center gap-2 cursor-pointer' onClick={handleOpenGuest}>
                                <Icon.MapPin className='text-xl' />
                                <div className="body2">
                                    {/* {guest.adult === 0 && guest.children === 0 ? '0 Guest' : 
                                    `${guest.adult > 0 ? (guest.adult === 1 ? (guest.adult + ' adult') : (guest.adult + ' adults')) : ('')}${guest.children > 0 ? (guest.children === 1 ? (', ' + guest.children + ' children') : (', ' + guest.children + ' childrens')) : ('')}`
                                    } */}
                                    {`${guest.adult + guest.children} guests`}
                                </div>
                            </div>
                            <div className={`sub-menu-guest bg-white rounded-b-xl overflow-hidden p-5 absolute top-full mt-px left-0 w-full box-shadow ${openGuest ? 'open' : ''}`}>
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
                        <div className="item">
                            <div className="button-main" onClick={handleSearch}>Search</div>
                        </div>
                    </div>
                    <div className="right flex items-center gap-3">
                        <div className="weather flex items-center gap-1 max-sm:hidden">
                            <Icon.CloudSun className='text-xl' />
                            <div className="text-button">18°C</div>
                        </div>
                        <div className='bg-outline w-px h-4 max-sm:hidden'></div>
                        <Link href={'/login'} className="text-button max-sm:hidden">Sign In</Link>
                        <div className='bg-outline w-px h-4 max-sm:hidden'></div>
                        <div className="select-block pr-5 max-sm:hidden">
                            <select name="language" id="language" className='text-button'>
                                <option value="EN">EN</option>
                                <option value="FR">FR</option>
                                <option value="GE">GE</option>
                            </select>
                            <Icon.CaretDown className='icon text-base right-0' />
                        </div>
                        <div className='bg-outline w-px h-4 max-sm:hidden'></div>
                        <div className="menu-mobile-icon flex items-center cursor-pointer" onClick={() => setOpenMenuMobile(!openMenuMobile)}>
                            <Icon.List className='sm:text-xl text-2xl text-black' weight='bold' />
                        </div>
                    </div>
                </div>
            </div>

            <div id="menu-mobile" className={`${openMenuMobile ? 'open' : ''}`}>
                <div className="menu-container bg-white h-full">
                    <div className="container h-full">
                        <div className="menu-main h-full overflow-hidden">
                            <div className="heading py-2 relative flex items-center justify-center">
                                <div
                                    className="close-menu-mobile-btn absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface flex items-center justify-center"
                                    onClick={() => setOpenMenuMobile(false)}
                                >
                                    <Icon.X size={14} />
                                </div>
                                <Link href={'/'} className='logo text-center'>
                                    <Image
                                        src={'/images/logo.png'}
                                        width={3000}
                                        height={2000}
                                        alt='logo'
                                        priority={true}
                                        className='md:w-[220px] w-[180px]'
                                    />
                                </Link>
                            </div>
                            <div className="list-nav mt-6">
                                <ul>
                                    <li
                                        className={`${openSubNavMobile === 1 ? 'open' : ''}`}
                                        onClick={() => handleOpenSubNavMobile(1)}
                                    >
                                        <a href={'#!'} className={`text-title uppercase flex items-center justify-between`}>Home
                                            <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span>
                                        </a>
                                        <div className="sub-nav-mobile">
                                            <div
                                                className="back-btn flex items-center gap-3"
                                                onClick={() => handleOpenSubNavMobile(1)}
                                            >
                                                <Icon.CaretLeft />
                                                Back
                                            </div>
                                            <div className="list-nav-item w-full pt-2 pb-6">
                                                <ul>
                                                    <li>
                                                        <Link href="/" className={`nav-item-mobile text-button link text-variant1 duration-300 has-line has-line ${pathname === '/' ? 'active' : ''}`}>
                                                            Homepage 1
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/homepages/home2" className={`nav-item-mobile text-button link text-variant1 duration-300 has-line has-line ${pathname === '/homepages/home2' ? 'active' : ''}`}>
                                                            Homepage 2
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/homepages/home3" className={`nav-item-mobile text-button link text-variant1 duration-300 has-line has-line ${pathname === '/homepages/home3' ? 'active' : ''}`}>
                                                            Homepage 3
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                    <li
                                        className={`${openSubNavMobile === 2 ? 'open' : ''}`}
                                        onClick={() => handleOpenSubNavMobile(2)}
                                    >
                                        <a href={'#!'} className='text-title uppercase flex items-center justify-between mt-5'>Camps
                                            <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span>
                                        </a>
                                        <div className="sub-nav-mobile">
                                            <div
                                                className="back-btn flex items-center gap-3"
                                                onClick={() => handleOpenSubNavMobile(2)}
                                            >
                                                <Icon.CaretLeft />
                                                Back
                                            </div>
                                            <div className="list-nav-item w-full pt-2 pb-6">
                                                <ul>
                                                    <li>
                                                        <Link href="/camp/topmap-grid" className={`nav-item-mobile text-button link text-variant1 duration-300 has-line has-line ${pathname === '/camp/topmap-grid' ? 'active' : ''}`}>
                                                            Find Topmap Grid
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/camp/topmap-list" className={`nav-item-mobile text-button link text-variant1 duration-300 has-line has-line ${pathname === '/camp/topmap-list' ? 'active' : ''}`}>
                                                            Find Topmap List
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/camp/filter-scroll" className={`nav-item-mobile text-button link text-variant1 duration-300 has-line has-line ${pathname === '/camp/filter-scroll' ? 'active' : ''}`}>
                                                            Filters Scrolls
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/camp/filter-dropdown" className={`nav-item-mobile text-button link text-variant1 duration-300 has-line has-line ${pathname === '/camp/filter-dropdown' ? 'active' : ''}`}>
                                                            Filters Dropdown
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/camp/topmap-sidebar" className={`nav-item-mobile text-button link text-variant1 duration-300 has-line has-line ${pathname === '/camp/topmap-sidebar' ? 'active' : ''}`}>
                                                            Find Topmap Sidebar
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/camp/halfmap-grid" className={`nav-item-mobile text-button link text-variant1 duration-300 has-line has-line ${pathname === '/camp/halfmap-grid' ? 'active' : ''}`}>
                                                            Find Halfmap Grid
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/camp/halfmap-list" className={`nav-item-mobile text-button link text-variant1 duration-300 has-line has-line ${pathname === '/camp/halfmap-list' ? 'active' : ''}`}>
                                                            Find Halfmap List
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/camp/tent-detail" className={`nav-item-mobile text-button link text-variant1 duration-300 has-line has-line ${pathname === '/camp/tent-detail' ? 'active' : ''}`}>
                                                            Tent Details
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <Link href={'/about'} className='text-title uppercase flex items-center justify-between mt-5'>About Us
                                            <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span>
                                        </Link>
                                    </li>
                                    <li
                                        className={`${openSubNavMobile === 4 ? 'open' : ''}`}
                                        onClick={() => handleOpenSubNavMobile(4)}
                                    >
                                        <a href={'#!'} className='text-title uppercase flex items-center justify-between mt-5'>Blog
                                            <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span>
                                        </a>
                                        <div className="sub-nav-mobile">
                                            <div
                                                className="back-btn flex items-center gap-3"
                                                onClick={() => handleOpenSubNavMobile(4)}
                                            >
                                                <Icon.CaretLeft />
                                                Back
                                            </div>
                                            <div className="list-nav-item w-full pt-2 pb-6">
                                                <ul className='w-full'>
                                                    <li>
                                                        <Link href="/blog/default" className={`nav-item-mobile text-button link text-variant1 duration-300 has-line ${pathname === '/blog/default' ? 'active' : ''}`}>
                                                            Blog Default
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/blog/grid" className={`nav-item-mobile text-button link text-variant1 duration-300 has-line ${pathname === '/blog/grid' ? 'active' : ''}`}>
                                                            Blog Grid
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/blog/detail" className={`nav-item-mobile text-button link text-variant1 duration-300 has-line ${pathname === '/blog/detail' ? 'active' : ''}`}>
                                                            Blog Detail
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                    <li
                                        className={`${openSubNavMobile === 5 ? 'open' : ''}`}
                                        onClick={() => handleOpenSubNavMobile(5)}
                                    >
                                        <a href={'#!'} className='text-title uppercase flex items-center justify-between mt-5'>Pages
                                            <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span>
                                        </a>
                                        <div className="sub-nav-mobile">
                                            <div
                                                className="back-btn flex items-center gap-3"
                                                onClick={() => handleOpenSubNavMobile(5)}
                                            >
                                                <Icon.CaretLeft />
                                                Back
                                            </div>
                                            <div className="list-nav-item w-full pt-2 pb-6">
                                                <ul className='w-full'>
                                                    <li>
                                                        <Link href="/pages/contact" className={`nav-item-mobile text-button link text-variant1 duration-300 has-line ${pathname === '/pages/contact' ? 'active' : ''}`}>
                                                            Contact Us
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/pages/faqs" className={`nav-item-mobile text-button link text-variant1 duration-300 has-line ${pathname === '/pages/faqs' ? 'active' : ''}`}>
                                                            FAQs
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/pages/review" className={`nav-item-mobile text-button link text-variant1 duration-300 has-line ${pathname === '/pages/review' ? 'active' : ''}`}>
                                                            Review
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HeaderThree