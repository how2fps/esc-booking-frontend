'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import * as Icon from "phosphor-react"
import HeaderOne from '@/components/Header/HeaderOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import HandlePagination from '@/components/Other/HandlePagination'
import blogData from '@/data/Blog.json'
import BlogItem from '@/components/Blog/BlogItem'
import Footer from '@/components/Footer/Footer'

const BlogGrid = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const blogPerPage = 9;
    const offset = currentPage * blogPerPage;
    const router = useRouter()
    const searchParams = useSearchParams()
    let dataCategory = searchParams.get('category')
    const [category, setCategory] = useState<string | null>(dataCategory);

    const pageCount = Math.ceil(blogData.length / blogPerPage);

    // If page number 0, set current page = 0
    if (pageCount === 0) {
        setCurrentPage(0);
    }

    const currentBlogs = blogData.slice(offset, offset + blogPerPage);

    const handlePageChange = (selected: number) => {
        setCurrentPage(selected);
    };

    return (
        <>
            <div className='overflow-hidden'>
                <HeaderOne />
                <Breadcrumb img='/images/breadcrumb/1920x320.png' heading='Blog Grid' subHeading="Dive Into Nature's Chronicle. GlampHub's Grid Blog Experience." />
                <div className='blog-default lg:py-20 md:py-14 py-10'>
                    <div className="container">
                        <div className="">
                            <div className="list-blog grid lg:grid-cols-3 sm:grid-cols-2 md:gap-[30px] gap-6">
                                {currentBlogs.map(item => (
                                    <BlogItem key={item.id} data={item} type='style-grid' />
                                ))}
                            </div>
                            {pageCount > 1 && (
                                <div className="list-pagination w-full flex items-center justify-center md:mt-10 mt-6">
                                    <HandlePagination pageCount={pageCount} onPageChange={handlePageChange} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default BlogGrid