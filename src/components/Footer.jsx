import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

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
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/videos">Videos</Link></li>
                            <li><Link to="/materials">Study Materials</Link></li>
                            <li><Link to="/about">About Faculty</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section footer-contact">
                        <h4 className="footer-heading">Contact Info</h4>
                        <ul>
                            <li>📧 madhankumar.c@university.edu</li>
                            <li>📱 +91 79048 63245</li>
                            <li>🏛️ Department of Computer Science</li>
                        </ul>
                    </div>

                    <div className="footer-section footer-social">
                        <h4 className="footer-heading">Follow Us</h4>
                        <div className="social-links">
                            <a href="#" aria-label="YouTube" className="social-link">
                                <span>▶</span>
                            </a>
                            <a href="#" aria-label="LinkedIn" className="social-link">
                                <span>in</span>
                            </a>
                            <a href="#" aria-label="Twitter" className="social-link">
                                <span>𝕏</span>
                            </a>
                            <a href="#" aria-label="Email" className="social-link">
                                <span>✉</span>
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
