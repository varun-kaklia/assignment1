import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getQuotes } from '../services/api';
import { useNavigate } from 'react-router-dom';

const QuoteListPage = () => {
    const [quotes, setQuotes] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const fetchQuotes = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const data = await getQuotes(token, 10, offset);
            if (Array.isArray(data?.data)) {
                setQuotes((prevQuotes) => [...prevQuotes, ...data?.data]);
                setOffset((prevOffset) => prevOffset + 10);
                if (data?.data.length === 0) setHasMore(false);
            } else {
                throw new Error('Invalid data format');
            }
        } catch (error) {
            setError('Failed to load quotes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotes();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto p-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
                    Quotes
                </h1>
                {error && <p className="text-red-500 text-center">{error}</p>}

                <InfiniteScroll
                    dataLength={quotes.length}
                    next={fetchQuotes}
                    hasMore={hasMore}
                    loader={<h4 className="text-center">Loading...</h4>}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quotes.map((quote,index) => (
                            <div
                                key={`${quote.id}-${index}`}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            >
                                <img
                                    src={quote.mediaUrl}
                                    alt="Quote"
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <p className="text-gray-700 font-semibold mb-2">
                                        "{quote.text}"
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        By {quote.username} -{' '}
                                        {new Date(quote.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}

                    </div>
                </InfiniteScroll>
            </div>

            <button
                onClick={() => navigate('/create')}
                className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
            >
                +
            </button>
        </div>
    );
};

export default QuoteListPage;
