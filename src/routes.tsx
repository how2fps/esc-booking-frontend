import React from "react";
import { Route, Routes } from "react-router-dom";
import BookingPage from "./features/pages/booking/BookingPage";
import CheckoutForm from "./features/pages/CheckoutForm/Checkout";
import DestinationSearch from "./features/pages/destination-search/DestinationSearch";
import HomePage from "./features/pages/home/HomePage";
import HotelDetails from "./features/pages/hotel-detail/HotelDetails";
import Listings from "./features/pages/hotel-listings/HotelListings";
import Login from "./features/pages/login/LoginForm";
import SignupForm from "./features/pages/signup-form/SignupForm";
import ProfilePage from "./features/pages/profile/ProfilePage";

import ReturnForm from "./features/pages/returnForm/Return";


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
                            element={<DestinationSearch />}
                     />
                     <Route
                            path="/hotels/:id"
                            element={<HotelDetails />}
                     />
                     <Route
                            path="/hotels"
                            element={<Listings />}
                     />
                     <Route
                            path="/login"
                            element={<Login />}
                     />
                     <Route
                            path="/profile"
                            element={<ProfilePage />}
                     />
                     <Route
                            path="/booking"
                            element={<BookingPage />}
                     />
                     <Route
                            path="/return"
                            element={<ReturnForm />}
                     />
                     <Route
                            path="/checkout"
                            element={<CheckoutForm />}
                     />
              </Routes>
       );
};

export default AppRoutes;
