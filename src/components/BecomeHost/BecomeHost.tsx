import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const BecomeHost = () => {
    return (
        <>
            <div className="become-host lg:pt-20 md:pt-14 pt-10">
                <div className="container">
                    <div className="content-main xl:h-auto h-[500px] rounded-[20px] overflow-hidden relative">
                        <Image
                            src={'/images/other/bg-becomehost.png'}
                            width={4000}
                            height={3000}
                            alt='bg-becomehost'
                            priority={true}
                            className='w-full xl:h-auto h-full object-cover'
                        />
                        <div className="text-content bg-white rounded-[20px] xl:w-[40%] lg:w-[50%] md:w-[60%] py-6 md:px-8 px-6 absolute max-md:right-6 left-6 bottom-10">
                            <div className="heading4">List your accommodation on Glamp Hub, join Us Now!</div>
                            <div className="caption1 text-variant1 mt-1">Host our community of good-natured campers and RV travelers at your property or camground business</div>
                            <Link href={'#!'} className='button-main mt-5'>Become A Hosting</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BecomeHost