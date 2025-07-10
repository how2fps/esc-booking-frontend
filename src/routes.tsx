import React from "react";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./features/pages/home/HomePage";
import { SignupForm } from "./features/pages/signup-form/SignupForm";
import Home from "./features/pages/searchpage/home";
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
              </Routes>


       );
};

export default AppRoutes;
