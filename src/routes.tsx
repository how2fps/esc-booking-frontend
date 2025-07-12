import React from "react";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./features/pages/home/HomePage";
import SignupForm from "./features/pages/signup-form/SignupForm";
import Home from "./features/pages/searchpage/home";
import HotelDetail from "./features/pages/hotel-detail/hotel-detail";
import Listings from "./features/pages/hotel-list/hotel-list";
import Login from "./features/pages/login/page";
const AppRoutes: React.FC = () => {
       return (


              <Routes>
                     <Route
                            path="/"
                            element={<HomePage />}
                     />
                     <Route
                            path="/signup"
                            element={<SignupForm />}
                     />

                     <Route
                            path="/dashboard"
                            element={<Home />}
                     />

                     <Route
                            path="/dashboard"
                            element={<Home />}
                     />
                     <Route
                            path="/hotel"
                            element={<HotelDetail />}
                     />
                     <Route
                            path="/hotel-list"
                            element={<Listings />}
                     />
                     <Route
                            path="/login"
                            element={<Login />}
                     />
              </Routes>


       );
};

export default AppRoutes;
