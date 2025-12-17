import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { videosAPI, materialsAPI } from '../api';
import './Search.css';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState({ videos: [], materials: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        if (query) {
            searchContent();
        }
    }, [query]);

    const searchContent = async () => {
        setLoading(true);
        try {
            const [videosRes, materialsRes] = await Promise.all([
                videosAPI.getAll(),
                materialsAPI.getAll()
            ]);

            const searchLower = query.toLowerCase();

            const filteredVideos = videosRes.data.filter(v =>
                v.title.toLowerCase().includes(searchLower) ||
                v.subject.toLowerCase().includes(searchLower) ||
                (v.description && v.description.toLowerCase().includes(searchLower))
            );

            const filteredMaterials = materialsRes.data.filter(m =>
                m.title.toLowerCase().includes(searchLower) ||
                m.category.toLowerCase().includes(searchLower)
            );

            setResults({ videos: filteredVideos, materials: filteredMaterials });
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalResults = results.videos.length + results.materials.length;

    const getDisplayedResults = () => {
        switch (activeTab) {
            case 'videos': return { videos: results.videos, materials: [] };
            case 'materials': return { videos: [], materials: results.materials };
            default: return results;
        }
    };

    const displayedResults = getDisplayedResults();

    return (
        <div className="search-page page-content">
            <section className="search-header">
                <div className="container">
                    <h1>Search Results</h1>
                    <p>
                        {loading ? 'Searching...' : (
                            <>Found <strong>{totalResults}</strong> results for "<strong>{query}</strong>"</>
                        )}
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {/* Filter Tabs */}
                    <div className="search-tabs">
                        <button
                            className={`search-tab ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            All ({totalResults})
                        </button>
                        <button
                            className={`search-tab ${activeTab === 'videos' ? 'active' : ''}`}
                            onClick={() => setActiveTab('videos')}
                        >
                            🎬 Videos ({results.videos.length})
                        </button>
                        <button
                            className={`search-tab ${activeTab === 'materials' ? 'active' : ''}`}
                            onClick={() => setActiveTab('materials')}
                        >
                            📄 Materials ({results.materials.length})
                        </button>
                    </div>

                    {loading ? (
                        <div className="search-loading">
                            <div className="loading-spinner"></div>
                            <p>Searching...</p>
                        </div>
                    ) : totalResults === 0 ? (
                        <div className="no-results">
                            <span className="no-results-icon">🔍</span>
                            <h3>No results found</h3>
                            <p>Try different keywords or browse our content</p>
                            <div className="no-results-actions">
                                <Link to="/videos" className="btn btn-primary">Browse Videos</Link>
                                <Link to="/materials" className="btn btn-outline">Browse Materials</Link>
                            </div>
                        </div>
                    ) : (
                        <div className="search-results">
                            {/* Videos Results */}
                            {displayedResults.videos.length > 0 && (
                                <div className="results-section">
                                    <h2>🎬 Videos</h2>
                                    <div className="results-grid">
                                        {displayedResults.videos.map(video => (
                                            <Link
                                                to="/videos"
                                                state={{ play: video._id }}
                                                key={video._id}
                                                className="result-card video-result card"
                                            >
                                                <div className="result-thumb">
                                                    <img src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} alt={video.title} />
                                                    <span className="result-duration">{video.duration}</span>
                                                </div>
                                                <div className="result-info">
                                                    <span className="result-badge">{video.subject}</span>
                                                    <h3>{video.title}</h3>
                                                    <p>{video.description?.substring(0, 100)}...</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Materials Results */}
                            {displayedResults.materials.length > 0 && (
                                <div className="results-section">
                                    <h2>📄 Study Materials</h2>
                                    <div className="results-list">
                                        {displayedResults.materials.map(material => (
                                            <Link
                                                to="/materials"
                                                state={{ highlight: material._id }}
                                                key={material._id}
                                                className="result-card material-result card"
                                            >
                                                <div className="material-icon">
                                                    {material.type === 'PDF' ? '📄' : material.type === 'PPT' ? '📊' : '📝'}
                                                </div>
                                                <div className="result-info">
                                                    <span className="result-badge">{material.category}</span>
                                                    <h3>{material.title}</h3>
                                                    <p>{material.type} • {material.size}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Search;
