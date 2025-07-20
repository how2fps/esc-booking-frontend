import React from "react";
import { Route, Routes } from "react-router-dom";
import DestinationSearch from "./features/pages/destination-search/DestinationSearch";
import HotelDetails from "./features/pages/hotel-detail/HotelDetails";
import Listings from "./features/pages/hotel-listings/HotelListings";
import Login from "./features/pages/login/LoginForm";
import SignupForm from "./features/pages/signup-form/SignupForm";
const AppRoutes: React.FC = () => {
       return (
              <Routes>
                     <Route
                            path="/"
                            element={<DestinationSearch />}
                     />
                     <Route
                            path="/signup"
                            element={<SignupForm />}
                     />
                     <Route
                            path="/hotel"
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
              </Routes>
       );
};

export default AppRoutes;
