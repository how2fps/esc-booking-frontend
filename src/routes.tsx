import React from "react";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./features/home/HomePage";
import { SignupForm } from "./features/signup-form/SignupForm";

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
              </Routes>
       );
};

export default AppRoutes;
