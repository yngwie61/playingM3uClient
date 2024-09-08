import React, {useContext} from 'react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
    const auth = useAuth();
    if (!auth) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
  
    return (
        <header className="fixed top-0 w-full bg-gray-500 text-white p-4 flex items-center justify-between shadow-lg z-50">
        {!auth.idToken ? (
            <button
            onClick={auth.login}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
            >
            Login
            </button>
        ) : (
            <div className="flex items-center space-x-4">
                <img src="profile.png" alt="Profile" className="w-10 h-10 rounded-full border-2 border-white" />
                <button
                    onClick={auth.logout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>
        )}
        </header>
    );
};
  
export default Header;