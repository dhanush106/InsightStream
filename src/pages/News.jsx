import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

// Using the key from Home.jsx as the original News.jsx had a placeholder
const NEWSDATA_BASE = 'https://newsdata.io/api/1/latest';
const NEWSDATA_APIKEY = "pub_9cdacaf3abf94b7a9b590b4a7856d0d8";
const USERS_API = 'http://localhost:3000/users';

const News = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userObj, setUserObj] = useState(JSON.parse(localStorage.getItem('user')));
    const [nextPage, setNextPage] = useState(null);

    const fetchNews = useCallback(async (pageCursor = null) => {
        setLoading(true);
        try {
            let url = `${NEWSDATA_BASE}?apikey=${NEWSDATA_APIKEY}&language=en`;
            if (pageCursor) {
                url += `&page=${pageCursor}`;
            }

            const response = await axios.get(url);
            const results = response.data.results || [];
            setNextPage(response.data.nextPage);

            const normalized = results.map((r, idx) => ({
                id: r.article_id || String(idx),
                title: r.title || 'Untitled',
                description: r.description || r.content || '',
                url: r.link || '',
                urlToImage: r.image_url || '',
                source: r.source_id || ''
            }));

            if (pageCursor) {
                setArticles(prev => [...prev, ...normalized]);
            } else {
                setArticles(normalized);
            }

        } catch (err) {
            console.error("Error fetching news:", err);
            setError("Failed to load news. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    const handleReadMore = async (article) => {
        // Open article
        window.open(article.url, "_blank");

        // Save to history
        if (userObj) {
            const historyItem = article.title;
            const currentHistory = userObj.history || [];

            // Avoid duplicates at the top of the list
            if (currentHistory[currentHistory.length - 1] !== historyItem) {
                const updatedHistory = [...currentHistory, historyItem];
                try {
                    // Optimistic update
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

    const isBookmarked = (article) => {
        if (!userObj || !userObj.bookmarks) return false;
        // Check if bookmark is an object (new format) or string (old format)
        return userObj.bookmarks.some(b => {
            if (typeof b === 'string') return b === article.title;
            return b.url === article.url;
        });
    };

    const handleBookmark = async (article) => {
        if (!userObj) return;

        let updatedBookmarks = [...(userObj.bookmarks || [])];
        const exists = isBookmarked(article);

        if (exists) {
            // Remove bookmark
            updatedBookmarks = updatedBookmarks.filter(b => {
                if (typeof b === 'string') return b !== article.title;
                return b.url !== article.url;
            });
        } else {
            // Add bookmark (full object)
            updatedBookmarks.push({
                id: article.id,
                title: article.title,
                description: article.description,
                url: article.url,
                urlToImage: article.urlToImage,
                source: article.source
            });
        }

        try {
            const newUserObj = { ...userObj, bookmarks: updatedBookmarks };
            setUserObj(newUserObj);
            localStorage.setItem('user', JSON.stringify(newUserObj));
            await axios.patch(`${USERS_API}/${userObj.id}`, { bookmarks: updatedBookmarks });
        } catch (err) {
            console.error("Failed to update bookmarks", err);
        }
    };

    if (loading && articles.length === 0) return (
        <div className="p-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-gray-800/50 rounded-xl animate-pulse" />
            ))}
        </div>
    );

    if (error) return <div className="p-10 text-center text-red-400">{error}</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-aqua to-purple-400">Latest Headlines</h1>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
                {articles.map((news) => (
                    <div
                        key={news.id}
                        className="group relative bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden border border-white/5 transition-all duration-500 hover:scale-105 hover:rotate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:z-10"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        <div className="relative h-48 overflow-hidden">
                            {news.urlToImage ? (
                                <img
                                    src={news.urlToImage}
                                    alt={news.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
                                    <span className="text-4xl">📰</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />

                            <button
                                onClick={(e) => { e.stopPropagation(); handleBookmark(news); }}
                                className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-aqua/20 backdrop-blur-md transition-all group/icon"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill={isBookmarked(news) ? "#00ffff" : "none"}
                                    stroke={isBookmarked(news) ? "#00ffff" : "currentColor"}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={`text-white transition-all ${isBookmarked(news) ? 'scale-110 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]' : 'group-hover/icon:text-aqua'}`}
                                >
                                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 relative">
                            <h2 className="text-lg font-bold mb-2 text-white leading-tight group-hover:text-aqua transition-colors">
                                {news.title}
                            </h2>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                {news.description}
                            </p>

                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-xs text-gray-500 font-mono">{news.source}</span>
                                <button
                                    onClick={() => handleReadMore(news)}
                                    className="relative px-4 py-2 bg-transparent text-aqua text-sm font-bold uppercase tracking-wider border border-aqua rounded overflow-hidden group/btn transition-all duration-300 hover:bg-aqua hover:text-black hover:shadow-[0_0_20px_rgba(0,255,255,0.6)]"
                                >
                                    <span className="relative z-10">Read More</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {nextPage && (
                <div className="mt-12 text-center">
                    <button
                        onClick={() => fetchNews(nextPage)}
                        disabled={loading}
                        className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full font-semibold transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50"
                    >
                        {loading ? 'Loading...' : 'Load More Stories'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default News;
