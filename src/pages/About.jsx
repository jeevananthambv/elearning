import './About.css';

const About = () => {
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
                                src="https://via.placeholder.com/400x500/001f3f/d4af37?text=Faculty+Photo"
                                alt="Madhankumar C"
                                className="profile-image"
                            />
                            <div className="profile-decoration"></div>
                        </div>
                        <div className="profile-content">
                            <h2 className="profile-name">Madhankumar C</h2>
                            <p className="profile-title">Associate Professor, Department of Computer Science</p>
                            <div className="profile-badges">
                                <span className="badge">PhD in Computer Science</span>
                                <span className="badge">15+ Years Experience</span>
                                <span className="badge">Research Scholar</span>
                            </div>
                            <p className="profile-bio">
                                Madhankumar C is an accomplished educator and researcher with extensive
                                experience in teaching Computer Science at the university level. His passion for
                                making technology accessible to all students has driven him to develop comprehensive
                                e-content that bridges the gap between theory and practical application.
                            </p>
                            <div className="profile-social">
                                <a href="#" className="social-btn">LinkedIn</a>
                                <a href="#" className="social-btn">Google Scholar</a>
                                <a href="#" className="social-btn">ResearchGate</a>
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
                        <div className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content card">
                                <span className="timeline-year">2020 - Present</span>
                                <h3>Associate Professor</h3>
                                <p>Department of Computer Science, XYZ University</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content card">
                                <span className="timeline-year">2012 - 2020</span>
                                <h3>Assistant Professor</h3>
                                <p>Department of Computer Science, ABC College</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content card">
                                <span className="timeline-year">2008 - 2012</span>
                                <h3>Ph.D. in Computer Science</h3>
                                <p>Indian Institute of Technology, Delhi</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content card">
                                <span className="timeline-year">2006 - 2008</span>
                                <h3>M.Tech in Computer Science</h3>
                                <p>National Institute of Technology</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Teaching Interests */}
            <section className="section interests-section">
                <div className="container">
                    <h2 className="section-title">Teaching Interests</h2>
                    <div className="interests-grid">
                        <div className="interest-card card">
                            <span className="interest-icon">🔢</span>
                            <h3>Data Structures</h3>
                            <p>Arrays, Linked Lists, Trees, Graphs, and their applications</p>
                        </div>
                        <div className="interest-card card">
                            <span className="interest-icon">⚙️</span>
                            <h3>Algorithms</h3>
                            <p>Algorithm design, analysis, and optimization techniques</p>
                        </div>
                        <div className="interest-card card">
                            <span className="interest-icon">💻</span>
                            <h3>Object-Oriented Programming</h3>
                            <p>OOP concepts using Java and Python</p>
                        </div>
                        <div className="interest-card card">
                            <span className="interest-icon">🗄️</span>
                            <h3>Database Systems</h3>
                            <p>SQL, NoSQL, database design and normalization</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* E-Content Contribution */}
            <section className="section contribution-section">
                <div className="container">
                    <h2 className="section-title">Contributions to E-Content Development</h2>
                    <div className="contribution-content">
                        <div className="contribution-text">
                            <p>
                                As an advocate for digital education, I have been actively involved in developing
                                e-learning resources that cater to diverse learning styles. My contributions include:
                            </p>
                            <ul className="contribution-list">
                                <li>
                                    <span className="contribution-icon">🎬</span>
                                    <div>
                                        <strong>Video Lectures:</strong> Over 50 comprehensive video lectures covering
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
                                <li>
                                    <span className="contribution-icon">❓</span>
                                    <div>
                                        <strong>Practice Resources:</strong> Question banks, solved examples, and
                                        self-assessment tools.
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="contribution-stats">
                            <div className="stat-box">
                                <span className="stat-value">50+</span>
                                <span className="stat-desc">Video Lectures</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-value">100+</span>
                                <span className="stat-desc">Study Materials</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-value">1000+</span>
                                <span className="stat-desc">Students Impacted</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-value">5+</span>
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
