import { useState, useEffect } from 'react';
import './Contact.css';
import { contactAPI, profileAPI } from '../api';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [contactInfo, setContactInfo] = useState(null);

    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const response = await profileAPI.get();
                if (response.success) {
                    setContactInfo(response.data);
                }
            } catch (err) {
                console.error('Failed to fetch contact info:', err);
            }
        };
        fetchContactInfo();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await contactAPI.submit(formData);
            if (response.success) {
                setSubmitted(true);
                setTimeout(() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                }, 3000);
            }
        } catch (err) {
            console.error('Error submitting form:', err);
            let errorMessage = 'Failed to send message. Please try again.';

            // Check for specific Firebase errors
            if (err.code === 'permission-denied') {
                errorMessage = 'Permission Error: The system is blocking this message. This usually means Firestore Security Rules need to be updated to allow public writes to the "contacts" collection.';
            } else if (err.message) {
                errorMessage = `Error: ${err.message}`;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Use fetched info or defaults
    const info = contactInfo || {
        email: 'madhankumar.c@university.edu',
        phone: '+91 79048 63245',
        location: 'Room 301, Computer Science Building, XYZ University Campus',
        identifiers: {
            linkedin: 'https://www.linkedin.com/in/madhan-kumar-637231248/',
            googleScholar: 'https://scholar.google.com/citations?hl=en&user=VLy1Y18AAAAJ',
            github: 'https://github.com/Mathan-2003',
            youtube: '#'
        }
    };

    // Helper to validate URLs (currently unused but kept for future implementation)
    const _getValidUrl = (url, fallback) => {
        if (!url || typeof url !== 'string' || url.trim() === '' || url === '#') return fallback;
        const trimmed = url.trim();
        // Ensure protocol
        if (!trimmed.startsWith('http')) return `https://${trimmed}`;
        return trimmed;
    };

    return (
        <div className="contact-page page-content">
            {/* Page Header */}
            <section className="page-header">
                <div className="container">
                    <h1>Contact Us</h1>
                    <p>Get in touch for queries, feedback, or collaboration opportunities</p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="section">
                <div className="container">
                    <div className="contact-grid">
                        {/* Contact Form */}
                        <div className="contact-form-wrapper">
                            <h2>Send a Message</h2>
                            <p className="form-intro">
                                Have a question or feedback? Fill out the form below and I&apos;ll get back to you soon.
                            </p>

                            {submitted ? (
                                <div className="success-message">
                                    <span className="success-icon">✓</span>
                                    <h3>Message Sent!</h3>
                                    <p>Thank you for reaching out. I&apos;ll respond within 24-48 hours.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="contact-form">
                                    {error && (
                                        <div className="error-message">
                                            <p>{error}</p>
                                        </div>
                                    )}
                                    <div className="form-group">
                                        <label htmlFor="name">Full Name *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email Address *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="subject">Subject</label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="What is this about?"
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="message">Message *</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Type your message here..."
                                            rows="5"
                                            required
                                            disabled={loading}
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-submit"
                                        disabled={loading}
                                    >
                                        {loading ? '⏳ Sending...' : '📨 Send Message'}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div className="contact-info">
                            <div className="info-card card">
                                <h3>Contact Information</h3>
                                <ul className="info-list">
                                    <li>
                                        <span className="info-icon">📧</span>
                                        <div>
                                            <strong>Email</strong>
                                            <p>{info.email}</p>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="info-icon">📱</span>
                                        <div>
                                            <strong>Phone</strong>
                                            <p>{info.phone}</p>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="info-icon">🏛️</span>
                                        <div>
                                            <strong>Office</strong>
                                            <p>{info.location}</p>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="info-icon">🕐</span>
                                        <div>
                                            <strong>Office Hours</strong>
                                            <p>Mon - Fri: 10:00 AM - 5:00 PM</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="social-card card">
                                <h3>Connect on Social Media</h3>
                                <div className="social-buttons">
                                    <a
                                        href="https://www.youtube.com/@madhankumarc"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-button youtube"
                                    >
                                        <span>▶</span> YouTube Channel
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/in/madhan-kumar-637231248/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-button linkedin"
                                    >
                                        <span>in</span> LinkedIn Profile
                                    </a>
                                    <a
                                        href="https://scholar.google.com/citations?hl=en&user=VLy1Y18AAAAJ"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-button scholar"
                                    >
                                        <span>📚</span> Google Scholar
                                    </a>
                                    <a
                                        href="https://github.com/Mathan-2003"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-button twitter"
                                        style={{ background: '#333' }}
                                    >
                                        <span>💻</span> GitHub Profile
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
