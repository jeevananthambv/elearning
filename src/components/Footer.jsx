import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Footer.css';
import { profileAPI } from '../api';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [contactInfo, setContactInfo] = useState({
        email: 'madhankumar.c@university.edu',
        phone: '+91 79048 63245',
        location: 'Department of Computer Science',
        social: {}
    });
    const [identifiers, setIdentifiers] = useState({});

    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const response = await profileAPI.get();
                if (response.success && response.data) {
                    setContactInfo({
                        email: response.data.email,
                        phone: response.data.phone,
                        location: response.data.department || response.data.location,
                        social: response.data.social || {}
                    });
                    setIdentifiers(response.data.identifiers || {});
                }
            } catch (err) {
                console.error('Failed to fetch footer info:', err);
            }
        };
        fetchContactInfo();
    }, []);

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section footer-about">
                        <h3 className="footer-title">
                            <span className="logo-icon">📚</span> E-Content Portal
                        </h3>
                        <p className="footer-text">
                            Empowering students through quality digital learning materials.
                            Dedicated to making education accessible and engaging.
                        </p>
                    </div>

                    <div className="footer-section footer-links">
                        <h4 className="footer-heading">Quick Links</h4>
                        <ul>
                            <li><Link to="/" className="footer-nav-link">Home</Link></li>
                            <li><Link to="/videos" className="footer-nav-link">Videos</Link></li>
                            <li><Link to="/materials" className="footer-nav-link">Study Materials</Link></li>
                            <li><Link to="/about" className="footer-nav-link">About Faculty</Link></li>
                            <li><Link to="/contact" className="footer-nav-link">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section footer-contact">
                        <h4 className="footer-heading">Contact Info</h4>
                        <ul>
                            <li>📧 {contactInfo.email}</li>
                            <li>📱 {contactInfo.phone}</li>
                            <li>🏛️ {contactInfo.location}</li>
                        </ul>
                    </div>

                    <div className="footer-section footer-social">
                        <h4 className="footer-heading">Follow Us</h4>
                        <div className="social-links">
                            <a 
                                href={identifiers.linkedin || 'https://www.linkedin.com/in/madhan-kumar-637231248/'} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="LinkedIn" 
                                className="social-link"
                                title="LinkedIn Profile"
                            >
                                <span>in</span>
                            </a>
                            <a 
                                href={identifiers.googleScholar || 'https://scholar.google.com/citations?hl=en&user=VLy1Y18AAAAJ'} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="Google Scholar" 
                                className="social-link"
                                title="Google Scholar"
                            >
                                <span>🎓</span>
                            </a>
                            <a 
                                href={identifiers.researchGate || 'https://www.researchgate.net/profile/Mathan-Kumar-C?ev=prf_overview'} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="ResearchGate" 
                                className="social-link"
                                title="ResearchGate Profile"
                            >
                                <span>RG</span>
                            </a>
                            <a 
                                href={identifiers.github || 'https://github.com/Mathan-2003'} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="GitHub" 
                                className="social-link"
                                title="GitHub Profile"
                            >
                                <span>💻</span>
                            </a>
                        </div>
                        <div className="social-buttons" style={{ marginTop: '12px' }}>
                            <a 
                                href={identifiers.linkedin || 'https://www.linkedin.com/in/madhan-kumar-637231248/'} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="social-button linkedin"
                                style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                            >
                                LinkedIn
                            </a>
                            <a 
                                href={identifiers.googleScholar || 'https://scholar.google.com/citations?hl=en&user=VLy1Y18AAAAJ'} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="social-button scholar"
                                style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                            >
                                Scholar
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {currentYear} Faculty E-Content Portal. All rights reserved.</p>
                    <p className="footer-credit">
                        Developed with ❤️ for enhancing student learning
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
