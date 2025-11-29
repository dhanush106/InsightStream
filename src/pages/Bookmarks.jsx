import React, { useEffect, useState } from 'react';
import axios from 'axios';

const USERS_API = 'http://localhost:3000/users';

const Bookmarks = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userObj, setUserObj] = useState(JSON.parse(localStorage.getItem('user')));

    useEffect(() => {
        if (userObj) {
            axios.get(`${USERS_API}/${userObj.id}`)
                .then(res => {
                    setBookmarks(res.data.bookmarks || []);
                })
                .catch(err => console.error("Error fetching bookmarks:", err))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const handleRemoveBookmark = async (articleIdOrTitle) => {
        if (!userObj) return;

        // Filter out the bookmark. Handle both object (id/url) and string (legacy)
        const updatedBookmarks = bookmarks.filter(b => {
            if (typeof b === 'string') return b !== articleIdOrTitle;
            // If object, compare ID or URL
            return b.id !== articleIdOrTitle && b.url !== articleIdOrTitle;
        });

        setBookmarks(updatedBookmarks);

        try {
            const newUserObj = { ...userObj, bookmarks: updatedBookmarks };
            setUserObj(newUserObj);
            localStorage.setItem('user', JSON.stringify(newUserObj));
            await axios.patch(`${USERS_API}/${userObj.id}`, { bookmarks: updatedBookmarks });
        } catch (err) {
            console.error("Failed to remove bookmark", err);
        }
    };

    const handleReadMore = async (article) => {
        window.open(article.url, "_blank");

        if (userObj) {
            const historyItem = article.title;
            const currentHistory = userObj.history || [];

            if (currentHistory[currentHistory.length - 1] !== historyItem) {
                const updatedHistory = [...currentHistory, historyItem];
                try {
                    const newUserObj = { ...userObj, history: updatedHistory };
                    setUserObj(newUserObj);
                    localStorage.setItem('user', JSON.stringify(newUserObj));
                    await axios.patch(`${USERS_API}/${userObj.id}`, { history: updatedHistory });
                } catch (err) {
                    console.error("Failed to save history", err);
                }
            }
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-400">Loading bookmarks...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-aqua to-purple-400">
                Your Bookmarks
            </h1>

            {bookmarks.length === 0 ? (
                <div className="text-center p-10 bg-gray-900/50 rounded-xl border border-white/5">
                    <p className="text-gray-400">No bookmarks saved yet.</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
                    {bookmarks.map((item, index) => {
                        // Handle legacy string bookmarks
                        if (typeof item === 'string') {
                            return (
                                <div key={index} className="p-6 bg-gray-900/80 backdrop-blur-sm rounded-xl border border-white/5 hover:border-aqua/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group relative">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-2 bg-aqua/10 rounded-lg text-aqua">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
                                        </div>
                                        <button onClick={() => handleRemoveBookmark(item)} className="text-gray-500 hover:text-red-400 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                        </button>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{item}</h3>
                                    <p className="text-xs text-gray-500 italic">Legacy bookmark</p>
                                </div>
                            );
                        }

                        // Handle full object bookmarks
                        return (
                            <div
                                key={item.id || index}
                                className="group relative bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden border border-white/5 transition-all duration-500 hover:scale-105 hover:rotate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:z-10"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <div className="relative h-48 overflow-hidden">
                                    {item.urlToImage ? (
                                        <img
                                            src={item.urlToImage}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
                                            <span className="text-4xl">📰</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />

                                    <button
                                        onClick={() => handleRemoveBookmark(item.id || item.url)}
                                        className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-red-500/20 backdrop-blur-md transition-all group/icon"
                                        title="Remove Bookmark"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="#00ffff"
                                            stroke="#00ffff"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="scale-110 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] group-hover/icon:fill-red-500 group-hover/icon:stroke-red-500 transition-colors"
                                        >
                                            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="p-6 relative">
                                    <h2 className="text-lg font-bold mb-2 text-white leading-tight group-hover:text-aqua transition-colors">
                                        {item.title}
                                    </h2>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                        {item.description}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-xs text-gray-500 font-mono">{item.source}</span>
                                        <button
                                            onClick={() => handleReadMore(item)}
                                            className="relative px-4 py-2 bg-transparent text-aqua text-sm font-bold uppercase tracking-wider border border-aqua rounded overflow-hidden group/btn transition-all duration-300 hover:bg-aqua hover:text-black hover:shadow-[0_0_20px_rgba(0,255,255,0.6)]"
                                        >
                                            <span className="relative z-10">Read More</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Bookmarks;
