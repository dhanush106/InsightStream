import React, { useEffect, useState } from 'react';
import axios from 'axios';

const USERS_API = 'http://localhost:3000/users';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (user) {
            axios.get(`${USERS_API}/${user.id}`)
                .then(res => {
                    setHistory(res.data.history || []);
                })
                .catch(err => console.error("Error fetching history:", err))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-400">Loading history...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-aqua to-purple-400">
                Reading History
            </h1>

            {history.length === 0 ? (
                <div className="text-center p-10 bg-gray-900/50 rounded-xl border border-white/5">
                    <p className="text-gray-400">You haven't read any articles yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.slice().reverse().map((item, index) => (
                        <div
                            key={index}
                            className="p-4 bg-gray-900/80 backdrop-blur-sm rounded-lg border border-white/5 hover:border-aqua/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)] flex items-center gap-4"
                        >
                            <div className="w-2 h-2 rounded-full bg-aqua shadow-[0_0_10px_rgba(0,255,255,0.8)]"></div>
                            <span className="text-gray-200 font-medium">{item}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
