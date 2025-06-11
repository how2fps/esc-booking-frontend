'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import * as Icon from "phosphor-react";

const Footer = () => {
    return (
        <>
            <div id="footer" className='footer'>
                <div className="bg-surface lg:pt-15 md:pt-12 pt-8">
                    <div className="container">
                        <div className="footer-heading flex items-center justify-between flex-wrap gap-6 pb-[30px] border-b border-outline">
                            <Link href={'/'}>
                                <Image
                                    src={'/images/logo.png'}
                                    width={2000}
                                    height={1000}
                                    alt='logo'
                                    priority={true}
                                    className='w-[220px]'
                                />
                            </Link>
                            <div className="flex items-center flex-wrap gap-4">
                                <div className="text-button-sm">Follow Us:</div>
                                <div className="list-social flex items-center flex-wrap gap-3">
                                    <Link href={'https://www.facebook.com/'} target='_blank'
                                        className='bg-white duration-300 hover:bg-primary hover:text-white w-10 h-10 rounded-full flex items-center justify-center'
                                    >
                                        <span className='icon-facebook text-sm'></span>
                                    </Link>
                                    <Link href={'https://www.linkedin.com/'} target='_blank'
                                        className='bg-white duration-300 hover:bg-primary hover:text-white w-10 h-10 rounded-full flex items-center justify-center'
                                    >
                                        <span className='icon-linkedin text-sm'></span>
                                    </Link>
                                    <Link href={'https://www.twitter.com/'} target='_blank'
                                        className='bg-white duration-300 hover:bg-primary hover:text-white w-10 h-10 rounded-full flex items-center justify-center'
                                    >
                                        <span className='icon-twitter text-sm'></span>
                                    </Link>
                                    <Link href={'https://www.pinterest.com/'} target='_blank'
                                        className='bg-white duration-300 hover:bg-primary hover:text-white w-10 h-10 rounded-full flex items-center justify-center'
                                    >
                                        <span className='icon-pinterest text-sm'></span>
                                    </Link>
                                    <Link href={'https://www.instagram.com/'} target='_blank'
                                        className='bg-white duration-300 hover:bg-primary hover:text-white w-10 h-10 rounded-full flex items-center justify-center'
                                    >
                                        <span className='icon-instagram text-sm'></span>
                                    </Link>
                                    <Link href={'https://www.youtube.com/'} target='_blank'
                                        className='bg-white duration-300 hover:bg-primary hover:text-white w-10 h-10 rounded-full flex items-center justify-center'
                                    >
                                        <span className='icon-youtube text-sm'></span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="footer-main flex justify-between flex-wrap gap-y-8 lg:py-10 md:py-8 py-6">
                            <div className="company-infor lg:w-1/4 sm:w-1/2">
                                <div className="flex items-center gap-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                                        <path d="M26.43 16.1254C25.785 16.1254 25.275 15.6004 25.275 14.9704C25.275 14.4154 24.72 13.2604 23.79 12.2554C22.875 11.2804 21.87 10.7104 21.03 10.7104C20.385 10.7104 19.875 10.1854 19.875 9.55539C19.875 8.92539 20.4 8.40039 21.03 8.40039C22.53 8.40039 24.105 9.21039 25.485 10.6654C26.775 12.0304 27.6 13.7254 27.6 14.9554C27.6 15.6004 27.075 16.1254 26.43 16.1254Z" fill="#E05028" />
                                        <path opacity="0.5" d="M31.8456 16.125C31.2006 16.125 30.6906 15.6 30.6906 14.97C30.6906 9.645 26.3556 5.325 21.0456 5.325C20.4006 5.325 19.8906 4.8 19.8906 4.17C19.8906 3.54 20.4006 3 21.0306 3C27.6306 3 33.0006 8.37 33.0006 14.97C33.0006 15.6 32.4756 16.125 31.8456 16.125Z" fill="#E05028" />
                                        <path opacity="0.5" d="M17.685 21.315L12.78 26.22C12.24 25.74 11.715 25.245 11.205 24.735C9.66 23.175 8.265 21.54 7.02 19.83C5.79 18.12 4.8 16.41 4.08 14.715C3.36 13.005 3 11.37 3 9.81C3 8.79 3.18 7.815 3.54 6.915C3.9 6 4.47 5.16 5.265 4.41C6.225 3.465 7.275 3 8.385 3C8.805 3 9.225 3.09 9.6 3.27C9.99 3.45 10.335 3.72 10.605 4.11L14.085 9.015C14.355 9.39 14.55 9.735 14.685 10.065C14.82 10.38 14.895 10.695 14.895 10.98C14.895 11.34 14.79 11.7 14.58 12.045C14.385 12.39 14.1 12.75 13.74 13.11L12.6 14.295C12.435 14.46 12.36 14.655 12.36 14.895C12.36 15.015 12.375 15.12 12.405 15.24C12.45 15.36 12.495 15.45 12.525 15.54C12.795 16.035 13.26 16.68 13.92 17.46C14.595 18.24 15.315 19.035 16.095 19.83C16.635 20.355 17.16 20.865 17.685 21.315Z" fill="#E05028" />
                                        <path d="M32.9554 27.4955C32.9554 27.9155 32.8804 28.3505 32.7304 28.7705C32.6854 28.8905 32.6404 29.0105 32.5804 29.1305C32.3254 29.6705 31.9954 30.1805 31.5604 30.6605C30.8254 31.4705 30.0154 32.0555 29.1004 32.4305C29.0854 32.4305 29.0704 32.4455 29.0554 32.4455C28.1704 32.8055 27.2104 33.0005 26.1754 33.0005C24.6454 33.0005 23.0104 32.6405 21.2854 31.9055C19.5604 31.1705 17.8354 30.1805 16.1254 28.9355C15.5404 28.5005 14.9554 28.0655 14.4004 27.6005L19.3054 22.6955C19.7254 23.0105 20.1004 23.2505 20.4154 23.4155C20.4904 23.4455 20.5804 23.4905 20.6854 23.5355C20.8054 23.5805 20.9254 23.5955 21.0604 23.5955C21.3154 23.5955 21.5104 23.5055 21.6754 23.3405L22.8154 22.2155C23.1904 21.8405 23.5504 21.5555 23.8954 21.3755C24.2404 21.1655 24.5854 21.0605 24.9604 21.0605C25.2454 21.0605 25.5454 21.1205 25.8754 21.2555C26.2054 21.3905 26.5504 21.5855 26.9254 21.8405L31.8904 25.3655C32.2804 25.6355 32.5504 25.9505 32.7154 26.3255C32.8654 26.7005 32.9554 27.0755 32.9554 27.4955Z" fill="#E05028" />
                                    </svg>
                                    <div>
                                        <div className="caption1 text-variant1">Need help? 24/7</div>
                                        <div className="text-title">001-1234-88888</div>
                                    </div>
                                </div>
                                <div className="caption1 mt-5">Book Glamping Hassle-Free with GlampHub and Boost Your Income.</div>
                                <div className="location flex items-center gap-2 mt-3">
                                    <Icon.MapPin className='caption1' />
                                    <div className="caption1">101 E 129th St, East Chicago, IN 46312, US</div>
                                </div>
                                <div className="form-search mt-5">
                                    <form className='w-full relative rounded-lg overflow-hidden'>
                                        <input type="email" required placeholder='Your email address' className='caption1 h-[46px] pl-4 pr-14 w-full rounded-lg' />
                                        <button className='w-12 h-full bg-primary flex items-center justify-center flex-shrink-0 absolute top-0 right-0 text-white duration-300 hover:bg-[#c42e04]'>
                                            <Icon.PaperPlaneTilt weight='bold' className='text-xl' />
                                        </button>
                                    </form>
                                </div>
                            </div>
                            <div className="list-nav lg:w-2/3 w-full sm:flex max-sm:grid grid-cols-2 gap-8 justify-between">
                                <div className="item">
                                    <div className="text-title pb-3">Support</div>
                                    <Link href={'/pages/contact'} className="caption1 text-variant1 has-line block w-fit whitespace-nowrap">Help Center</Link>
                                    <Link href={'/pages/contact'} className="caption1 text-variant1 has-line block w-fit whitespace-nowrap mt-2">Contact Us</Link>
                                    <Link href={'/pages/faqs'} className="caption1 text-variant1 has-line block w-fit whitespace-nowrap mt-2">Glamp FAQ</Link>
                                    <Link href={'/term-of-use'} className="caption1 text-variant1 has-line block w-fit whitespace-nowrap mt-2">Booking Policy</Link>
                                    <Link href={'/term-of-use'} className="caption1 text-variant1 has-line block w-fit whitespace-nowrap mt-2">Booking Guide</Link>
                                    <Link href={'/pages/review'} className="caption1 text-variant1 has-line block w-fit whitespace-nowrap mt-2">Feedback</Link>
                                </div>
                                <div className="item">
                                    <div className="text-title pb-3">About Us</div>
                                    <Link href={'/about'} className="caption1 text-variant1 has-line block w-fit whitespace-nowrap">About Us</Link>
                                    <Link href={'/about'} className="caption1 text-variant1 has-line block w-fit whitespace-nowrap mt-2">Our Story</Link>
                                    <Link href={'#!'} className="caption1 text-variant1 has-line block w-fit whitespace-nowrap mt-2">Journal</Link>
                                    <Link href={'/blog/blog-default'} className="caption1 text-variant1 has-line block w-fit whitespace-nowrap mt-2">Late News</Link>
                                    <Link href={'#!'} className="caption1 text-variant1 has-line block w-fit whitespace-nowrap mt-2">Site Map</Link>
                                    <Link href={'#!'} className="caption1 text-variant1 has-line block w-fit whitespace-nowrap mt-2">Partnerships</Link>
                                </div>
                                <div className="item">
                                    <div className="text-title pb-3">Hosting</div>
                                    <Link href={'#!'} className="caption1 text-variant1 has-line block w-fit whitespace-nowrap">Become A Host</Link>
                                    <Link href={'#!'} className="caption1 text-variant1 has-line block w-fit whitespace-nowrap mt-2">Insurance</Link>
                                    <Link href={'#!'} className="caption1 text-variant1 has-line block w-fit whitespace-nowrap mt-2">Standards</Link>
                                    <Link href={'#!'} className="caption1 text-variant1 has-line block w-fit whitespace-nowrap mt-2">Hosting FAQ</Link>
                                </div>
                                <div className="item">
                                    <div className="text-title pb-4">Download App</div>
                                    <Link href={'#!'}>
                                        <Image
                                            src={'/images/footer/chplay.png'}
                                            width={2000}
                                            height={1000}
                                            alt='chplay'
                                            priority={true}
                                            className='w-[135px]'
                                        />
                                    </Link>
                                    <Link href={'#!'}>
                                        <Image
                                            src={'/images/footer/appstore.png'}
                                            width={2000}
                                            height={1000}
                                            alt='appstore'
                                            priority={true}
                                            className='w-[135px] mt-2'
                                        />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom py-4 border-t border-outline">
                        <div className="container">
                            <div className="flex items-center sm:justify-between justify-center flex-wrap gap-4">
                                <div className="copyright caption1 text-variant1">©2023 GlampHub. All Rights Reserved.</div>
                                <div className="flex items-center gap-3">
                                    <Link href={'/term-of-use'} className='caption1 text-variant1 has-line'>Terms Of Services</Link>
                                    <div className='bg-outline w-px h-4'></div>
                                    <Link href={'/term-of-use'} className='caption1 text-variant1 has-line'>Privacy Policy</Link>
                                    <div className='bg-outline w-px h-4'></div>
                                    <Link href={'/term-of-use'} className='caption1 text-variant1 has-line'>Cookie Policy</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Footer