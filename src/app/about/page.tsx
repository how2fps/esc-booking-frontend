'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import * as Icon from "phosphor-react";
import HeaderOne from '@/components/Header/HeaderOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Amenities from '@/components/Amenities/Amenities';
import Benefit from '@/components/Benefit/Benefit';
import testimonialData from '@/data/Testimonial.json'
import Testimonial from '@/components/Testimonial/Testimonial';
import TextHeading from '@/components/TextHeading/TextHeading';
import Footer from '@/components/Footer/Footer'

const About = () => {
    const [openVideo, setOpenVideo] = useState<boolean>(false)

    return (
        <>
            <HeaderOne />
            <Breadcrumb img='/images/breadcrumb/1920x320.png' heading='About The GlampHub' subHeading='Unveiling the Heart of GlampHub. Where Nature and Luxury Coexist' />
            <div className="video-greeting lg:pt-20 md:pt-14 pt-10">
                <div className="container">
                    <div className="heading flex flex-col items-center justify-center">
                        <div className="heading2 text-center">Welcome to the GlampHub</div>
                        <div className="body2 text-variant1 text-center mt-4">Less than a 2.5 hour drive from downtown Boston and convenient to the trailheads, scenic views and swimming holes of the White Mountain National Forest, Huttopia White Mountains is an ideal place to escape to nature.</div>
                    </div>
                    <div className="video-block relative rounded-[20px] overflow-hidden md:mt-10 mt-6">
                        <div className="bg-img w-full">
                            <Image
                                src={'/images/other/bg-about.png'}
                                width={2000}
                                height={1000}
                                alt='bg-img'
                                priority={true}
                                className='w-full max-md:h-[300px] object-cover'
                            />
                        </div>
                        <div
                            className="play-btn bg-primary duration-300 hover:bg-primary-hover lg:w-[100px] sm:w-[80px] w-[60px] lg:h-[100px] sm:h-[80px] h-[60px] rounded-full cursor-pointer flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                            onClick={() => setOpenVideo(true)}
                        >
                            <Icon.Play className='lg:text-5xl sm:text-4xl text-3xl text-white' weight='fill' />
                        </div>
                    </div>
                </div>
            </div>
            <div className={`modal-video-block`} onClick={() => setOpenVideo(false)}>
                <div
                    className={`modal-video-main ${openVideo ? 'open' : ''}`}
                    onClick={(e) => { e.stopPropagation() }}
                >
                    <iframe src="https://www.youtube.com/embed/ilY3WAUTXaE?si=ryu4TuMisTtYqW3L"></iframe>
                </div>
            </div>
            <Amenities />
            <Benefit />
            <Testimonial data={testimonialData} />
            <div className="team-block lg:pt-20 md:pt-14 pt-10">
                <div className="container">
                    <TextHeading title='Meet our Team' subTitle='Our team of Glamping enthusiasts and experts is at the heart of our mission' />
                    <div className="list grid md:grid-cols-3 gap-[30px] md:mt-10 mt-6">
                        <div className="item">
                            <div className="avatar rounded-3xl overflow-hidden">
                                <Image
                                    src={'/images/avatar/615x615.png'}
                                    width={1000}
                                    height={800}
                                    alt='team1'
                                    priority={true}
                                    className='w-full'
                                />
                            </div>
                            <div className="flex items-center justify-between mt-5">
                                <div>
                                    <div className="heading5">John Smith</div>
                                    <div className="caption1 text-variant1 mt-1">Graphic Designer</div>
                                </div>
                                <Link href={'https://www.twitter.com/'} target='_blank'
                                    className='bg-surface duration-300 hover:bg-primary hover:text-white w-12 h-12 rounded-full flex items-center justify-center'
                                >
                                    <span className='icon-twitter text-lg'></span>
                                </Link>
                            </div>
                        </div>
                        <div className="item">
                            <div className="avatar rounded-3xl overflow-hidden">
                                <Image
                                    src={'/images/avatar/615x615.png'}
                                    width={1000}
                                    height={800}
                                    alt='team1'
                                    priority={true}
                                    className='w-full'
                                />
                            </div>
                            <div className="flex items-center justify-between mt-5">
                                <div>
                                    <div className="heading5">Chris Patt</div>
                                    <div className="caption1 text-variant1 mt-1">CEO - DigiNova</div>
                                </div>
                                <Link href={'https://www.twitter.com/'} target='_blank'
                                    className='bg-surface duration-300 hover:bg-primary hover:text-white w-12 h-12 rounded-full flex items-center justify-center'
                                >
                                    <span className='icon-twitter text-lg'></span>
                                </Link>
                            </div>
                        </div>
                        <div className="item">
                            <div className="avatar rounded-3xl overflow-hidden">
                                <Image
                                    src={'/images/avatar/615x615.png'}
                                    width={1000}
                                    height={800}
                                    alt='team1'
                                    priority={true}
                                    className='w-full'
                                />
                            </div>
                            <div className="flex items-center justify-between mt-5">
                                <div>
                                    <div className="heading5">Jack halow</div>
                                    <div className="caption1 text-variant1 mt-1">Photographer</div>
                                </div>
                                <Link href={'https://www.twitter.com/'} target='_blank'
                                    className='bg-surface duration-300 hover:bg-primary hover:text-white w-12 h-12 rounded-full flex items-center justify-center'
                                >
                                    <span className='icon-twitter text-lg'></span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="cta-block lg:my-20 md:my-14 my-10">
                <div className="container">
                    <div className="content-main bg-surface sm:py-10 py-8 lg:px-[60px] sm:px-10 px-8 rounded-[20px] sm:flex items-center justify-between">
                        <div className="left sm:w-3/5">
                            <div className="heading3">Join the Glamping Community</div>
                            <div className="body2 text-variant1 sm:mt-4 mt-3">Stay engaged with the Glamping community through our events, contests, and exclusive offers. We{String.raw`'re`} more than a platform</div>
                        </div>
                        <div className="right flex-shrink-0 max-sm:mt-5">
                            <Link href={'/pages/contact'} className='button-main whitespace-nowrap'>Join us today!</Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default About