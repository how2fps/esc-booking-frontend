"use client";

import Category from "../../components/Category/CategoryOne";
import Footer from "../../components/Footer/Footer";
import HeaderOne from "../../components/Header/Header";
const Home = () => {
       return (
              <>
                     <div className="page-one ">
                            <HeaderOne />
                            <Category />
                            <Footer />
                     </div>
              </>
       );
};

export default Home;
