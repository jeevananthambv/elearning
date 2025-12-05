import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { videosAPI, statsAPI } from '../api';
import './Home.css';

const Home = () => {
    const [recentVideos, setRecentVideos] = useState([]);
    const [stats, setStats] = useState({ videos: 0, materials: 0, views: 0, downloads: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [videosRes, statsRes] = await Promise.all([
                videosAPI.getAll(),
                statsAPI.getPublic()
            ]);

            if (videosRes.success) {
                setRecentVideos(videosRes.data.slice(0, 3));
            }
            if (statsRes.success) {
                setStats(statsRes.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: '🎬', title: 'Video Lectures', desc: 'High-quality video content for visual learning' },
        { icon: '📚', title: 'Study Materials', desc: 'Comprehensive notes, PPTs, and documents' },
        { icon: '🎓', title: 'Expert Faculty', desc: 'Learn from experienced professors' },
        { icon: '💡', title: 'Interactive Learning', desc: 'Engage with dynamic content' }
    ];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-background">
                    <div className="hero-particles">
                        {[...Array(20)].map((_, i) => (
                            <span key={i} className="particle" style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${5 + Math.random() * 10}s`
                            }}></span>
                        ))}
                    </div>
                    <div className="hero-overlay"></div>
                </div>
                <div className="container hero-content">
                    <div className="hero-text animate-slide-left">
                        <span className="hero-badge">🎓 E-Learning Portal</span>
                        <h1 className="hero-title">
                            <span className="gradient-text">Faculty Contribution</span> in Development of E-Content
                        </h1>
                        <p className="hero-subtitle">
                            Empowering Learning Through Digital Content
                        </p>
                        <p className="hero-description">
                            Welcome to our educational portal where quality meets accessibility.
                            Explore comprehensive video lectures, study materials, and resources
                            designed to enhance your learning experience.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/videos" className="btn btn-accent pulse">
                                🎬 Browse Videos
                            </Link>
                            <Link to="/materials" className="btn btn-outline hero-btn-outline">
                                📚 Study Materials
                            </Link>
                        </div>
                    </div>
                    <div className="hero-image animate-slide-right">
                        <div className="hero-image-wrapper float">
                            <div className="hero-stats-card glass">
                                <span className="stats-icon">📊</span>
                                <div className="stats-info">
                                    <strong>{stats.views || '1000+'}+</strong>
                                    <span>Total Views</span>
                                </div>
                            </div>
                            <img
                                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&h=600&fit=crop"
                                alt="Faculty Teaching"
                            />
                            <div className="hero-image-decoration"></div>
                        </div>
                    </div>
                </div>
                <div className="hero-wave">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="var(--color-background)" />
                    </svg>
                </div>
            </section>

            {/* Features Section */}
            <section className="section features-section">
                <div className="container">
                    <h2 className="section-title">Why Choose Us?</h2>
                    <div className="features-grid stagger-animate">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card card">
                                <span className="feature-icon">{feature.icon}</span>
                                <h3>{feature.title}</h3>
                                <p>{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Live Stats Section */}
            <section className="section stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-box animate-scale-in">
                            <span className="stat-icon">🎬</span>
                            <span className="stat-number">{stats.videos || 50}+</span>
                            <span className="stat-label">Video Lectures</span>
                        </div>
                        <div className="stat-box animate-scale-in" style={{ animationDelay: '0.1s' }}>
                            <span className="stat-icon">📚</span>
                            <span className="stat-number">{stats.materials || 100}+</span>
                            <span className="stat-label">Study Materials</span>
                        </div>
                        <div className="stat-box animate-scale-in" style={{ animationDelay: '0.2s' }}>
                            <span className="stat-icon">👁️</span>
                            <span className="stat-number">{stats.views || 1000}+</span>
                            <span className="stat-label">Total Views</span>
                        </div>
                        <div className="stat-box animate-scale-in" style={{ animationDelay: '0.3s' }}>
                            <span className="stat-icon">⬇️</span>
                            <span className="stat-number">{stats.downloads || 500}+</span>
                            <span className="stat-label">Downloads</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent Videos Section */}
            <section className="section videos-section">
                <div className="container">
                    <h2 className="section-title">Latest Video Lectures</h2>
                    {loading ? (
                        <div className="videos-grid stagger-animate">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="video-card card skeleton-card">
                                    <div className="skeleton skeleton-thumb"></div>
                                    <div className="skeleton-info">
                                        <div className="skeleton skeleton-badge"></div>
                                        <div className="skeleton skeleton-title"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="videos-grid stagger-animate">
                            {recentVideos.map((video) => (
                                <Link to="/videos" key={video._id} className="video-card card">
                                    <div className="video-thumbnail">
                                        <img src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`} alt={video.title} />
                                        <div className="video-overlay">
                                            <button className="play-btn">▶</button>
                                        </div>
                                        <span className="video-duration">{video.duration}</span>
                                    </div>
                                    <div className="video-info">
                                        <span className="video-subject">{video.subject}</span>
                                        <h3 className="video-title">{video.title}</h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                    <div className="section-footer">
                        <Link to="/videos" className="btn btn-primary">
                            View All Videos →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="section mission-section">
                <div className="container">
                    <div className="mission-content">
                        <div className="mission-icon float">🎯</div>
                        <h2 className="section-title">Our Mission</h2>
                        <p className="mission-text">
                            To create high-quality, accessible digital learning resources that empower students
                            to excel in their academic journey. Through carefully curated video lectures,
                            comprehensive study materials, and interactive content, we aim to bridge the gap
                            between traditional classroom learning and modern educational needs.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-background">
                    <div className="cta-shapes">
                        <span className="shape shape-1"></span>
                        <span className="shape shape-2"></span>
                        <span className="shape shape-3"></span>
                    </div>
                </div>
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Start Learning?</h2>
                        <p>Access all educational resources and take your learning to the next level.</p>
                        <div className="cta-buttons">
                            <Link to="/videos" className="btn btn-accent">
                                Get Started Now 🚀
                            </Link>
                            <Link to="/contact" className="btn btn-outline cta-btn-outline">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
