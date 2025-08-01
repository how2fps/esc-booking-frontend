"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HeaderOne = () => {
       const pathname = usePathname();

       const [user, setUser] = useState<{ name: string } | null>(null);

       // Fetch session
       useEffect(() => {
              const fetchSession = async () => {
                     try {
                            const res = await fetch("http://localhost:3000/api/users/session", {
                                   credentials: "include",
                            });
                            const data = await res.json();
                            if (data.success) {
                                   setUser({ name: data.data.name });
                            }
                     } catch (err) {
                            console.error("Session fetch failed:", err);
                     }
              };
              fetchSession();
       }, []);

       return (
              <div
                     id="header"
                     className="header"
                     data-testid="header">
                     <div className={`header-main h-20 w-full bg-white :px-5 px-4 flex items-center justify-between`}>
                            <Link
                                   to="/"
                                   className="logo" >
                                   <img
                                          src="/images/logo/Bloom.png"
                                          alt="logo"
                                          className="sm:w-[120px] w-[80px]"
                                   />
                            </Link>

                            <div className="menu-main h-full max-lg:hidden">
                                   <ul className="flex items-center xl:gap-[50px] gap-10 h-full">
                                          <li className="h-full relative">
                                                 <Link
                                                        to="/dashboard"
                                                        className={`text-button duration-300 h-full flex items-center justify-center gap-1 ${pathname === "/dashboard" ? "active" : ""}`}>
                                                        Home
                                                 </Link>
                                          </li>
                                          <li className="h-full relative">
                                                 <Link
                                                        to="/"
                                                        className={`text-button duration-300 h-full flex items-center justify-center gap-1 ${pathname === "/" ? "active" : ""}`}>
                                                        Hotel
                                                 </Link>
                                          </li>
                                          <li className="h-full relative">
                                                 <Link
                                                        to="/hotels?location=fRZM&startDate=02/08/2025&endDate=09/08/2025&adult=1&children=1&room=1"
                                                        className={`text-button duration-300 h-full flex items-center justify-center gap-1 ${pathname === "/" ? "active" : ""}`}>
                                                        Listings
                                                 </Link>
                                          </li>
                                          <li className="h-full relative">
                                                 <Link
                                                        to="/details"
                                                        className={`text-button duration-300 h-full flex items-center justify-center gap-1 ${pathname === "/" ? "active" : ""}`}>
                                                        Hotel Details
                                                 </Link>
                                          </li>
                                          <li className="h-full relative">
                                                 <Link
                                                        to="/checkout"
                                                        className={`text-button duration-300 h-full flex items-center justify-center gap-1 ${pathname === "/" ? "active" : ""}`}>
                                                        Payment
                                                 </Link>
                                          </li>
                                          <li className="h-full relative">
                                                 <Link
                                                        to="/booking"
                                                        className={`text-button duration-300 h-full flex items-center justify-center gap-1 ${pathname === "/" ? "active" : ""}`}>
                                                        Booking
                                                 </Link>
                                          </li>
                                          <li className="h-full relative">
                                                 <Link
                                                        to="/return"
                                                        className={`text-button duration-300 h-full flex items-center justify-center gap-1 ${pathname === "/" ? "active" : ""}`}>
                                                        Return
                                                 </Link>
                                          </li>
                                   </ul>
                            </div>

				<div className="right flex items-center gap-3">
					{user ? (
						<Link to="/profile" className="text-button max-sm:hidden">Hello, {user.name}</Link>
					) : (
						<>
							<Link to="/login" className="text-button max-sm:hidden">Log In</Link>
							<Link to="/signup" className="text-button max-sm:hidden">Sign Up</Link>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default HeaderOne;
