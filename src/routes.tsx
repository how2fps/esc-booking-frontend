import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./features/pages/home/Home";
import HotelDetail from "./features/pages/hotel-details/HotelDetails";
import HotelListings from "./features/pages/hotel-list/HotelList";
import Login from "./features/pages/login/LoginForm";
import SignupForm from "./features/pages/sign-up/SignUpForm";
const AppRoutes: React.FC = () => {
       return (
              <Routes>
                     <Route
                            path="/"
                            element={<Home />}
                     />
                     <Route
                            path="/dashboard"
                            element={<Home />}
                     />
                     <Route
                            path="/login"
                            element={<Login />}
                     />
                     <Route
                            path="/signup"
                            element={<SignupForm />}
                     />
                     <Route
                            path="/hotel"
                            element={<HotelDetail />}
                     />
                     <Route
                            path="/hotel-list"
                            element={<HotelListings />}
                     />
              </Routes>
       );
};

export default AppRoutes;
