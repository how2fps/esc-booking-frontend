"use client";

import React from "react";
import ReactPaginate from "react-paginate";

interface Props {
       pageCount: number;
       currentPage: number;
       onPageChange: (selected: number) => void;
}

const HandlePagination: React.FC<Props> = ({ pageCount, currentPage, onPageChange }) => {
       return (
              <div className="flex flex-col items-center space-y-2 mt-6">
                     <div className="text-gray-600 font-medium mb-2">
                            Page {currentPage} of {pageCount}
                     </div>

                     <ReactPaginate
                            previousLabel="<"
                            nextLabel=">"
                            pageCount={pageCount}
                            pageRangeDisplayed={3}
                            marginPagesDisplayed={2}
                            forcePage={currentPage - 1}
                            onPageChange={(selectedItem) => onPageChange(selectedItem.selected)}
                            containerClassName="flex justify-center items-center space-x-2"
                            pageClassName="inline-block"
                            pageLinkClassName="px-3 py-2 mx-1 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            previousClassName="inline-block"
                            previousLinkClassName="px-3 py-2 mx-1 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            nextClassName="inline-block"
                            nextLinkClassName="px-3 py-2 mx-1 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            activeClassName="bg-blue-500 text-white border-blue-500"
                            disabledClassName="opacity-50 cursor-not-allowed"
                     />
              </div>
       );
};

export default HandlePagination;
