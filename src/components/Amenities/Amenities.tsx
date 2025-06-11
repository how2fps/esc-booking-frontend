import React from 'react'
import TextHeading from '../TextHeading/TextHeading'

const Amenities = () => {
    return (
        <>
            <div className="amenities-block lg:pt-20 md:pt-14 pt-10">
                <div className="container">
                    <TextHeading title='Best Glamping With Amenities' subTitle="Indulge in Unmatched Comfort & Luxury Amidst Nature's Splendor" />
                    <div className="list grid sm:grid-cols-3 grid-cols-2 items-start justify-start md:gap-[60px] gap-8 gap-y-10 md:mt-10 mt-6">
                        <div className="item flex flex-col items-center gap-7 h-full">
                            <span className='icon-user-sun text-[60px]'></span>
                            <div>
                                <div className="heading6 text-center">Enhanced Comfort</div>
                                <div className="text-center text-variant1 mt-2">Revel in a heightened level of comfort during your Glamping escapade.</div>
                            </div>
                        </div>
                        <div className="item flex flex-col items-center gap-7 h-full">
                            <span className='icon-tent-sun text-[60px]'></span>
                            <div>
                                <div className="heading6 text-center">Breathtaking Views</div>
                                <div className="text-center text-variant1 mt-2">Immerse yourself in the awe-inspiring vistas that surround your Glamping retreat.</div>
                            </div>
                        </div>
                        <div className="item flex flex-col items-center gap-7 h-full">
                            <span className='icon-user-star text-[60px]'></span>
                            <div>
                                <div className="heading6 text-center">Glamping Pros</div>
                                <div className="text-center text-variant1 mt-2">Discover the advantages & expertise that Glamping professionals bring to your journey.</div>
                            </div>
                        </div>
                        <div className="item flex flex-col items-center gap-7 h-full">
                            <span className='icon-tent text-[60px]'></span>
                            <div>
                                <div className="heading6 text-center">Variety of Tent Options</div>
                                <div className="text-center text-variant1 mt-2">Spacious family tents to intimate, there{String.raw`'s`} a perfect shelter for every adventurer.</div>
                            </div>
                        </div>
                        <div className="item flex flex-col items-center gap-7 h-full">
                            <span className='icon-fire text-[60px]'></span>
                            <div>
                                <div className="heading6 text-center">Delicious Dining</div>
                                <div className="text-center text-variant1 mt-2">Delight your palate with delectable dining options curated specifically for your experience.</div>
                            </div>
                        </div>
                        <div className="item flex flex-col items-center gap-7 h-full">
                            <span className='icon-mount text-[60px]'></span>
                            <div>
                                <div className="heading6 text-center">Nature{String.raw`'s`} Serenity</div>
                                <div className="text-center text-variant1 mt-2">Welcoming peace and soothing sounds for ultimate relaxation and inner peace.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Amenities