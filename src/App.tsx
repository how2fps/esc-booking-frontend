import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Footer from "./features/components/Footer/Footer";
import Header from "./features/components/Header/Header";
import AppRoutes from "./routes";
import "./styles/styles.scss";

function App() {
       return (
              <BrowserRouter>
                     <Header />
                     <AppRoutes />
                     <Footer />
              </BrowserRouter>
       );
}

export default App;
