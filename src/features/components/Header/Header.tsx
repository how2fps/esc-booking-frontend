"use client";

import { usePathname } from "next/navigation";
import { Link } from "react-router-dom";

const HeaderOne = () => {
       const pathname = usePathname();
       return (
              <>
                     <div
                            id="header"
                            className="header">
                            <div className={`header-main h-20 w-full bg-white min-[1322px]:px-5 px-4 flex items-center justify-between`}>
                                   <Link
                                          to={"/"}
                                          className="logo">
                                          <img
                                                 src={"/images/logo/Vector.png"}
                                                 width={2000}
                                                 height={1000}
                                                 alt="logo"
                                                 className="sm:w-[40px] w-[40px]"
                                          />
                                   </Link>
                                   <div className="menu-main h-full max-lg:hidden">
                                          <ul className="flex items-center xl:gap-[50px] gap-10 h-full">
                                                 <li className="h-full relative">
                                                        <Link
                                                               to="/dashboard"
                                                               className={`text-button duration-300 h-full flex items-center justify-center gap-1 ${pathname === "/" ? "active" : ""}`}>
                                                               Home
                                                        </Link>
                                                 </li>
                                                 <li className="h-full relative">
                                                        <Link
                                                               to="/"
                                                               className={`text-button duration-300 h-full flex items-center justify-center gap-1 ${pathname === "/camp/topmap-sidebar" ? "active" : ""}`}>
                                                               Hotel
                                                        </Link>
                                                 </li>
                                          </ul>
                                   </div>
                                   <div className="right flex items-center gap-3">
                                          <Link
                                                 to="/login"
                                                 className="text-button max-sm:hidden">
                                                 Log In
                                          </Link>
                                          <Link
                                                 to="/signup"
                                                 className="text-button max-sm:hidden">
                                                 Sign Up
                                          </Link>
                                   </div>
                            </div>
                     </div>
              </>
       );
};

export default HeaderOne;
