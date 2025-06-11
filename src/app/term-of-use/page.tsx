'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link';
import * as Icon from "phosphor-react";
import HeaderOne from '@/components/Header/HeaderOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import StickyBox from 'react-sticky-box';

const Term = () => {
    const [activeTab, setActiveTab] = useState('1')

    const handleActiveTab = (tab: string) => {
        setActiveTab(tab)
    }

    return (
        <>
            <HeaderOne />
            <Breadcrumb img='/images/breadcrumb/1920x320.png' heading='Terms of use' subHeading='Explore our comprehensive Terms of Use to understand the guidelines.' />
            <div className='term-block lg:py-20 md:py-14 py-10'>
                <div className="container">
                    <div className="content-main flex items-start justify-between max-lg:flex-col gap-y-10">
                        <StickyBox offsetTop={100} className='menu-tab lg:basis-1/3'>
                            <div>
                                <ul className="tab-term text-content border-l border-outline overflow-hidden">
                                    <li className={`ct-tab pl-4 ${activeTab === '1' ? 'active' : ''}`} onClick={() => handleActiveTab('1')}>
                                        <Link className="heading5" href="#terms">1. Terms</Link>
                                    </li>
                                    <li className={`ct-tab pl-4 mt-8 ${activeTab === '2' ? 'active' : ''}`} onClick={() => handleActiveTab('2')}>
                                        <Link className="heading5" href="#limitations">2. Limitations</Link>
                                    </li>
                                    <li className={`ct-tab pl-4 mt-8 ${activeTab === '3' ? 'active' : ''}`} onClick={() => handleActiveTab('3')}>
                                        <Link className="heading5" href="#revisions">3. Revisions and errata</Link>
                                    </li>
                                    <li className={`ct-tab pl-4 mt-8 ${activeTab === '4' ? 'active' : ''}`} onClick={() => handleActiveTab('4')}>
                                        <Link className="heading5" href="#modifications">4. Site terms of use modifications</Link>
                                    </li>
                                    <li className={`ct-tab pl-4 mt-8 ${activeTab === '5' ? 'active' : ''}`} onClick={() => handleActiveTab('5')}>
                                        <Link className="heading5" href="#risks">5. Risks</Link>
                                    </li>
                                </ul>
                            </div>
                        </StickyBox>
                        <div className="right lg:basis-7/12">
                            <div className="content">
                                <div id='terms' className="heading4 sm:pb-2">Terms of use</div>
                                <div className='md:pt-8 pt-5'>
                                    <div className="heading5">1. Terms</div>
                                    <div className="body2 text-variant1 mt-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sed euismod justo, sit amet efficitur dui. Aliquam sodales vestibulum velit, eget sollicitudin quam. Donec non aliquam eros. Etiam sit amet lectus vel justo dignissim condimentum.</div>
                                    <div className="body2 text-variant1 mt-3">In malesuada neque quis libero laoreet posuere. In consequat vitae ligula quis rutrum. Morbi dolor orci, maximus a pulvinar sed, bibendum ac lacus. Suspendisse in consectetur lorem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam elementum, est sed interdum cursus, felis ex pharetra nisi, ut elementum tortor urna eu nulla. Donec rhoncus in purus quis blandit.</div>
                                    <div id='limitations' className="body2 text-variant1 mt-3">Etiam eleifend metus at nunc ultricies facilisis. Morbi finibus tristique interdum. Nullam vel eleifend est, eu posuere risus. Vestibulum ligula ex, ullamcorper sit amet molestie</div>
                                </div>
                                <div className='md:pt-8 pt-5'>
                                    <div className="heading5">2. Limitations</div>
                                    <div className="body2 text-variant1 mt-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sed euismod justo, sit amet efficitur dui. Aliquam sodales vestibulum velit, eget sollicitudin quam. Donec non aliquam eros. Etiam sit amet lectus vel justo dignissim condimentum.</div>
                                    <ul className='ml-6'>
                                        <li className='body2 list-disc mt-3'>Aliquam elementum, est sed interdum cursus, felis ex pharetra nisi, ut elementum tortor urna eu nulla. Donec rhoncus in purus quis blandit.</li>
                                        <li className='body2 list-disc mt-3'>Etiam eleifend metus at nunc ultricies facilisis.</li>
                                        <li className='body2 list-disc mt-3'>Nullam vel eleifend est, eu posuere risus. Vestibulum ligula ex, ullamcorper sit amet molestie a, finibus nec ex.</li>
                                    </ul>
                                    <div id='revisions' className="body2 text-variant1 mt-3">Etiam eleifend metus at nunc ultricies facilisis. Morbi finibus tristique interdum. Nullam vel eleifend est, eu posuere risus. Vestibulum ligula ex, ullamcorper sit amet molestie</div>
                                </div>
                                <div className='md:pt-8 pt-5'>
                                    <div className="heading5">3. Revisions and errata</div>
                                    <div className="body2 text-variant1 mt-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sed euismod justo, sit amet efficitur dui. Aliquam sodales vestibulum velit, eget sollicitudin quam. Donec non aliquam eros. Etiam sit amet lectus vel justo dignissim condimentum.</div>
                                    <div className="body2 text-variant1 mt-3">In malesuada neque quis libero laoreet posuere. In consequat vitae ligula quis rutrum. Morbi dolor orci, maximus a pulvinar sed, bibendum ac lacus. Suspendisse in consectetur lorem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam elementum, est sed interdum cursus, felis ex pharetra nisi, ut elementum tortor urna eu nulla. Donec rhoncus in purus quis blandit.</div>
                                    <div id='modifications' className="body2 text-variant1 mt-3">Etiam eleifend metus at nunc ultricies facilisis. Morbi finibus tristique interdum. Nullam vel eleifend est, eu posuere risus. Vestibulum ligula ex, ullamcorper sit amet molestie</div>
                                </div>
                                <div className='md:pt-8 pt-5'>
                                    <div className="heading5">4. Site terms of use modifications</div>
                                    <div className="body2 text-variant1 mt-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sed euismod justo, sit amet efficitur dui. Aliquam sodales vestibulum velit, eget sollicitudin quam. Donec non aliquam eros. Etiam sit amet lectus vel justo dignissim condimentum.</div>
                                    <ul className='ml-6'>
                                        <li className='body2 list-disc mt-3'>Aliquam elementum, est sed interdum cursus, felis ex pharetra nisi, ut elementum tortor urna eu nulla. Donec rhoncus in purus quis blandit.</li>
                                        <li className='body2 list-disc mt-3'>Etiam eleifend metus at nunc ultricies facilisis.</li>
                                        <li className='body2 list-disc mt-3'>Nullam vel eleifend est, eu posuere risus. Vestibulum ligula ex, ullamcorper sit amet molestie a, finibus nec ex.</li>
                                    </ul>
                                    <div id='risks' className="body2 text-variant1 mt-3">Etiam eleifend metus at nunc ultricies facilisis. Morbi finibus tristique interdum. Nullam vel eleifend est, eu posuere risus. Vestibulum ligula ex, ullamcorper sit amet molestie</div>
                                </div>
                                <div className='md:pt-8 pt-5'>
                                    <div className="heading5">5. Risks</div>
                                    <div className="body2 text-variant1 mt-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sed euismod justo, sit amet efficitur dui. Aliquam sodales vestibulum velit, eget sollicitudin quam. Donec non aliquam eros. Etiam sit amet lectus vel justo dignissim condimentum.</div>
                                    <div className="body2 text-variant1 mt-3">In malesuada neque quis libero laoreet posuere. In consequat vitae ligula quis rutrum. Morbi dolor orci, maximus a pulvinar sed, bibendum ac lacus. Suspendisse in consectetur lorem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam elementum, est sed interdum cursus, felis ex pharetra nisi, ut elementum tortor urna eu nulla. Donec rhoncus in purus quis blandit.</div>
                                    <div className="body2 text-variant1 mt-3">Etiam eleifend metus at nunc ultricies facilisis. Morbi finibus tristique interdum. Nullam vel eleifend est, eu posuere risus. Vestibulum ligula ex, ullamcorper sit amet molestie</div>
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

export default Term