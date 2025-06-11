import React from 'react'
import Image from 'next/image'
import { TestimonialType } from '@/type/TestimonialType'
import Rate from '../Other/Rate'

interface Props {
    data: TestimonialType
}

const TestimonialItem: React.FC<Props> = ({ data }) => {
    return (
        <>
            <div className="testimonial-item style-six h-full">
                <div className="testimonial-main flex flex-col justify-between h-full p-10 rounded-[20px] bg-surface">
                    <div>
                        <Rate currentRate={data.star} classname='md:text-xl text-base' />
                        <div className="body2 desc mt-3">{String.raw`"`}{data.description}{String.raw`"`}</div>
                    </div>
                    <div className="flex items-center gap-3 md:mt-6 mt-4">
                        <Image
                            src={data.avatar}
                            width={600}
                            height={600}
                            alt={data.name}
                            priority={true}
                            className='md:w-[60px] w-[52px] md:h-[60px] h-[52px] rounded-full flex-shrink-0'
                        />
                        <div>
                            <div className="text-title name">{data.name}</div>
                            <div className="caption1 date text-variant1 mt-1">{data.position}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TestimonialItem