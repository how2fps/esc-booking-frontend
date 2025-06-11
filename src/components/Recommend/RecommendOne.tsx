import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import * as Icon from 'phosphor-react'
import TextHeading from '../TextHeading/TextHeading'
import TentItem from '../Tent/TentItem'
import { TentType } from '@/type/TentType'

interface Props {
    data: Array<TentType>;
    start: number;
    end: number;
}

const RecommendOne: React.FC<Props> = ({ data, start, end }) => {
    return (
        <>
            <div className="recommend-block lg:pt-20 md:pt-14 pt-10">
                <div className="container">
                    <TextHeading title='Discovery Luxury Camping Near You On Glamp Hub' subTitle='Explore Luxe Camping Near You with Glamp Hub' />
                    <div className="list-cate grid lg:grid-cols-4 md:grid-cols-3 min-[360px]:grid-cols-2 lg:gap-[30px] gap-4 gap-y-7 md:mt-10 mt-6">
                        {data.slice(start, end).map(item => (
                            <TentItem key={item.id} data={item} type='default' />
                        ))}
                    </div>
                    <div className="button-block w-full text-center md:mt-10 mt-6">
                        <Link href={'/camp/topmap-grid'} className="button-main">View All Camp</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RecommendOne