import { Link } from 'react-router-dom';
import './Home.css';

// Mock data for demonstration
const recentVideos = [
    { id: 1, title: 'Introduction to Data Structures', subject: 'Computer Science', thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop', duration: '45:30' },
    { id: 2, title: 'Object Oriented Programming Basics', subject: 'Programming', thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop', duration: '38:15' },
    { id: 3, title: 'Database Management Systems', subject: 'DBMS', thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=225&fit=crop', duration: '52:00' },
];

const recentMaterials = [
    { id: 1, title: 'Data Structures Notes', type: 'PDF', icon: '📄' },
    { id: 2, title: 'OOP Presentation', type: 'PPT', icon: '📊' },
    { id: 3, title: 'DBMS Lab Manual', type: 'PDF', icon: '📄' },
];

const Home = () => {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-background">
                    <div className="hero-overlay"></div>
                </div>
                <div className="container hero-content">
                    <div className="hero-text animate-slide-left">
                        <span className="hero-badge">🎓 E-Learning Portal</span>
                        <h1 className="hero-title">Faculty Contribution in Development of E-Content</h1>
                        <p className="hero-subtitle">
                            Empowering Learning Through Digital Content
                        </p>
                        <p className="hero-description">
                            Welcome to our educational portal where quality meets accessibility.
                            Explore comprehensive video lectures, study materials, and resources
                            designed to enhance your learning experience.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/videos" className="btn btn-accent">
                                🎬 Browse Videos
                            </Link>
                            <Link to="/materials" className="btn btn-outline hero-btn-outline">
                                📚 Study Materials
                            </Link>
                        </div>
                    </div>
                    <div className="hero-image animate-slide-right">
                        <div className="hero-image-wrapper">
                            <img
                                src="https://via.placeholder.com/500x600/001f3f/d4af37?text=Faculty+Photo"
                                alt="Madhankumar C"
                            />
                            <div className="hero-image-decoration"></div>
                        </div>
                    </div>
                </div>
                <div className="hero-wave">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Mission Section */}
            <section className="section mission-section">
                <div className="container">
                    <div className="mission-content">
                        <div className="mission-icon">🎯</div>
                        <h2 className="section-title">Our Mission</h2>
                        <p className="mission-text">
                            To create high-quality, accessible digital learning resources that empower students
                            to excel in their academic journey. Through carefully curated video lectures,
                            comprehensive study materials, and interactive content, we aim to bridge the gap
                            between traditional classroom learning and modern educational needs.
                        </p>
                        <div className="mission-stats">
                            <div className="stat-item">
                                <span className="stat-number">50+</span>
                                <span className="stat-label">Video Lectures</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">100+</span>
                                <span className="stat-label">Study Materials</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">1000+</span>
                                <span className="stat-label">Students Reached</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent Videos Section */}
            <section className="section videos-section">
                <div className="container">
                    <h2 className="section-title">Latest Video Lectures</h2>
                    <div className="videos-grid">
                        {recentVideos.map((video) => (
                            <div key={video.id} className="video-card card">
                                <div className="video-thumbnail">
                                    <img src={video.thumbnail} alt={video.title} />
                                    <div className="video-overlay">
                                        <button className="play-btn">▶</button>
                                    </div>
                                    <span className="video-duration">{video.duration}</span>
                                </div>
                                <div className="video-info">
                                    <span className="video-subject">{video.subject}</span>
                                    <h3 className="video-title">{video.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="section-footer">
                        <Link to="/videos" className="btn btn-primary">
                            View All Videos →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Recent Materials Section */}
            <section className="section materials-section">
                <div className="container">
                    <h2 className="section-title">Recent Study Materials</h2>
                    <div className="materials-grid">
                        {recentMaterials.map((material) => (
                            <div key={material.id} className="material-card card">
                                <div className="material-icon">{material.icon}</div>
                                <div className="material-info">
                                    <h3 className="material-title">{material.title}</h3>
                                    <span className="material-type">{material.type}</span>
                                </div>
                                <button className="btn btn-outline material-btn">Download</button>
                            </div>
                        ))}
                    </div>
                    <div className="section-footer">
                        <Link to="/materials" className="btn btn-primary">
                            Browse All Materials →
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Start Learning?</h2>
                        <p>Access all educational resources and take your learning to the next level.</p>
                        <Link to="/videos" className="btn btn-accent">
                            Get Started Now
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
