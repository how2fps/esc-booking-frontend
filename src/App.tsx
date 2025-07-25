import { BrowserRouter } from "react-router-dom";



import "./App.css";
import Footer from "./features/components/Footer/Footer";
import HeaderOne from "./features/components/Header/Header";
import AppRoutes from "./routes";
import "./styles/styles.scss";


function App() {
       return (
              <BrowserRouter>
                     <HeaderOne />
                     <AppRoutes />
                     <Footer />
              </BrowserRouter>
       );
}

export default App;
