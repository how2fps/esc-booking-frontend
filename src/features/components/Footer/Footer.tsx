'use client'

import Link from 'next/link';
import * as Icon from "phosphor-react";

const Footer = () => {
    return (
        <>
            <div id="footer" className='footer' data-testid = "footer">
                <div className="bg-surface lg:pt-15 md:pt-12 pt-8">
                    <div className="container">
                        <div className="footer-heading flex items-center justify-between flex-wrap gap-6 pb-[30px] border-b border-outline">
                            <Link href={'/'}>
                                <img
                                     src={'/images/logo/Vector.png'}
                                     width={2000}
                                     height={1000}
                                     alt='logo'
                                   className='sm:w-[40px] w-[40px]'
                                />
                            </Link>
                            <div className="flex items-center flex-wrap gap-4">
                                <div className="text-button-sm">Follow Us:</div>
                                <div className="list-social flex items-center flex-wrap gap-3">
                                    <Link href={'https://www.facebook.com/'} target='_blank'
                                        className='bg-white duration-300 hover:bg-primary hover:text-white w-10 h-10 rounded-full flex items-center justify-center'
                                    >
                                        <Icon.FacebookLogo size={20} className="text-sm" />
                                    </Link>
                                    <Link href={'https://www.linkedin.com/'} target='_blank'
                                        className='bg-white duration-300 hover:bg-primary hover:text-white w-10 h-10 rounded-full flex items-center justify-center'
                                    >
                                        <Icon.LinkedinLogo size={20} className="text-sm" />
                                    </Link>
                                    <Link href={'https://www.twitter.com/'} target='_blank'
                                        className='bg-white duration-300 hover:bg-primary hover:text-white w-10 h-10 rounded-full flex items-center justify-center'
                                    >
                                        <Icon.TwitterLogo size={20} className="text-sm" />
                                    </Link>
                                    <Link href={'https://www.pinterest.com/'} target='_blank'
                                        className='bg-white duration-300 hover:bg-primary hover:text-white w-10 h-10 rounded-full flex items-center justify-center'
                                    >
                                        <Icon.PinterestLogo size={20} className="text-sm" />
                                    </Link>
                                    <Link href={'https://www.instagram.com/'} target='_blank'
                                        className='bg-white duration-300 hover:bg-primary hover:text-white w-10 h-10 rounded-full flex items-center justify-center'
                                    >
                                        <Icon.InstagramLogo size={20} className="text-sm" />
                                    </Link>
                                    <Link href={'https://www.youtube.com/'} target='_blank'
                                        className='bg-white duration-300 hover:bg-primary hover:text-white w-10 h-10 rounded-full flex items-center justify-center'
                                    >
                                        <Icon.YoutubeLogo size={20} className="text-sm" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="footer-main flex justify-between flex-wrap gap-y-8 lg:py-10 md:py-8 py-6">
                            <div className="company-infor lg:w-1/4 sm:w-1/2">
                                <div className="flex items-center gap-4">
                           
                                    <div>
                                        <div className="caption1 text-variant1 pl-0">Need help? 24/7</div>
                                        <div className="text-title pl-0">+65 6235 3535</div>
                                    </div>
                                </div>
                                <div className="location flex items-center gap-2 mt-3 pl-0">
                                    <Icon.MapPin className='caption1' />
                                    <div className="caption1">8 Somapah Road</div>
                                </div>
                                <div className="form-search mt-5">

                                </div>
                            </div>
                            <div className="list-nav lg:w-2/3 w-full sm:flex max-sm:grid grid-cols-2 gap-8 justify-between">
                                <div className="item">
                                    <div className="text-title pb-3">Support</div>
                                    <Link href={'/pages/contact'} className="caption1 text-variant1 has-line block w-fit whitespace-nowrap pl-3">Help Center</Link>
                                    <Link href={'/pages/contact'} className="caption1 text-variant1 has-line block w-fit whitespace-nowrap mt-2 pl-3">Contact Us</Link>
                                </div>
                                
                               
                                <div className="item">
                                    <div className="text-title pb-4">Download App</div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom py-4 border-t border-outline">
                        <div className="container">
                            <div className="flex items-center sm:justify-between justify-center flex-wrap gap-4">
                                <div className="copyright caption1 text-variant1">©2025 GlampHub. All Rights Reserved.</div>
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