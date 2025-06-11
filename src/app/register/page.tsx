'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link';
import * as Icon from "phosphor-react";
import HeaderOne from '@/components/Header/HeaderOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'

const Register = () => {
    return (
        <>
            <HeaderOne />
            <Breadcrumb img='/images/breadcrumb/1920x320.png' heading='Register' subHeading="Access Your Account. GlampHub's Secure Register Experience." />
            <div className='login-us lg:py-20 md:py-14 py-10'>
                <div className="container">
                    <div className="content flex items-center justify-center">
                        <div id="form-login" className='xl:basis-1/3 lg:basis-1/2 sm:basis-2/3 max-sm:w-full'>
                            <div className="heading3 text-center">Register</div>
                            <form className="md:mt-10 mt-6">
                                <div className="email ">
                                    <label htmlFor="username" className='text-variant1'>Username or email address<span className='text-primary'>*</span></label>
                                    <input className="border-line px-4 pt-3 pb-3 w-full rounded-lg mt-2" id="username" type="email" placeholder="" required />
                                </div>
                                <div className="pass mt-5">
                                    <label htmlFor="password" className='text-variant1'>Password<span className='text-primary'>*</span></label>
                                    <input className="border-line px-4 pt-3 pb-3 w-full rounded-lg mt-2" id="password" type="password" placeholder="" required />
                                </div>
                                <div className="pass mt-5">
                                    <label htmlFor="confirmPassword" className='text-variant1'>Confirm Password<span className='text-primary'>*</span></label>
                                    <input className="border-line px-4 pt-3 pb-3 w-full rounded-lg mt-2" id="confirmPassword" type="password" placeholder="" required />
                                </div>
                                <div className='flex items-center mt-5'>
                                    <div className="checkbox-input">
                                        <input
                                            type="checkbox"
                                            name='agree'
                                            id='agree'
                                        />
                                        <Icon.CheckSquare size={20} weight='fill' className='icon-checkbox' />
                                    </div>
                                    <label htmlFor='agree' className="pl-2 cursor-pointer caption1 text-variant1">I agree to the
                                        <Link href={'/term-of-use'} className='text-button-sm text-black has-line ml-1'>Terms of Use</Link>
                                    </label>
                                </div>
                                <div className="block-button mt-6">
                                    <button className="button-main w-full text-center">Register</button>
                                </div>
                            </form>
                            <div className="flex items-center justify-center gap-2 mt-5">
                                <div className="caption1 text-variant1">Already have an account?</div>
                                <Link href={'/login'} className='text-button-sm text-black has-line'>Login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Register