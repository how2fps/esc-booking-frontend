'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import * as Icon from "phosphor-react"
import HeaderOne from '@/components/Header/HeaderOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import HandlePagination from '@/components/Other/HandlePagination'
import blogData from '@/data/Blog.json'
import BlogItem from '@/components/Blog/BlogItem'
import Footer from '@/components/Footer/Footer'
import StickyBox from 'react-sticky-box';

const BlogDefault = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const blogPerPage = 3;
    const offset = currentPage * blogPerPage;
    const router = useRouter()
    const searchParams = useSearchParams()
    let dataCategory = searchParams.get('category')
    const [category, setCategory] = useState<string | null>(dataCategory);

    const handleCategory = (category: string) => {
        setCategory(prevCategory => prevCategory === category ? null : category)
    }

    const handleBlogClick = (blogId: string) => {
        // Go to blog detail with blogId selected
        router.push(`/blog/detail?id=${blogId}`);
    };

    let filteredData = blogData.filter(blog => {
        let isCategoryMatched = true
        if (category) {
            isCategoryMatched = blog.category === category
        }

        return isCategoryMatched
    })

    if (filteredData.length === 0) {
        filteredData = [{
            id: "no-data",
            category: "no-data",
            title: "no-data",
            thumbnail: "",
            author: "no-data",
            avatar: "no-data",
            date: "no-data",
            shortDesc: "no-data",
            description: "no-data",
            images: [
                "",
                ""
            ],
        }];
    }

    const pageCount = Math.ceil(filteredData.length / blogPerPage);

    // If page number 0, set current page = 0
    if (pageCount === 0) {
        setCurrentPage(0);
    }

    const currentBlogs = filteredData.slice(offset, offset + blogPerPage);

    const handlePageChange = (selected: number) => {
        setCurrentPage(selected);
    };

    return (
        <>
            <HeaderOne />
            <Breadcrumb img='/images/breadcrumb/1920x320.png' heading='Blog Default' subHeading="Dive Into Nature's Chronicle. GlampHub's Default Blog Experience." />
            <div className='blog default lg:py-20 md:py-14 py-10'>
                <div className="container">
                    <div className="flex justify-between max-lg:flex-col gap-y-12">
                        <div className="left xl:w-2/3 lg:w-2/3 pr-2">
                            <div className="list-blog flex flex-col md:gap-10 gap-8">
                                {currentBlogs.map(item => (
                                    <BlogItem key={item.id} data={item} type='style-default' />
                                ))}
                            </div>
                            {pageCount > 1 && (
                                <div className="list-pagination md:mt-10 mt-6">
                                    <HandlePagination pageCount={pageCount} onPageChange={handlePageChange} />
                                </div>
                            )}
                        </div>
                        <div className="right xl:w-1/3 lg:w-1/3 xl:pl-[52px] lg:pl-8">
                            <StickyBox offsetTop={100} offsetBottom={20} className=''>
                                <div className="heading6">Search</div>
                                <form className='form-search relative w-full h-12 mt-5'>
                                    <input className='py-2 px-4 w-full h-full border border-line rounded-lg' type="text" placeholder='Search' />
                                    <button>
                                        <Icon.MagnifyingGlass className='heading6 text-secondary hover:text-black duration-300 absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer' />
                                    </button>
                                </form>
                                <div className="recent md:mt-10 mt-6">
                                    <div className="heading6">Recent Posts</div>
                                    <div className="list-recent">
                                        {blogData.slice(8, 11).map(item => (
                                            <div className="blog-item flex gap-4 mt-5 cursor-pointer" key={item.id} onClick={() => handleBlogClick(item.id)}>
                                                <Image
                                                    src={item.thumbnail}
                                                    width={500}
                                                    height={400}
                                                    alt={item.thumbnail}
                                                    priority={true}
                                                    className='w-[120px] h-[90px] object-cover rounded-lg flex-shrink-0'
                                                />
                                                <div>
                                                    <div className="blog-tag text-label text-variant1 whitespace-nowrap">{item.category}</div>
                                                    <div className="blog-title text-title mt-1">{item.title}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="filter-category md:mt-10 mt-6">
                                    <div className="heading6">By Categories</div>
                                    <div className="list-cate pt-1">
                                        <div
                                            className={`cate-item flex items-center justify-between cursor-pointer mt-3 ${category === 'cooking' ? 'active' : ''}`}
                                            onClick={() => handleCategory('cooking')}
                                        >
                                            <div className='capitalize has-line hover:text-black text-secondary'>Glamping Destinations</div>
                                            <div className="text-secondary2">
                                                ({blogData.filter(dataItem => dataItem.category === 'cooking').length})
                                            </div>
                                        </div>
                                        <div
                                            className={`cate-item flex items-center justify-between cursor-pointer mt-3 ${category === 'experiences' ? 'active' : ''}`}
                                            onClick={() => handleCategory('experiences')}
                                        >
                                            <div className='capitalize has-line hover:text-black text-secondary'>Glamping Experiences</div>
                                            <div className="text-secondary2">
                                                ({blogData.filter(dataItem => dataItem.category === 'experiences').length})
                                            </div>
                                        </div>
                                        <div
                                            className={`cate-item flex items-center justify-between cursor-pointer mt-3 ${category === 'equipment' ? 'active' : ''}`}
                                            onClick={() => handleCategory('equipment')}
                                        >
                                            <div className='capitalize has-line hover:text-black text-secondary'>Gear and Equipment</div>
                                            <div className="text-secondary2">
                                                ({blogData.filter(dataItem => dataItem.category === 'equipment').length})
                                            </div>
                                        </div>
                                        <div
                                            className={`cate-item flex items-center justify-between cursor-pointer mt-3 ${category === 'guides' ? 'active' : ''}`}
                                            onClick={() => handleCategory('guides')}
                                        >
                                            <div className='capitalize has-line hover:text-black text-secondary'>Tips and Tricks</div>
                                            <div className="text-secondary2">
                                                ({blogData.filter(dataItem => dataItem.category === 'guides').length})
                                            </div>
                                        </div>
                                        <div
                                            className={`cate-item flex items-center justify-between cursor-pointer mt-3 ${category === 'glamping' ? 'active' : ''}`}
                                            onClick={() => handleCategory('glamping')}
                                        >
                                            <div className='capitalize has-line hover:text-black text-secondary'>Glamping Adventure</div>
                                            <div className="text-secondary2">
                                                ({blogData.filter(dataItem => dataItem.category === 'glamping').length})
                                            </div>
                                        </div>
                                        <div
                                            className={`cate-item flex items-center justify-between cursor-pointer mt-3 ${category === 'activities' ? 'active' : ''}`}
                                            onClick={() => handleCategory('activities')}
                                        >
                                            <div className='capitalize has-line hover:text-black text-secondary'>Outdoor Activities</div>
                                            <div className="text-secondary2">
                                                ({blogData.filter(dataItem => dataItem.category === 'activities').length})
                                            </div>
                                        </div>
                                        <div
                                            className={`cate-item flex items-center justify-between cursor-pointer mt-3 ${category === 'camping' ? 'active' : ''}`}
                                            onClick={() => handleCategory('camping')}
                                        >
                                            <div className='capitalize has-line hover:text-black text-secondary'>Camping Experience</div>
                                            <div className="text-secondary2">
                                                ({blogData.filter(dataItem => dataItem.category === 'camping').length})
                                            </div>
                                        </div>
                                        <div
                                            className={`cate-item flex items-center justify-between cursor-pointer mt-3 ${category === 'locations' ? 'active' : ''}`}
                                            onClick={() => handleCategory('locations')}
                                        >
                                            <div className='capitalize has-line hover:text-black text-secondary'>Eco-Friendly</div>
                                            <div className="text-secondary2">
                                                ({blogData.filter(dataItem => dataItem.category === 'locations').length})
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="filter-tags md:mt-10 mt-6">
                                    <div className="heading6">Tags Cloud</div>
                                    <div className="list-tags flex items-center flex-wrap gap-5 mt-4">
                                        <div
                                            className={`tags text-label has-line text-variant1 cursor-pointer duration-300 hover:text-black ${category === 'glamping' ? 'active' : ''}`}
                                            onClick={() => handleCategory('glamping')}
                                        >
                                            Glamping
                                        </div>
                                        <div
                                            className={`tags text-label has-line text-variant1 cursor-pointer duration-300 hover:text-black ${category === 'camping' ? 'active' : ''}`}
                                            onClick={() => handleCategory('camping')}
                                        >
                                            Camping
                                        </div>
                                        <div
                                            className={`tags text-label has-line text-variant1 cursor-pointer duration-300 hover:text-black ${category === 'locations' ? 'active' : ''}`}
                                            onClick={() => handleCategory('locations')}
                                        >
                                            locations
                                        </div>
                                        <div
                                            className={`tags text-label has-line text-variant1 cursor-pointer duration-300 hover:text-black ${category === 'cooking' ? 'active' : ''}`}
                                            onClick={() => handleCategory('cooking')}
                                        >
                                            cooking
                                        </div>
                                        <div
                                            className={`tags text-label has-line text-variant1 cursor-pointer duration-300 hover:text-black ${category === 'experiences' ? 'active' : ''}`}
                                            onClick={() => handleCategory('experiences')}
                                        >
                                            experiences
                                        </div>
                                        <div
                                            className={`tags text-label has-line text-variant1 cursor-pointer duration-300 hover:text-black ${category === 'guides' ? 'active' : ''}`}
                                            onClick={() => handleCategory('guides')}
                                        >
                                            guides
                                        </div>
                                        <div
                                            className={`tags text-label has-line text-variant1 cursor-pointer duration-300 hover:text-black ${category === 'activities' ? 'active' : ''}`}
                                            onClick={() => handleCategory('activities')}
                                        >
                                            activities
                                        </div>
                                        <div
                                            className={`tags text-label has-line text-variant1 cursor-pointer duration-300 hover:text-black ${category === 'equipment' ? 'active' : ''}`}
                                            onClick={() => handleCategory('equipment')}
                                        >
                                            equipment
                                        </div>
                                    </div>
                                </div>
                            </StickyBox>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default BlogDefault