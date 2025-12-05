import { useState } from 'react';
import './Admin.css';

const Admin = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeTab, setActiveTab] = useState('videos');
    const [loginData, setLoginData] = useState({ email: '', password: '' });

    const handleLogin = (e) => {
        e.preventDefault();
        // Demo login - in production, this would authenticate against a backend
        if (loginData.email && loginData.password) {
            setIsLoggedIn(true);
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setLoginData({ email: '', password: '' });
    };

    if (!isLoggedIn) {
        return (
            <div className="admin-page page-content">
                <section className="login-section">
                    <div className="login-card card">
                        <div className="login-header">
                            <span className="login-icon">🔐</span>
                            <h2>Admin Login</h2>
                            <p>Sign in to manage your e-content portal</p>
                        </div>
                        <form onSubmit={handleLogin} className="login-form">
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                    placeholder="admin@university.edu"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-login">
                                Sign In
                            </button>
                        </form>
                        <p className="login-hint">
                            Demo: Use any email/password to login
                        </p>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="admin-page page-content">
            {/* Admin Header */}
            <section className="admin-header">
                <div className="container">
                    <div className="admin-header-content">
                        <div>
                            <h1>Admin Dashboard</h1>
                            <p>Manage your videos and study materials</p>
                        </div>
                        <button onClick={handleLogout} className="btn btn-outline logout-btn">
                            Logout
                        </button>
                    </div>
                </div>
            </section>

            {/* Dashboard Content */}
            <section className="section admin-dashboard">
                <div className="container">
                    {/* Stats Cards */}
                    <div className="stats-grid">
                        <div className="stat-card card">
                            <span className="stat-icon">🎬</span>
                            <div className="stat-info">
                                <span className="stat-number">6</span>
                                <span className="stat-label">Total Videos</span>
                            </div>
                        </div>
                        <div className="stat-card card">
                            <span className="stat-icon">📄</span>
                            <div className="stat-info">
                                <span className="stat-number">9</span>
                                <span className="stat-label">Study Materials</span>
                            </div>
                        </div>
                        <div className="stat-card card">
                            <span className="stat-icon">👁</span>
                            <div className="stat-info">
                                <span className="stat-number">1,234</span>
                                <span className="stat-label">Total Views</span>
                            </div>
                        </div>
                        <div className="stat-card card">
                            <span className="stat-icon">⬇️</span>
                            <div className="stat-info">
                                <span className="stat-number">567</span>
                                <span className="stat-label">Downloads</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="admin-tabs">
                        <button
                            className={`admin-tab ${activeTab === 'videos' ? 'active' : ''}`}
                            onClick={() => setActiveTab('videos')}
                        >
                            🎬 Upload Video
                        </button>
                        <button
                            className={`admin-tab ${activeTab === 'materials' ? 'active' : ''}`}
                            onClick={() => setActiveTab('materials')}
                        >
                            📄 Upload Material
                        </button>
                    </div>

                    {/* Upload Forms */}
                    <div className="upload-section card">
                        {activeTab === 'videos' ? (
                            <form className="upload-form">
                                <h3>Upload New Video</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Video Title *</label>
                                        <input type="text" placeholder="Enter video title" />
                                    </div>
                                    <div className="form-group">
                                        <label>Subject/Category *</label>
                                        <select>
                                            <option value="">Select category</option>
                                            <option>Data Structures</option>
                                            <option>Programming</option>
                                            <option>DBMS</option>
                                            <option>Algorithms</option>
                                            <option>Operating Systems</option>
                                            <option>Networking</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea placeholder="Enter video description" rows="3"></textarea>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>YouTube Video ID *</label>
                                        <input type="text" placeholder="e.g., dQw4w9WgXcQ" />
                                    </div>
                                    <div className="form-group">
                                        <label>Thumbnail URL</label>
                                        <input type="url" placeholder="https://example.com/thumbnail.jpg" />
                                    </div>
                                </div>
                                <div className="upload-actions">
                                    <button type="submit" className="btn btn-primary">
                                        ➕ Add Video
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form className="upload-form">
                                <h3>Upload New Material</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Material Title *</label>
                                        <input type="text" placeholder="Enter material title" />
                                    </div>
                                    <div className="form-group">
                                        <label>Category *</label>
                                        <select>
                                            <option value="">Select category</option>
                                            <option>Data Structures</option>
                                            <option>Programming</option>
                                            <option>DBMS</option>
                                            <option>Algorithms</option>
                                            <option>Operating Systems</option>
                                            <option>Networking</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>File Type *</label>
                                        <select>
                                            <option value="">Select type</option>
                                            <option>PDF</option>
                                            <option>PPT</option>
                                            <option>DOC</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>File Upload *</label>
                                        <input type="file" accept=".pdf,.ppt,.pptx,.doc,.docx" />
                                    </div>
                                </div>
                                <div className="upload-actions">
                                    <button type="submit" className="btn btn-primary">
                                        ➕ Upload Material
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Admin;
