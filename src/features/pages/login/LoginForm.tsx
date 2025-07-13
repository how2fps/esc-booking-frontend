"use client";

import Link from "next/link";
import * as Icon from "phosphor-react";
import HeaderOne from "../../components/Header/HeaderOne";

const Login = () => {
       return (
              <>
                     <HeaderOne />
                     <div className="login-us lg:py-20 md:py-14 py-10">
                            <div className="container">
                                   <div className="content flex items-center justify-center">
                                          <div
                                                 id="form-login"
                                                 className="xl:basis-1/3 lg:basis-1/2 sm:basis-2/3 max-sm:w-full">
                                                 <div className="heading3 text-center">Login</div>
                                                 <form className="md:mt-10 mt-6">
                                                        <div className="email ">
                                                               <label
                                                                      htmlFor="username"
                                                                      className="text-variant1">
                                                                      Email address<span className="text-primary">*</span>
                                                               </label>
                                                               <input
                                                                      type="text"
                                                                      className="border-line px-4 pt-3 pb-3 w-full rounded-lg mt-2"
                                                                      id="username"
                                                                      placeholder=""
                                                                      required
                                                               />
                                                        </div>

                                                        <div className="pass mt-5">
                                                               <label
                                                                      htmlFor="password"
                                                                      className="text-variant1">
                                                                      Password<span className="text-primary">*</span>
                                                               </label>
                                                               <input
                                                                      className="border-line px-4 pt-3 pb-3 w-full rounded-lg mt-2 pr-10 text-black bg-[#d1d1d1]"
                                                                      id="password"
                                                                      type="password"
                                                                      placeholder=""
                                                                      required
                                                               />
                                                        </div>

                                                        <div className="flex items-center justify-between flex-wrap mt-5">
                                                               <div className="flex items-center">
                                                                      <div className="checkbox-input">
                                                                             <input
                                                                                    type="checkbox"
                                                                                    name="remember"
                                                                                    id="remember"
                                                                             />
                                                                             <Icon.CheckSquare
                                                                                    size={20}
                                                                                    weight="fill"
                                                                                    className="icon-checkbox"
                                                                             />
                                                                      </div>
                                                                      <label
                                                                             htmlFor="remember"
                                                                             className="pl-2 cursor-pointer caption1 text-variant1">
                                                                             Remember me
                                                                      </label>
                                                               </div>
                                                               <Link
                                                                      href={"#!"}
                                                                      className="caption1 text-primary has-line line-primary">
                                                                      Forget Your Password?
                                                               </Link>
                                                        </div>

                                                        <div className="block-button mt-6">
                                                               <button className="button-main w-full text-center">Login</button>
                                                        </div>
                                                 </form>
                                                 <div className="flex items-center justify-center gap-2 mt-5">
                                                        <div className="caption1 text-variant1">Not registered yet?</div>
                                                        <Link
                                                               href={"/signup"}
                                                               className="text-button-sm text-black has-line">
                                                               Register
                                                        </Link>
                                                 </div>
                                          </div>
                                   </div>
                            </div>
                     </div>
              </>
       );
};

export default Login;
