'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BlogType } from '@/type/BlogType'
import * as Icon from "phosphor-react";
import { useRouter } from 'next/navigation'

interface BlogProps {
    data: BlogType
    type: string
}

const BlogItem: React.FC<BlogProps> = ({ data, type }) => {
    const router = useRouter()

    const handleBlogClick = (blogId: string) => {
        // Go to blog detail with blogId selected
        router.push(`/blog/detail?id=${blogId}`);
    };

    return (
        <>
            {type === "style-grid" ? (
                <div
                    className="blog-item style-grid h-full cursor-pointer"
                    onClick={() => handleBlogClick(data.id)}
                >
                    <div className="blog-main h-full block">
                        <div className="blog-thumb rounded-[20px] overflow-hidden relative">
                            <Image
                                src={data.thumbnail}
                                width={2000}
                                height={1500}
                                alt='blog-img'
                                priority={true}
                                className='w-full duration-500'
                            />
                            <div className="tag absolute bottom-0 left-0 text-label bg-primary text-white py-1.5 px-2.5">{data.date}</div>
                        </div>
                        <div className="blog-infor mt-4">
                            <div className="flex items-center gap-2">
                                <div className="blog-author caption1 text-variant1">{data.author}</div>
                                <span className='w-px h-3 bg-outline'></span>
                                <div className="blog-date caption1 text-variant1">{data.date}</div>
                            </div>
                            <div className="heading5 blog-title mt-2 duration-300">{data.title}</div>
                            <div className="text-variant1 mt-2">{data.shortDesc}</div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {type === "style-default" && (
                        <div
                            className="blog-item style-default h-full cursor-pointer"
                            onClick={() => handleBlogClick(data.id)}
                        >
                            <div className="blog-main h-full block">
                                <div className="blog-thumb rounded-2xl overflow-hidden relative">
                                    <Image
                                        src={data.thumbnail}
                                        width={2000}
                                        height={1500}
                                            alt='blog-img'
                                            priority={true}
                                        className='w-full duration-500'
                                    />
                                    <div className="tag absolute bottom-4 left-4 text-label bg-primary text-white py-1.5 px-2.5">{data.date}</div>
                                </div>
                                <div className="blog-infor mt-8">
                                    <div className="flex items-center gap-2">
                                        <div className="blog-author text-variant1">by {data.author}</div>
                                        <span className='w-px h-3 bg-outline'></span>
                                        <div className="blog-date text-variant1 capitalize">{data.category}</div>
                                    </div>
                                    <div className="heading4 blog-title mt-2 duration-300">{data.title}</div>
                                    <div className="body2 text-variant1 mt-2">{data.shortDesc}</div>
                                    <div className="text-button underline mt-3">Read More</div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    )
}

export default BlogItem