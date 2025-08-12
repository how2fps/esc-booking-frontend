"use client";

import { Eye, EyeSlash } from "phosphor-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignupForm = () => {
       const [name, setName] = useState("");
       const [email, setEmail] = useState("");
       const [password, setPassword] = useState("");
       const [phoneNumber, setPhoneNumber] = useState("");
       const [showPassword, setShowPassword] = useState(false);
       const [confirmPassword, setConfirmPassword] = useState("");
       const [showConfirmPassword, setShowConfirmPassword] = useState(false);
       const [errors, setErrors] = useState<string[]>([]);
       const [isValid, setIsValid] = useState(false);
       const [_submitError, setSubmitError] = useState<string | null>(null);
       const [_submitting, setSubmitting] = useState(false);
       const navigate = useNavigate();

       useEffect(() => {
              const validationErrors: string[] = [];
              if (password.length < 8) validationErrors.push("At least 8 characters");
              if (!/[A-Z]/.test(password)) validationErrors.push("At least 1 uppercase letter");
              if (!/[a-z]/.test(password)) validationErrors.push("At least 1 lowercase letter");
              if (!/[0-9]/.test(password)) validationErrors.push("At least 1 number");
              if (password !== confirmPassword) validationErrors.push("Passwords do not match");
              setErrors(validationErrors);
              setIsValid(validationErrors.length === 0);
       }, [password, confirmPassword]);

       const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              setSubmitError(null);
              if (isValid) {
                     setSubmitting(true);
                     try {
                            const response = await fetch("http://localhost:3000/api/users/signup", {
                                   method: "POST",
                                   headers: {
                                          "Content-Type": "application/json",
                                   },
                                   body: JSON.stringify({
                                          name,
                                          email,
                                          phone_number: phoneNumber,
                                          password,
                                   }),
                            });
                            const data = await response.json();
                            if (data.success) {
                                   alert("Registration successful! Redirecting to login...");
                                   navigate("/login");
                            } else {
                                   setSubmitError(data.message || "Registration failed. Please try again.");
                            }
                     } catch (error) {
                            setSubmitError("Network error. Please try again.");
                     } finally {
                            setSubmitting(false);
                     }
              }
       };

       return (
              <div className="login-us lg:py-20 md:py-14 py-10">
                     <div className="container">
                            <div className="content flex items-center justify-center">
                                   <div
                                          id="form-signup"
                                          className="xl:basis-1/3 lg:basis-1/2 sm:basis-2/3 max-sm:w-full">
                                          <span className="heading3 text-center">Sign Up</span>
                                          <form
                                                 className="md:mt-10 mt-6"
                                                 onSubmit={handleSubmit}>
                                                 <div className="mb-5">
                                                        <label htmlFor="name">
                                                               Name<span className="text-primary">*</span>
                                                        </label>
                                                        <input
                                                               type="text"
                                                               id="name"
                                                               className="border-line px-4 pt-3 pb-3 w-full rounded-lg mt-2 text-black bg-[#d1d1d1]"
                                                               value={name}
                                                               onChange={(e) => setName(e.target.value)}
                                                               required
                                                        />
                                                 </div>

                                                 <div className="mb-5">
                                                        <label htmlFor="email">
                                                               Email address<span className="text-primary">*</span>
                                                        </label>
                                                        <input
                                                               type="email"
                                                               id="email"
                                                               className="border-line px-4 pt-3 pb-3 w-full rounded-lg mt-2 pr-10 text-black bg-[#d1d1d1]"
                                                               value={email}
                                                               onChange={(e) => setEmail(e.target.value)}
                                                               required
                                                        />
                                                 </div>

                                                 <div className="mb-5">
                                                        <label htmlFor="phoneNumber">
                                                               Phone Number<span className="text-primary">*</span>
                                                        </label>
                                                        <input
                                                               type="text"
                                                               id="phoneNumber"
                                                               className="border-line px-4 pt-3 pb-3 w-full rounded-lg mt-2 text-black bg-[#d1d1d1]"
                                                               value={phoneNumber}
                                                               onChange={(e) => setPhoneNumber(e.target.value)}
                                                               required
                                                        />
                                                 </div>

                                                 <div className="mb-5 ">
                                                        <label htmlFor="password">
                                                               Password<span className="text-primary">*</span>
                                                        </label>
                                                        <input
                                                               type={showPassword ? "text" : "password"}
                                                               id="password"
                                                               className="border-line px-4 pt-3 pb-3 w-full rounded-lg mt-2 pr-10 text-black bg-[#d1d1d1]"
                                                               value={password}
                                                               onChange={(e) => setPassword(e.target.value)}
                                                               required
                                                        />
                                                        <button
                                                               type="button"
                                                               onClick={() => setShowPassword(!showPassword)}
                                                               className="absolute right-3 top-[46px] text-white p-0 bg-transparent border-none outline-none focus:ring-0 hover:opacity-70">
                                                               {showPassword ? (
                                                                      <EyeSlash
                                                                             size={26}
                                                                             weight="bold"
                                                                      />
                                                               ) : (
                                                                      <Eye
                                                                             size={26}
                                                                             weight="bold"
                                                                      />
                                                               )}
                                                        </button>
                                                 </div>

                                                 <div className="mb-5">
                                                        <label htmlFor="confirmPassword">
                                                               Confirm Password<span className="text-primary">*</span>
                                                        </label>
                                                        <input
                                                               type={showConfirmPassword ? "text" : "password"}
                                                               id="confirmPassword"
                                                               className="border-line px-4 pt-3 pb-3 w-full rounded-lg mt-2 pr-10 text-black bg-[#d1d1d1]"
                                                               value={confirmPassword}
                                                               onChange={(e) => setConfirmPassword(e.target.value)}
                                                               required
                                                        />
                                                        <button
                                                               type="button"
                                                               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                               className="absolute right-3 top-[46px] text-white p-0 bg-transparent border-none outline-none focus:ring-0 hover:opacity-70">
                                                               {showConfirmPassword ? (
                                                                      <EyeSlash
                                                                             size={26}
                                                                             weight="bold"
                                                                      />
                                                               ) : (
                                                                      <Eye
                                                                             size={26}
                                                                             weight="bold"
                                                                      />
                                                               )}
                                                        </button>
                                                 </div>

                                                 {errors.length > 0 && (
                                                        <ul className="text-sm text-red-500 mt-2 list-disc pl-5">
                                                               {errors.map((err, i) => (
                                                                      <li key={i}>{err}</li>
                                                               ))}
                                                        </ul>
                                                 )}

                                                 <div className="block-button mt-6">
                                                        <button
                                                               className={`w-full text-center rounded-lg px-4 py-3 font-semibold transition duration-300 ${
                                                                      isValid && name && email && password && confirmPassword
                                                                             ? "button-main" // enabled styling
                                                                             : "bg-gray-400 text-white cursor-not-allowed" // disabled styling
                                                               }`}
                                                               disabled={!(isValid && name && email && password && confirmPassword)}>
                                                               Register
                                                        </button>
                                                 </div>
                                          </form>

                                          <div className="flex items-center justify-center gap-2 mt-5">
                                                 <div className="caption1 text-variant1">Already have an account?</div>
                                                 <Link
                                                        to="/login"
                                                        className="text-button-sm text-black has-line">
                                                        Login
                                                 </Link>
                                          </div>
                                   </div>
                            </div>
                     </div>
              </div>
       );
};

export default SignupForm;
