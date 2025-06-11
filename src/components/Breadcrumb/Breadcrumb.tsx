import React from 'react'
import Image from 'next/image'

interface Props {
    img: string
    heading: string
    subHeading: string
}

const Breadcrumb: React.FC<Props> = ({ img, heading, subHeading }) => {
    return (
        <>
            <div className="breadcrumb-block lg:h-[320px] sm:h-[280px] h-[240px] relative">
                <div className="bg-img absolute w-full h-full top-0 left-0">
                    <Image
                        src={img}
                        width={4000}
                        height={2000}
                        alt='bg-img'
                        priority={true}
                        className='w-full h-full object-cover'
                    />
                </div>
                <div className="container h-full flex items-center justify-center relative z-[1]">
                    <div className="text-content">
                        <div className="heading2 text-center text-white">{heading}</div>
                        <div className="body2 text-center text-white mt-4">{subHeading}</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Breadcrumb