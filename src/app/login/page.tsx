'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link';
import * as Icon from "phosphor-react";
import HeaderOne from '@/components/Header/HeaderOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'

const Login = () => {
    return (
        <>
            <HeaderOne />
            <Breadcrumb img='/images/breadcrumb/1920x320.png' heading='login' subHeading="Access Your Account. GlampHub's Secure Login Experience." />
            <div className='login-us lg:py-20 md:py-14 py-10'>
                <div className="container">
                    <div className="content flex items-center justify-center">
                        <div id="form-login" className='xl:basis-1/3 lg:basis-1/2 sm:basis-2/3 max-sm:w-full'>
                            <div className="heading3 text-center">Login</div>
                            <form className="md:mt-10 mt-6">
                                <div className="email ">
                                    <label htmlFor="username" className='text-variant1'>Username or email address<span className='text-primary'>*</span></label>
                                    <input className="border-line px-4 pt-3 pb-3 w-full rounded-lg mt-2" id="username" type="email" placeholder="" required />
                                </div>
                                <div className="pass mt-5">
                                    <label htmlFor="password" className='text-variant1'>Password<span className='text-primary'>*</span></label>
                                    <input className="border-line px-4 pt-3 pb-3 w-full rounded-lg mt-2" id="password" type="password" placeholder="" required />
                                </div>
                                <div className="flex items-center justify-between flex-wrap mt-5">
                                    <div className='flex items-center'>
                                        <div className="checkbox-input">
                                            <input
                                                type="checkbox"
                                                name='remember'
                                                id='remember'
                                            />
                                            <Icon.CheckSquare size={20} weight='fill' className='icon-checkbox' />
                                        </div>
                                        <label htmlFor='remember' className="pl-2 cursor-pointer caption1 text-variant1">Remember me</label>
                                    </div>
                                    <Link href={'#!'} className='caption1 text-primary has-line line-primary'>Forget Your Password?</Link>
                                </div>
                                <div className="my-6 py-3 relative">
                                    <div className=' w-full h-px bg-outline'></div>
                                    <span className='text-variant1 px-5 bg-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>or sign up with</span>
                                </div>
                                <div className="other-login mt-6">
                                    <div className="item py-3 bg-surface border border-outline rounded-lg flex items-center justify-center gap-3 cursor-pointer duration-300 hover:bg-black hover:text-white">
                                        <span className='icon-facebook w-6 h-6 flex items-center justify-center bg-[#3A559F] rounded-full text-white text-sm'></span>
                                        <div className="font-semibold">Continue with Facebook</div>
                                    </div>
                                    <div className="item py-3 bg-surface border border-outline rounded-lg flex items-center justify-center gap-3 cursor-pointer duration-300 hover:bg-black hover:text-white mt-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                            <g clip-path="url(#clip0_8918_4190)">
                                                <path d="M24.2643 12.2763C24.2643 11.4605 24.1982 10.6404 24.0571 9.83789H12.7383V14.4589H19.22C18.951 15.9492 18.0868 17.2676 16.8213 18.1054V21.1037H20.6883C22.9591 19.0137 24.2643 15.9272 24.2643 12.2763Z" fill="#1777D1" />
                                                <path d="M12.7391 24.0008C15.9756 24.0008 18.705 22.9382 20.6936 21.1039L16.8266 18.1055C15.7507 18.8375 14.3618 19.252 12.7435 19.252C9.61291 19.252 6.95849 17.1399 6.00607 14.3003H2.01562V17.3912C4.05274 21.4434 8.20192 24.0008 12.7391 24.0008Z" fill="#34A853" />
                                                <path d="M6.00082 14.3002C5.49816 12.8099 5.49816 11.196 6.00082 9.70569V6.61475H2.01478C0.312781 10.0055 0.312781 14.0004 2.01478 17.3912L6.00082 14.3002Z" fill="#FBBC04" />
                                                <path d="M12.7391 4.74966C14.4499 4.7232 16.1034 5.36697 17.3425 6.54867L20.7685 3.12262C18.5991 1.0855 15.7198 -0.034466 12.7391 0.000808666C8.20192 0.000808666 4.05274 2.55822 2.01562 6.61481L6.00166 9.70575C6.94967 6.86173 9.6085 4.74966 12.7391 4.74966Z" fill="#EA4335" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_8918_4190">
                                                    <rect width="24" height="24" fill="white" transform="translate(0.5)" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        <div className="font-semibold">Continue with Google</div>
                                    </div>
                                    <div className="item py-3 bg-surface border border-outline rounded-lg flex items-center justify-center gap-3 cursor-pointer duration-300 hover:bg-black hover:text-white mt-3">
                                        <span className='icon-twitter text-[#33CCFF] text-2xl'></span>
                                        <div className="font-semibold">Continue with Twitter</div>
                                    </div>
                                </div>
                                <div className="block-button mt-6">
                                    <button className="button-main w-full text-center">Login</button>
                                </div>
                            </form>
                            <div className="flex items-center justify-center gap-2 mt-5">
                                <div className="caption1 text-variant1">Not registered yet?</div>
                                <Link href={'/register'} className='text-button-sm text-black has-line'>Register</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Login