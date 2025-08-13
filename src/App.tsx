import { BrowserRouter } from "react-router-dom";

import "./App.css";
import Footer from "./features/components/Footer/Footer";
import HeaderOne from "./features/components/Header/Header";
import AppRoutes from "./routes";
import "./styles/styles.scss";
import { AuthProvider } from "./features/components/context/AuthContext"; 

function App() {
  return (
       <AuthProvider>
              <BrowserRouter>
              <div className="-z-10">
                     <HeaderOne />
              </div>
                    
                     <div className="z-10">
                            <AppRoutes />
                     </div>
                     <div className="-z-10">
                     <Footer />
              </div>
              </BrowserRouter>
       </AuthProvider>
  );
}

export default App;
