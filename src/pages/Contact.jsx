import { useState } from 'react';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In production, this would send to a backend
        console.log('Form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
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
                                Have a question or feedback? Fill out the form below and I'll get back to you soon.
                            </p>

                            {submitted ? (
                                <div className="success-message">
                                    <span className="success-icon">✓</span>
                                    <h3>Message Sent!</h3>
                                    <p>Thank you for reaching out. I'll respond within 24-48 hours.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="contact-form">
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
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-submit">
                                        📨 Send Message
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
                                            <p>madhankumar.c@university.edu</p>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="info-icon">📱</span>
                                        <div>
                                            <strong>Phone</strong>
                                            <p>+91 79048 63245</p>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="info-icon">🏛️</span>
                                        <div>
                                            <strong>Office</strong>
                                            <p>Room 301, Computer Science Building<br />XYZ University Campus</p>
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
                                    <a href="#" className="social-button youtube">
                                        <span>▶</span> YouTube Channel
                                    </a>
                                    <a href="#" className="social-button linkedin">
                                        <span>in</span> LinkedIn Profile
                                    </a>
                                    <a href="#" className="social-button scholar">
                                        <span>📚</span> Google Scholar
                                    </a>
                                    <a href="#" className="social-button twitter">
                                        <span>𝕏</span> Twitter / X
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
