import { BrowserRouter } from "react-router-dom";
import "./App.css";
import './styles/styles.scss'
import AppRoutes from "./routes";

function App() {
       return (
              <BrowserRouter>
                     <AppRoutes />
              </BrowserRouter>
      
       );
}

export default App;
