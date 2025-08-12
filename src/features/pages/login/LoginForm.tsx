"use client";

import * as Icon from "phosphor-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../features/components/context/AuthContext";

const Login = () => {
       const navigate = useNavigate();
       const { setUser } = useAuth();
       const [email, setEmail] = useState("");
       const [password, setPassword] = useState("");
       const [error, setError] = useState<string | null>(null);

       const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              try {
                     const response = await await fetch("https://api.ascendahotelbackend.com/api/users/login", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                            body: JSON.stringify({ email, password }),
                     });
                     const data = await response.json();
                     console.log("Login response:", data);
                     if (response.ok && data.success) {
                            console.log("Setting user:", data.data);
                            setUser(data.data);
                            navigate("/dashboard");
                     } else {
                            setError(data.message || "Login failed");
                     }
              } catch (err) {
                     console.error("Login error:", err);
                     setError("Unable to login. Please try again.");
              }
       };

       return (
              <div className="login-us lg:py-20 md:py-14 py-10">
                     <div className="container">
                            <div className="content flex items-center justify-center">
                                   <div
                                          id="form-login"
                                          className="xl:basis-1/3 lg:basis-1/2 sm:basis-2/3 max-sm:w-full">
                                          <div className="heading3 text-center">Login</div>
                                          <form
                                                 className="md:mt-10 mt-6"
                                                 onSubmit={handleSubmit}>
                                                 <div className="email">
                                                        <label
                                                               htmlFor="username"
                                                               className="text-variant1">
                                                               Email address<span className="text-primary">*</span>
                                                        </label>
                                                        <input
                                                               type="email"
                                                               className="border-line px-4 pt-3 pb-3 w-full rounded-lg mt-2 bg-[#d1d1d1]"
                                                               id="username"
                                                               value={email}
                                                               onChange={(e) => setEmail(e.target.value)}
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
                                                               value={password}
                                                               onChange={(e) => setPassword(e.target.value)}
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
                                                               to={"#!"}
                                                               className="caption1 text-primary has-line line-primary">
                                                               Forgot Your Password?
                                                        </Link>
                                                 </div>

                                                 {error && <p className="text-red-500 mt-4">{error}</p>}

                                                 <div className="block-button mt-6">
                                                        <button
                                                               type="submit"
                                                               className="button-main w-full text-center">
                                                               Login
                                                        </button>
                                                 </div>
                                          </form>

                                          <div className="flex items-center justify-center gap-2 mt-5">
                                                 <div className="caption1 text-variant1">Not registered yet?</div>
                                                 <Link
                                                        to={"/signup"}
                                                        className="text-button-sm text-black has-line">
                                                        Register
                                                 </Link>
                                          </div>
                                   </div>
                            </div>
                     </div>
              </div>
       );
};

export default Login;
