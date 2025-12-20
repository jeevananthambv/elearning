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

    // Helper to validate URLs
    const getValidUrl = (url, fallback) => {
        if (!url || typeof url !== 'string' || url.trim() === '' || url === '#') return fallback;
        const trimmed = url.trim();
        // Ensure protocol
        if (!trimmed.startsWith('http')) return `https://${trimmed}`;
        return trimmed;
    };

    return (
        <div className="contact-page page-content">
            {/* ... existing code ... */}
            <div className="social-buttons">
                <a
                    href={getValidUrl(info.identifiers?.youtube, 'https://www.youtube.com/@madhankumarc')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-button youtube"
                >
                    <span>▶</span> YouTube Channel
                </a>
                <a
                    href={getValidUrl(info.identifiers?.linkedin, 'https://www.linkedin.com/in/madhan-kumar-637231248/')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-button linkedin"
                >
                    <span>in</span> LinkedIn Profile
                </a>
                <a
                    href={getValidUrl(info.identifiers?.googleScholar, 'https://scholar.google.com/citations?hl=en&user=VLy1Y18AAAAJ')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-button scholar"
                >
                    <span>📚</span> Google Scholar
                </a>
                <a
                    href={getValidUrl(info.identifiers?.github, 'https://github.com/Mathan-2003')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-button twitter"
                    style={{ background: '#333' }}
                >
                    <span>💻</span> GitHub Profile
                </a>
            </div>
        </div>
                        </div >
                    </div >
                </div >
            </section >
        </div >
    );
};

export default Contact;
