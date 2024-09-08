import React, { useState, useContext } from 'react';
import { useAuth } from '../contexts/AuthContext';


const APIManager: React.VFC = () => {
    const [dataDisplay, setDataDisplay] = useState<string | null>(null);
    const auth = useAuth();
    if (!auth) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const fetchData = () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            fetch('http://127.0.0.1:5001/secure-data', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => setDataDisplay(JSON.stringify(data, null, 2)))
                .catch((err) => console.error('Error fetching data:', err));
        }
    };

    return (
        <React.Fragment>
            {auth.idToken ? (
                <React.Fragment>
                    <button onClick={fetchData} className='bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition'>Fetch Data</button>
                    <pre className='mt-6 p-4 bg-gray-900 text-white rounded-lg shadow-lg w-full'>{dataDisplay}</pre>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <button onClick={fetchData} className='bg-grey-500 text-black px-6 py-3 rounded-lg shadow-md' disabled>Fetch Data</button>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default APIManager;
