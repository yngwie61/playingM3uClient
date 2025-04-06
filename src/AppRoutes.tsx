import {
    BrowserRouter,
    Route,
    Routes
} from "react-router-dom";

import App from './App';
import { AuthCallback } from "./AuthCallback";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />} />
                <Route path='/callback' element={<AuthCallback />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;