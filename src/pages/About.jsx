import { useState, useEffect } from 'react';
import './About.css';
import { profileAPI } from '../api';

const About = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await profileAPI.get();
                if (response.success) {
                    setProfile(response.data);
                }
            } catch (err) {
                console.error('Failed to fetch profile:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="about-page page-content">
                <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
                    Loading profile...
                </div>
            </div>
        );
    }

    // Default fallback if no data
    const displayProfile = profile || {
        name: 'Madhankumar C',
        title: 'Assistant Professor',
        department: 'Computer Science',
        about: 'Faculty description loading...',
        image: 'https://via.placeholder.com/400x500/001f3f/d4af37?text=Faculty+Photo'
    };

    return (
        <div className="about-page page-content">
            {/* Page Header */}
            <section className="page-header">
                <div className="container">
                    <h1>About Faculty</h1>
                    <p>Learn more about the educator behind this e-content portal</p>
                </div>
            </section>

            {/* Profile Section */}
            <section className="section profile-section">
                <div className="container">
                    <div className="profile-card">
                        <div className="profile-image-wrapper">
                            <img
                                src={displayProfile.image || "https://via.placeholder.com/400x500/001f3f/d4af37?text=Faculty+Photo"}
                                alt={displayProfile.name}
                                className="profile-image"
                            />
                            <div className="profile-decoration"></div>
                        </div>
                        <div className="profile-content">
                            <h2 className="profile-name">{displayProfile.name}</h2>
                            <p className="profile-title">{displayProfile.title}, {displayProfile.department}</p>
                            <div className="profile-badges">
                                <span className="badge">{displayProfile.education}</span>
                                <span className="badge">{displayProfile.experience} Experience</span>
                                <span className="badge">Research Scholar</span>
                            </div>
                            <p className="profile-bio">
                                {displayProfile.about}
                            </p>
                            <div className="profile-social">
                                {displayProfile.social?.linkedin && (
                                    <a href={displayProfile.social.linkedin} target="_blank" rel="noopener noreferrer" className="social-btn">LinkedIn</a>
                                )}
                                {displayProfile.social?.scholar && (
                                    <a href={displayProfile.social.scholar} target="_blank" rel="noopener noreferrer" className="social-btn">Google Scholar</a>
                                )}
                                {displayProfile.social?.researchgate && (
                                    <a href={displayProfile.social.researchgate} target="_blank" rel="noopener noreferrer" className="social-btn">ResearchGate</a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Background Section */}
            <section className="section background-section">
                <div className="container">
                    <h2 className="section-title">Academic Background</h2>
                    <div className="timeline">
                        {displayProfile.academicBackground && displayProfile.academicBackground.length > 0 ? (
                            displayProfile.academicBackground.map((item, index) => (
                                <div key={index} className="timeline-item">
                                    <div className="timeline-marker"></div>
                                    <div className="timeline-content card">
                                        <span className="timeline-year">{item.year}</span>
                                        <h3>{item.role}</h3>
                                        <p>{item.institution}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No academic background information available.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Teaching Interests */}
            <section className="section interests-section">
                <div className="container">
                    <h2 className="section-title">Teaching Interests</h2>
                    <div className="interests-grid">
                        {displayProfile.teachingInterests && displayProfile.teachingInterests.length > 0 ? (
                            displayProfile.teachingInterests.map((item, index) => (
                                <div key={index} className="interest-card card">
                                    <span className="interest-icon">{item.icon || '📚'}</span>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </div>
                            ))
                        ) : (
                            <p>No teaching interests listed.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* E-Content Contribution */}
            <section className="section contribution-section">
                <div className="container">
                    <h2 className="section-title">{displayProfile.contributionTitle || 'Contributions to E-Content Development'}</h2>
                    <div className="contribution-content">
                        <div className="contribution-text">
                            <p>
                                {displayProfile.contributionText || 'As an advocate for digital education, I have been actively involved in developing e-learning resources that cater to diverse learning styles. My contributions include:'}
                            </p>
                            <ul className="contribution-list">
                                <li>
                                    <span className="contribution-icon">🎬</span>
                                    <div>
                                        <strong>Video Lectures:</strong> Comprehensive video lectures covering
                                        core Computer Science subjects, designed for self-paced learning.
                                    </div>
                                </li>
                                <li>
                                    <span className="contribution-icon">📚</span>
                                    <div>
                                        <strong>Study Materials:</strong> Detailed notes, presentations, and reference
                                        guides that complement classroom teaching.
                                    </div>
                                </li>
                                <li>
                                    <span className="contribution-icon">🧪</span>
                                    <div>
                                        <strong>Lab Manuals:</strong> Step-by-step practical guides for hands-on
                                        learning experiences.
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="contribution-stats">
                            <div className="stat-box">
                                <span className="stat-value">{displayProfile.contributionStats?.lectures || '50+'}</span>
                                <span className="stat-desc">Video Lectures</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-value">{displayProfile.contributionStats?.materials || '100+'}</span>
                                <span className="stat-desc">Study Materials</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-value">{displayProfile.contributionStats?.students || '1000+'}</span>
                                <span className="stat-desc">Students Impacted</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-value">{displayProfile.contributionStats?.subjects || '5+'}</span>
                                <span className="stat-desc">Subjects Covered</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
