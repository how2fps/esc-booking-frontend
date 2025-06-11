import React from 'react'
import Link from 'next/link'
import * as Icon from 'phosphor-react'
import TextHeading from '../TextHeading/TextHeading'
import { useRouter } from 'next/navigation'

const CategoryOne = () => {
    const router = useRouter()

    const handleClickCate = (cate: string) => {
        router.push(`/camp/topmap-grid?category=${cate}`)
    }

    return (
        <>
            <div className="category-block lg:pt-20 md:pt-14 pt-10">
                <div className="container">
                    <TextHeading title='Try Searching For' subTitle='Explore Distinctive Selections with Our Thoughtfully Curated Categories' />
                    <div className="list-cate grid xl:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 lg:gap-[30px] gap-5 md:mt-10 mt-6">
                        <div
                            className={`item bg-surface py-[22px] flex flex-col items-center rounded-xl duration-300 cursor-pointer hover:bg-black hover:text-white`}
                            onClick={() => handleClickCate('cabin')}
                        >
                            <span className='icon-cabin text-4xl'></span>
                            <div className="text-title mt-2">Cabin</div>
                        </div>
                        <div
                            className={`item bg-surface py-[22px] flex flex-col items-center rounded-xl duration-300 cursor-pointer hover:bg-black hover:text-white`}
                            onClick={() => handleClickCate('tented cabins')}
                        >
                            <span className='icon-tented-cabin text-4xl'></span>
                            <div className="text-title mt-2">Tented Cabins</div>
                        </div>
                        <div
                            className={`item bg-surface py-[22px] flex flex-col items-center rounded-xl duration-300 cursor-pointer hover:bg-black hover:text-white`}
                            onClick={() => handleClickCate('safari tents')}
                        >
                            <span className='icon-safari-tent text-4xl'></span>
                            <div className="text-title mt-2">Safari Tents</div>
                        </div>
                        <div
                            className={`item bg-surface py-[22px] flex flex-col items-center rounded-xl duration-300 cursor-pointer hover:bg-black hover:text-white`}
                            onClick={() => handleClickCate('cottages')}
                        >
                            <span className='icon-cottages text-4xl'></span>
                            <div className="text-title mt-2">Cottages</div>
                        </div>
                        <div
                            className={`item bg-surface py-[22px] flex flex-col items-center rounded-xl duration-300 cursor-pointer hover:bg-black hover:text-white`}
                            onClick={() => handleClickCate('tiny houses')}
                        >
                            <span className='icon-tiny-house text-4xl'></span>
                            <div className="text-title mt-2">Tiny Houses</div>
                        </div>
                        <div
                            className={`item bg-surface py-[22px] flex flex-col items-center rounded-xl duration-300 cursor-pointer hover:bg-black hover:text-white`}
                            onClick={() => handleClickCate('caravans')}
                        >
                            <span className='icon-cravan text-4xl'></span>
                            <div className="text-title mt-2">Caravans</div>
                        </div>
                        <div
                            className={`item bg-surface py-[22px] flex flex-col items-center rounded-xl duration-300 cursor-pointer hover:bg-black hover:text-white`}
                            onClick={() => handleClickCate('Domes')}
                        >
                            <span className='icon-domes text-4xl'></span>
                            <div className="text-title mt-2">Domes</div>
                        </div>
                        <div
                            className={`item bg-surface py-[22px] flex flex-col items-center rounded-xl duration-300 cursor-pointer hover:bg-black hover:text-white`}
                            onClick={() => handleClickCate('Log Cabins')}
                        >
                            <span className='icon-log-cabin text-4xl'></span>
                            <div className="text-title mt-2">Log Cabins</div>
                        </div>
                        <div
                            className={`item bg-surface py-[22px] flex flex-col items-center rounded-xl duration-300 cursor-pointer hover:bg-black hover:text-white`}
                            onClick={() => handleClickCate('Yurts')}
                        >
                            <span className='icon-yurt text-4xl'></span>
                            <div className="text-title mt-2">Yurts</div>
                        </div>
                        <div
                            className={`item bg-surface py-[22px] flex flex-col items-center rounded-xl duration-300 cursor-pointer hover:bg-black hover:text-white`}
                            onClick={() => handleClickCate('Bell Tents')}
                        >
                            <span className='icon-bell-tent text-4xl'></span>
                            <div className="text-title mt-2">Bell Tents</div>
                        </div>
                        <div
                            className={`item bg-surface py-[22px] flex flex-col items-center rounded-xl duration-300 cursor-pointer hover:bg-black hover:text-white`}
                            onClick={() => handleClickCate('Containers')}
                        >
                            <span className='icon-container text-4xl'></span>
                            <div className="text-title mt-2">Containers</div>
                        </div>
                        <div
                            className={`item bg-surface py-[22px] flex flex-col items-center rounded-xl duration-300 cursor-pointer hover:bg-black hover:text-white`}
                            onClick={() => handleClickCate('Tree Houses')}
                        >
                            <span className='icon-cottages text-4xl'></span>
                            <div className="text-title mt-2">Tree Houses</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CategoryOne