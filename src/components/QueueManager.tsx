import React, { useState, useContext } from 'react';
import { useAuth } from '../contexts/AuthContext';

const QueueManager: React.FC = () => {
    const [queueData, setQueueData] = useState<string | null>(null);
    const auth = useAuth();
    if (!auth) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const addQueue = () => {
        const token = localStorage.getItem('access_token');
        const randSessionId = Math.floor(Math.random() * 10000);
        if (token) {
            fetch('http://127.0.0.1:7777/add_queue', {
                method: 'POST',
                body: JSON.stringify({ user_id: 'user1', session_id: randSessionId }),
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
                .then(() => {
                    setInterval(() => {
                        fetch('http://127.0.0.1:7777/update_queue', {
                            method: 'POST',
                            body: JSON.stringify({ user_id: 'user1', session_id: randSessionId }),
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        })
                            .then((response) => response.json())
                            .then((updateQueueData) => {
                                setQueueData(JSON.stringify(updateQueueData, null, 2));
                            })
                            .catch((err) => {
                                console.error('Error updating queue:', err);
                            });
                    }, 10000);
                })
                .catch((err) => console.error('Error adding to queue:', err));
        }
    };

    return (
        <React.Fragment>
            {auth.idToken ? (
                <React.Fragment>
                    <button onClick={addQueue} className='bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition'>Add Queue</button>
                    <pre className='mt-6 p-4 bg-gray-900 text-white rounded-lg shadow-lg w-full'>{queueData}</pre>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <button onClick={addQueue} className='bg-grey-500 text-black px-6 py-3 rounded-lg shadow-md' disabled>Add Queue</button>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default QueueManager;
