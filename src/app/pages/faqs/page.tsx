'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link';
import * as Icon from "phosphor-react";
import HeaderOne from '@/components/Header/HeaderOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import faqData from '@/data/Faq.json'
import Footer from '@/components/Footer/Footer'

const Faqs = () => {
    const [activeQuestion, setActiveQuestion] = useState<string | undefined>('2')

    const handleActiveQuestion = (question: string) => {
        setActiveQuestion(prevQuestion => prevQuestion === question ? undefined : question)
    }

    return (
        <>
            <HeaderOne />
            <Breadcrumb img='/images/breadcrumb/1920x320.png' heading='Frequently Asked Questions' subHeading="Curious Minds, Clear Answers. Navigating GlampHub's FAQs." />
            <div className='faqs lg:py-20 md:py-14 py-10'>
                <div className="container">
                    <div className='main flex items-center justify-center'>
                        <div className="lg:basis-2/3 md:basis-5/6">
                            <div>
                                <div className="heading4">Booking and Payment</div>
                                <div className="list-faqs flex flex-col gap-3 mt-7">
                                    {faqData.slice(0, 5).map(item => (
                                        <div
                                            key={item.id}
                                            className={`question-item cursor-pointer p-5 border border-outline rounded-xl duration-500 hover:border-variant1 ${activeQuestion === item.id ? 'open' : ''}`}
                                            onClick={() => handleActiveQuestion(item.id)}
                                        >
                                            <div className="question-item-main flex items-center justify-between heading6 relative pr-8">{item.question}
                                                <Icon.Plus className='icon-plus text-xl absolute top-1/2 -translate-y-1/2 right-0' />
                                                <Icon.Minus className='icon-minus text-xl absolute top-1/2 -translate-y-1/2 right-0' />
                                            </div>
                                            <div className="content-question">
                                                <div className="text-variant1 pt-3">{item.answer}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='lg:pt-20 md:pt-14 pt-10'>
                                <div className="heading4">Facilities and Services</div>
                                <div className="list-faqs flex flex-col gap-3 mt-7">
                                    {faqData.slice(5, 13).map(item => (
                                        <div
                                            key={item.id}
                                            className={`question-item cursor-pointer p-5 border border-outline rounded-xl duration-500 hover:border-variant1 ${activeQuestion === item.id ? 'open' : ''}`}
                                            onClick={() => handleActiveQuestion(item.id)}
                                        >
                                            <div className="question-item-main flex items-center justify-between heading6 relative pr-8">{item.question}
                                                <Icon.Plus className='icon-plus text-xl absolute top-1/2 -translate-y-1/2 right-0' />
                                                <Icon.Minus className='icon-minus text-xl absolute top-1/2 -translate-y-1/2 right-0' />
                                            </div>
                                            <div className="content-question">
                                                <div className="text-variant1 pt-3">{item.answer}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='lg:pt-20 md:pt-14 pt-10'>
                                <div className="heading4">Safety and Security</div>
                                <div className="list-faqs flex flex-col gap-3 mt-7">
                                    {faqData.slice(13, 20).map(item => (
                                        <div
                                            key={item.id}
                                            className={`question-item cursor-pointer p-5 border border-outline rounded-xl duration-500 hover:border-variant1 ${activeQuestion === item.id ? 'open' : ''}`}
                                            onClick={() => handleActiveQuestion(item.id)}
                                        >
                                            <div className="question-item-main flex items-center justify-between heading6 relative pr-8">{item.question}
                                                <Icon.Plus className='icon-plus text-xl absolute top-1/2 -translate-y-1/2 right-0' />
                                                <Icon.Minus className='icon-minus text-xl absolute top-1/2 -translate-y-1/2 right-0' />
                                            </div>
                                            <div className="content-question">
                                                <div className="text-variant1 pt-3">{item.answer}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Faqs