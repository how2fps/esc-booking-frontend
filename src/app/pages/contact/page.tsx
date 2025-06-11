'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link';
import * as Icon from "phosphor-react";
import HeaderOne from '@/components/Header/HeaderOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'

const Contact = () => {
    return (
        <>
            <HeaderOne />
            <Breadcrumb img='/images/breadcrumb/1920x320.png' heading='Contact Us' subHeading='Reach Out to GlampHub. Your Gateway to Outdoor Luxury.' />
            <div className='contact-us lg:pt-20 md:pt-14 pt-10'>
                <div className="container">
                    <div className="flex justify-between max-lg:flex-col gap-y-10">
                        <div className="left lg:w-1/2 lg:pr-[30px]">
                            <div className="infor">
                                <div className="heading">
                                    <div className="heading4">We’d love to help</div>
                                    <div className="body2 text-variant1 mt-4">Your Glamping Dreams, Our Expertise: Crafting Unforgettable Adventures Together</div>
                                </div>
                                <div className="style-contact-us">
                                    <div className="list-social flex items-center flex-wrap gap-5 mt-4">
                                        <Link className="item rounded-full md:w-[52px] w-12 md:h-[52px] h-12 flex items-center justify-center flex-shrink-0 border border-outline text-variant1 duration-500 hover:border-primary hover:bg-primary hover:text-white" href="https://www.facebook.com/" target="_blank">
                                            <i className="icon-facebook md:text-xl text-lg"></i>
                                        </Link>
                                        <Link className="item rounded-full md:w-[52px] w-12 md:h-[52px] h-12 flex items-center justify-center flex-shrink-0 border border-outline text-variant1 duration-500 hover:border-primary hover:bg-primary hover:text-white" href="https://www.linkedin.com/" target="_blank">
                                            <i className="icon-linkedin md:text-xl text-lg"></i>
                                        </Link>
                                        <Link className="item rounded-full md:w-[52px] w-12 md:h-[52px] h-12 flex items-center justify-center flex-shrink-0 border border-outline text-variant1 duration-500 hover:border-primary hover:bg-primary hover:text-white" href="https://www.twitter.com/" target="_blank">
                                            <i className="icon-twitter md:text-xl text-lg"></i>
                                        </Link>
                                        <Link className="item rounded-full md:w-[52px] w-12 md:h-[52px] h-12 flex items-center justify-center flex-shrink-0 border border-outline text-variant1 duration-500 hover:border-primary hover:bg-primary hover:text-white" href="https://www.youtube.com/" target="_blank">
                                            <i className="icon-youtube md:text-xl text-lg"></i>
                                        </Link>
                                        <Link className="item rounded-full md:w-[52px] w-12 md:h-[52px] h-12 flex items-center justify-center flex-shrink-0 border border-outline text-variant1 duration-500 hover:border-primary hover:bg-primary hover:text-white" href="https://www.instagram.com/" target="_blank">
                                            <i className="icon-instagram md:text-lg text-base"></i>
                                        </Link>
                                    </div>
                                </div>
                                <div className="list-more-infor mt-10">
                                    <div className="item flex items-center gap-6">
                                        <div className='flex items-center justify-center w-12 h-12 bg-primary flex-shrink-0 rounded-full'>
                                            <Icon.EnvelopeSimpleOpen className='text-white text-2xl' />
                                        </div>
                                        <div className="w-px h-12 bg-outline"></div>
                                        <div className="body2">hi.avitex@gmail.com</div>
                                    </div>
                                    <div className="item flex items-center gap-6 mt-5">
                                        <div className='flex items-center justify-center w-12 h-12 bg-primary flex-shrink-0 rounded-full'>
                                            <Icon.Phone className='text-white text-2xl' />
                                        </div>
                                        <div className="w-px h-12 bg-outline"></div>
                                        <div className="body2">1-333-345-6868</div>
                                    </div>
                                    <div className="item flex items-center gap-6 mt-5">
                                        <div className='flex items-center justify-center w-12 h-12 bg-primary flex-shrink-0 rounded-full'>
                                            <Icon.MapPinLine className='text-white text-2xl' />
                                        </div>
                                        <div className="w-px h-12 bg-outline"></div>
                                        <div className="body2">101 E 129th St, East Chicago, IN 46312, US</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="right lg:w-1/2 lg:pl-[30px]">
                            <div className="heading4">Drop Us A Line</div>
                            <div className="body2 text-variant1 mt-3">Connect with Us to Embark on a Journey to Create Your Dream Glamping Experience</div>
                            <form className="md:mt-7 mt-4">
                                <div className='grid sm:grid-cols-2 grid-cols-1 gap-5'>
                                    <div className="name">
                                        <label htmlFor="username" className='text-variant1'>Name</label>
                                        <input className="border-line mt-2 px-4 py-3 w-full rounded-lg" id="username" type="text" placeholder="Your Name *" required />
                                    </div>
                                    <div className="email">
                                        <label htmlFor="email" className='text-variant1'>Email</label>
                                        <input className="border-line mt-2 px-4 pt-3 pb-3 w-full rounded-lg" id="email" type="email" placeholder="Your Email *" required />
                                    </div>
                                    <div className="message sm:col-span-2">
                                        <label htmlFor="message" className='text-variant1'>Message</label>
                                        <textarea className="border-line mt-2 px-4 pt-3 pb-3 w-full rounded-lg" id="message" rows={3} placeholder="Your Message *" required />
                                    </div>
                                </div>
                                <div className="block-button md:mt-6 mt-4">
                                    <button className="button-main">Send message</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="map-block lg:my-20 md:my-14 my-10">
                <div className="container">
                    <div className="map">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11895.370988980812!2d-87.938181987167!3d41.810147885967005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e4eb1d9c53135%3A0x1e7c2347e59cb561!2sIBJI%20OrthoAccess%20Immediate%20Care%20-%20Hinsdale!5e0!3m2!1svi!2s!4v1705375385853!5m2!1svi!2s"
                            loading="lazy"
                            className='w-full lg:h-[600px] md:h-[500px] sm:h-[400px] h-[360px] rounded-[20px]'
                        >
                        </iframe>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Contact