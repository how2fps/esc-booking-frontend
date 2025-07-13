"use client";

import Link from "next/link";
import * as Icon from "phosphor-react";

const Footer = () => {
       return (
              <>
                     <div
                            id="footer"
                            className="footer">
                            <div className="bg-surface lg:pt-15 md:pt-12 pt-8">
                                   <div className="container">
                                          <div className="footer-heading flex items-center justify-between flex-wrap gap-6 pb-[30px] border-b border-outline">
                                                 <Link href={"/"}>Ascenda</Link>
                                                 <div className="flex items-center flex-wrap gap-4">
                                                        <div className="text-button-sm">Placeholder</div>
                                                        <div className="list-social flex items-center flex-wrap gap-3">Placeholder</div>
                                                 </div>
                                          </div>
                                          <div className="footer-main flex justify-between flex-wrap gap-y-8 lg:py-10 md:py-8 py-6">
                                                 <div className="company-infor lg:w-1/4 sm:w-1/2">
                                                        <div className="flex items-center gap-4">
                                                               <div>
                                                                      <div className="caption1 text-variant1">Placeholder</div>
                                                                      <div className="text-title">Placeholder</div>
                                                               </div>
                                                        </div>
                                                        <div className="caption1 mt-5">Placeholder</div>
                                                        <div className="location flex items-center gap-2 mt-3">
                                                               <Icon.MapPin className="caption1" />
                                                               <div className="caption1">Placeholder</div>
                                                        </div>
                                                        <div className="form-search mt-5"></div>
                                                 </div>
                                                 <div className="list-nav lg:w-2/3 w-full sm:flex max-sm:grid grid-cols-2 gap-8 justify-between">
                                                        <div className="item">
                                                               <div className="text-title pb-3">Placeholder</div>
                                                               <Link
                                                                      href={"/pages/contact"}
                                                                      className="caption1 text-variant1 has-line block w-fit whitespace-nowrap">
                                                                      Placeholder
                                                               </Link>
                                                               <Link
                                                                      href={"/pages/contact"}
                                                                      className="caption1 text-variant1 has-line block w-fit whitespace-nowrap mt-2">
                                                                      Placeholder
                                                               </Link>
                                                        </div>

                                                        <div className="item">
                                                               <div className="text-title pb-4">Placeholder</div>
                                                        </div>
                                                 </div>
                                          </div>
                                   </div>

                                   <div className="footer-bottom py-4 border-t border-outline">
                                          <div className="container">
                                                 <div className="flex items-center sm:justify-between justify-center flex-wrap gap-4">
                                                        <div className="copyright caption1 text-variant1">Ascenda</div>
                                                        <div className="flex items-center gap-3">
                                                               <Link
                                                                      href={"/"}
                                                                      className="caption1 text-variant1 has-line">
                                                                      Placeholder
                                                               </Link>
                                                               <div className="bg-outline w-px h-4"></div>
                                                               <Link
                                                                      href={"/"}
                                                                      className="caption1 text-variant1 has-line">
                                                                      Placeholder
                                                               </Link>
                                                               <div className="bg-outline w-px h-4"></div>
                                                               <Link
                                                                      href={"/"}
                                                                      className="caption1 text-variant1 has-line">
                                                                      Placeholder
                                                               </Link>
                                                        </div>
                                                 </div>
                                          </div>
                                   </div>
                            </div>
                     </div>
              </>
       );
};

export default Footer;
