import { useState, useEffect } from 'react';
import './Admin.css';
import { authAPI, videosAPI, materialsAPI, contactAPI, statsAPI, profileAPI, contentAPI, getToken, uploadImage } from '../api';

const Admin = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    // Dashboard Data State
    const [_loading, setLoading] = useState(false);
    const [stats, setStats] = useState(null);
    const [videos, setVideos] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [messages, setMessages] = useState([]);
    const [_profile, setProfile] = useState(null);

    // Additional state for editing
    const [editingVideo, setEditingVideo] = useState(null);
    const [editingMaterial, setEditingMaterial] = useState(null);

    const [videoForm, setVideoForm] = useState({
        title: '', subject: '', description: '', youtubeId: '', thumbnail: '', thumbnailStoragePath: '', duration: ''
    });
    const [materialForm, setMaterialForm] = useState({
        title: '', category: '', file: null
    });


    const [profileForm, setProfileForm] = useState({
        name: '', title: '', department: '', email: '', phone: '', location: '', about: '', experience: '', education: '', image: '',
        academicBackground: [],
        teachingInterests: [],
        social: { linkedin: '', scholar: '', researchgate: '' },
        identifiers: { orcid: '', researcherId: '', scopus: '', elsevier: '', googleScholar: '', ieee: '', acm: '', patent: '', employee: '', vidwan: '', researchGate: '', semanticScholar: '', academia: '', github: '', linkedin: '' },
        contributionTitle: '',
        contributionText: '',
        contributionStats: { lectures: '', materials: '', students: '', subjects: '' }
    });

    const [contentForm, setContentForm] = useState({
        hero: { badge: '', titleStart: '', titleEnd: '', subtitle: '', description: '', ctaPrimary: '', ctaSecondary: '', image: '', imageStoragePath: '' },
        mission: { title: '', text: '' },
        features: [],
        branding: { title: '', icon: '' }
    });
    const [formMessage, setFormMessage] = useState({ type: '', text: '' });

    // Image upload states
    const [heroImageFile, setHeroImageFile] = useState(null);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [videoThumbnailFile, setVideoThumbnailFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Check if already logged in
    useEffect(() => {
        const checkAuth = async () => {
            const token = getToken();
            if (token) {
                try {
                    await authAPI.verify();
                    setIsLoggedIn(true);
                    fetchDashboardData();
                } catch {
                    authAPI.logout();
                }
            }
        };
        checkAuth();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [statsRes, videosRes, materialsRes, messagesRes, profileRes, contentRes] = await Promise.all([
                statsAPI.getAdmin(),
                videosAPI.getAll(),
                materialsAPI.getAll(),
                contactAPI.getAll(),
                profileAPI.get(),
                contentAPI.get()
            ]);

            if (statsRes.success) setStats(statsRes.data);
            if (videosRes.success) setVideos(videosRes.data);
            if (materialsRes.success) setMaterials(materialsRes.data);
            if (messagesRes.success) setMessages(messagesRes.data);
            if (profileRes.success && profileRes.data) {
                setProfile(profileRes.data);
                setProfileForm(profileRes.data);
            }
            if (contentRes.success) {
                setContentForm(prev => ({ ...prev, ...contentRes.data }));
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setLoginLoading(true);

        try {
            const response = await authAPI.login(loginData.email, loginData.password);
            if (response.success) {
                setIsLoggedIn(true);
                fetchDashboardData();
            }
        } catch (err) {
            setLoginError(err.message || 'Invalid credentials');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleLogout = () => {
        authAPI.logout();
        setIsLoggedIn(false);
        setLoginData({ email: '', password: '' });
        setStats(null);
    };

    const handleVideoSubmit = async (e) => {
        e.preventDefault();
        setFormMessage({ type: '', text: '' });
        setUploading(true);

        try {
            let updatedVideo = { ...videoForm };

            // Handle thumbnail upload if a new file is selected
            if (videoThumbnailFile) {
                const uploadResult = await uploadImage(videoThumbnailFile, 'video-thumbnails');
                if (uploadResult.success) {
                    updatedVideo.thumbnail = uploadResult.url;
                    updatedVideo.thumbnailStoragePath = uploadResult.storagePath;
                } else {
                    throw new Error('Failed to upload thumbnail');
                }
            }

            let response;
            if (editingVideo) {
                response = await videosAPI.update(editingVideo.id || editingVideo._id, updatedVideo);
            } else {
                response = await videosAPI.create(updatedVideo);
            }

            if (response.success) {
                setFormMessage({ type: 'success', text: editingVideo ? 'Video updated successfully!' : 'Video added successfully!' });
                setVideoForm({ title: '', subject: '', description: '', youtubeId: '', thumbnail: '', thumbnailStoragePath: '', duration: '' });
                setVideoThumbnailFile(null);
                // Clear file input
                const fileInput = document.getElementById('video-thumbnail-file');
                if (fileInput) fileInput.value = '';
                setEditingVideo(null);
                fetchDashboardData();
            }
        } catch (err) {
            setFormMessage({ type: 'error', text: err.message || 'Failed to save video' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setUploading(false);
        }
    };

    const handleEditVideo = (video) => {
        setEditingVideo(video);
        setVideoForm({
            title: video.title,
            subject: video.subject,
            description: video.description || '',
            youtubeId: video.youtubeId,
            thumbnail: video.thumbnail || '',
            thumbnailStoragePath: video.thumbnailStoragePath || '',
            duration: video.duration || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelVideoEdit = () => {
        setEditingVideo(null);
        setVideoForm({ title: '', subject: '', description: '', youtubeId: '', thumbnail: '', thumbnailStoragePath: '', duration: '' });
        setVideoThumbnailFile(null);
    };

    const handleMaterialSubmit = async (e) => {
        e.preventDefault();
        setFormMessage({ type: '', text: '' });

        if (!editingMaterial && !materialForm.file) {
            setFormMessage({ type: 'error', text: 'Please select a file' });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', materialForm.title);
            formData.append('category', materialForm.category);
            if (materialForm.file) {
                formData.append('file', materialForm.file);
            }

            let response;
            if (editingMaterial) {
                response = await materialsAPI.update(editingMaterial.id || editingMaterial._id, formData);
            } else {
                response = await materialsAPI.create(formData);
            }

            if (response.success) {
                setFormMessage({ type: 'success', text: editingMaterial ? 'Material updated successfully!' : 'Material uploaded successfully!' });
                setMaterialForm({ title: '', category: '', file: null });
                const fileInput = document.getElementById('material-file');
                if (fileInput) fileInput.value = '';
                setEditingMaterial(null);
                fetchDashboardData();
            }
        } catch (err) {
            setFormMessage({ type: 'error', text: err.message || 'Failed to save material' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleEditMaterial = (material) => {
        setEditingMaterial(material);
        setMaterialForm({
            title: material.title,
            category: material.category,
            file: null // File cannot be pre-filled
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelMaterialEdit = () => {
        setEditingMaterial(null);
        setMaterialForm({ title: '', category: '', file: null });
        const fileInput = document.getElementById('material-file');
        if (fileInput) fileInput.value = '';
    };

    const handleDeleteVideo = async (id) => {
        if (!window.confirm('Are you sure you want to delete this video?')) return;
        try {
            await videosAPI.delete(id);
            fetchDashboardData();
        } catch (err) {
            alert('Failed to delete video: ' + err.message);
        }
    };

    const handleDeleteMaterial = async (id) => {
        if (!window.confirm('Are you sure you want to delete this material?')) return;
        try {
            await materialsAPI.delete(id);
            fetchDashboardData();
        } catch (err) {
            alert('Failed to delete material: ' + err.message);
        }
    };

    const handleDeleteMessage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        try {
            await contactAPI.delete(id);
            fetchDashboardData();
        } catch (err) {
            alert('Failed to delete message: ' + err.message);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await contactAPI.markAsRead(id);
            fetchDashboardData();
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setFormMessage({ type: '', text: '' });
        setUploading(true);

        try {
            let updatedProfile = { ...profileForm };

            // Upload profile image if selected
            if (profileImageFile) {
                const imageUrl = await uploadImage(profileImageFile, 'profile-images');
                updatedProfile.profileImage = imageUrl;
            }

            console.log('Updating profile with:', updatedProfile);
            const response = await profileAPI.update(updatedProfile);
            console.log('Profile update response:', response);
            
            if (response.success) {
                setFormMessage({ type: 'success', text: 'Profile updated successfully!' });
                setProfile(response.data);
                setProfileImageFile(null);
                // Clear file input
                const fileInput = document.getElementById('profile-image-file');
                if (fileInput) fileInput.value = '';
                fetchDashboardData();
            } else {
                throw new Error(response.message || 'Failed to update profile');
            }
        } catch (err) {
            console.error('Profile update error:', err);
            const errorMsg = err.message || 'Failed to update profile';
            setFormMessage({ type: 'error', text: `Error: ${errorMsg}` });
        } finally {
            setUploading(false);
        }
    };

    const handleContentUpdate = async (e) => {
        e.preventDefault();
        setFormMessage({ type: '', text: '' });
        setUploading(true);

        try {
            let updatedContent = { ...contentForm };

            // Upload hero image if selected
            if (heroImageFile) {
                const imageUrl = await uploadImage(heroImageFile, 'hero-images');
                updatedContent.heroImage = imageUrl;
            }

            console.log('Updating content with:', updatedContent);
            const response = await contentAPI.update(updatedContent);
            console.log('Content update response:', response);
            
            if (response.success) {
                setFormMessage({ type: 'success', text: 'Site content updated successfully!' });
                setHeroImageFile(null);
                // Clear file input
                const fileInput = document.getElementById('hero-image-file');
                if (fileInput) fileInput.value = '';
                fetchDashboardData();
            } else {
                throw new Error(response.message || 'Failed to update content');
            }
        } catch (err) {
            console.error('Content update error:', err);
            const errorMsg = err.message || 'Failed to update content';
            setFormMessage({ type: 'error', text: `Error: ${errorMsg}` });
        } finally {
            setUploading(false);
        }
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
                            {loginError && (
                                <div className="login-error">
                                    {loginError}
                                </div>
                            )}
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                    placeholder="admin@university.edu"
                                    required
                                    disabled={loginLoading}
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
                                    disabled={loginLoading}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-login" disabled={loginLoading}>
                                {loginLoading ? '⏳ Signing In...' : 'Sign In'}
                            </button>
                        </form>
                        <p className="login-hint">
                            Default: admin@university.edu / admin123
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
                            <h1>Admin Dashboard <span style={{ fontSize: '0.5em', background: '#333', color: '#fff', padding: '2px 6px', borderRadius: '4px', verticalAlign: 'middle' }}>v1.1</span></h1>
                            <p>Manage your videos, materials, and messages</p>
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
                                <span className="stat-number">{stats?.counts?.videos || 0}</span>
                                <span className="stat-label">Total Videos</span>
                            </div>
                        </div>
                        <div className="stat-card card">
                            <span className="stat-icon">📄</span>
                            <div className="stat-info">
                                <span className="stat-number">{stats?.counts?.materials || 0}</span>
                                <span className="stat-label">Study Materials</span>
                            </div>
                        </div>

                        <div className="stat-card card">
                            <span className="stat-icon">📨</span>
                            <div className="stat-info">
                                <span className="stat-number">{stats?.counts?.unreadMessages || 0}</span>
                                <span className="stat-label">Unread Messages</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="admin-tabs">
                        <button
                            className={`admin-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            📊 Dashboard
                        </button>
                        <button
                            className={`admin-tab ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            👤 Profile
                        </button>
                        <button
                            className={`admin-tab ${activeTab === 'videos' ? 'active' : ''}`}
                            onClick={() => setActiveTab('videos')}
                        >
                            🎬 Videos
                        </button>
                        <button
                            className={`admin-tab ${activeTab === 'materials' ? 'active' : ''}`}
                            onClick={() => setActiveTab('materials')}
                        >
                            📄 Materials
                        </button>
                        <button
                            className={`admin-tab ${activeTab === 'messages' ? 'active' : ''}`}
                            onClick={() => setActiveTab('messages')}
                        >
                            📨 Messages {stats?.counts?.unreadMessages > 0 && (
                                <span className="badge">{stats.counts.unreadMessages}</span>
                            )}
                        </button>
                        <button
                            className={`admin-tab ${activeTab === 'content' ? 'active' : ''}`}
                            onClick={() => setActiveTab('content')}
                        >
                            📝 Site Content
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'dashboard' && (
                        <div className="dashboard-content">
                            <div className="dashboard-grid">
                                <div className="dashboard-section card">
                                    <h3>Recent Videos</h3>
                                    {videos.slice(0, 5).map(video => (
                                        <div key={video._id} className="dashboard-item">
                                            <span>{video.title}</span>
                                            <span className="item-meta">{video.subject}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="dashboard-section card">
                                    <h3>Recent Messages</h3>
                                    {messages.slice(0, 5).map(msg => (
                                        <div key={msg._id} className={`dashboard-item ${!msg.isRead ? 'unread' : ''}`}>
                                            <span>{msg.name}</span>
                                            <span className="item-meta">{msg.subject || 'No Subject'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="upload-section card">
                            <form className="upload-form" onSubmit={handleProfileUpdate}>
                                <h3>Update Profile Information</h3>
                                {formMessage.text && (
                                    <div className={`form-message ${formMessage.type}`}>
                                        {formMessage.text}
                                    </div>
                                )}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            value={profileForm.name}
                                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Academic Title</label>
                                        <input
                                            type="text"
                                            value={profileForm.title}
                                            onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                                            placeholder="e.g. Assistant Professor"
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Department</label>
                                        <input
                                            type="text"
                                            value={profileForm.department}
                                            onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Education</label>
                                        <input
                                            type="text"
                                            value={profileForm.education}
                                            onChange={(e) => setProfileForm({ ...profileForm, education: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            value={profileForm.email}
                                            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone</label>
                                        <input
                                            type="text"
                                            value={profileForm.phone}
                                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Office Location</label>
                                        <input
                                            type="text"
                                            value={profileForm.location}
                                            onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Experience</label>
                                        <input
                                            type="text"
                                            value={profileForm.experience}
                                            onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Profile Image</label>
                                    <input
                                        type="file"
                                        id="profile-image-file"
                                        accept="image/*"
                                        onChange={(e) => setProfileImageFile(e.target.files[0])}
                                    />
                                    {profileImageFile && (
                                        <div className="image-preview" style={{ marginTop: '1rem' }}>
                                            <p>New image selected: {profileImageFile.name}</p>
                                            <img
                                                src={URL.createObjectURL(profileImageFile)}
                                                alt="Preview"
                                                style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', marginTop: '0.5rem' }}
                                            />
                                        </div>
                                    )}
                                    {profileForm.image && !profileImageFile && (
                                        <div className="current-image" style={{ marginTop: '1rem' }}>
                                            <p>Current profile image:</p>
                                            <img
                                                src={profileForm.image}
                                                alt="Current profile"
                                                style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', marginTop: '0.5rem' }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <h4 className="form-section-title">Social Links</h4>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>LinkedIn URL</label>
                                        <input
                                            type="text"
                                            value={profileForm.social?.linkedin || ''}
                                            onChange={(e) => setProfileForm({
                                                ...profileForm,
                                                social: { ...profileForm.social, linkedin: e.target.value }
                                            })}
                                            placeholder="https://linkedin.com/in/..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Google Scholar URL</label>
                                        <input
                                            type="text"
                                            value={profileForm.social?.scholar || ''}
                                            onChange={(e) => setProfileForm({
                                                ...profileForm,
                                                social: { ...profileForm.social, scholar: e.target.value }
                                            })}
                                            placeholder="https://scholar.google.com/..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>ResearchGate URL</label>
                                        <input
                                            type="text"
                                            value={profileForm.social?.researchgate || ''}
                                            onChange={(e) => setProfileForm({
                                                ...profileForm,
                                                social: { ...profileForm.social, researchgate: e.target.value }
                                            })}
                                            placeholder="https://researchgate.net/..."
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>About Description</label>
                                    <textarea
                                        rows="5"
                                        value={profileForm.about}
                                        onChange={(e) => setProfileForm({ ...profileForm, about: e.target.value })}
                                    ></textarea>
                                </div>

                                <h4 className="form-section-title">Academic Identifiers</h4>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>ORCID iD</label>
                                        <input
                                            type="text"
                                            value={profileForm.identifiers?.orcid || ''}
                                            onChange={(e) => setProfileForm({
                                                ...profileForm,
                                                identifiers: { ...profileForm.identifiers, orcid: e.target.value }
                                            })}
                                            placeholder="0000-0000-..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>ResearcherID (Web of Science)</label>
                                        <input
                                            type="text"
                                            value={profileForm.identifiers?.researcherId || ''}
                                            onChange={(e) => setProfileForm({
                                                ...profileForm,
                                                identifiers: { ...profileForm.identifiers, researcherId: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Scopus ID</label>
                                        <input
                                            type="text"
                                            value={profileForm.identifiers?.scopus || ''}
                                            onChange={(e) => setProfileForm({
                                                ...profileForm,
                                                identifiers: { ...profileForm.identifiers, scopus: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Elsevier ID</label>
                                        <input
                                            type="text"
                                            value={profileForm.identifiers?.elsevier || ''}
                                            onChange={(e) => setProfileForm({
                                                ...profileForm,
                                                identifiers: { ...profileForm.identifiers, elsevier: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Google Scholar URL</label>
                                        <input
                                            type="text"
                                            value={profileForm.identifiers?.googleScholar || ''}
                                            onChange={(e) => setProfileForm({
                                                ...profileForm,
                                                identifiers: { ...profileForm.identifiers, googleScholar: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>VIDWAN ID</label>
                                        <input
                                            type="text"
                                            value={profileForm.identifiers?.vidwan || ''}
                                            onChange={(e) => setProfileForm({
                                                ...profileForm,
                                                identifiers: { ...profileForm.identifiers, vidwan: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>IEEE Membership ID</label>
                                        <input
                                            type="text"
                                            value={profileForm.identifiers?.ieee || ''}
                                            onChange={(e) => setProfileForm({
                                                ...profileForm,
                                                identifiers: { ...profileForm.identifiers, ieee: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>ACM Membership ID</label>
                                        <input
                                            type="text"
                                            value={profileForm.identifiers?.acm || ''}
                                            onChange={(e) => setProfileForm({
                                                ...profileForm,
                                                identifiers: { ...profileForm.identifiers, acm: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Patent ID</label>
                                        <input
                                            type="text"
                                            value={profileForm.identifiers?.patent || ''}
                                            onChange={(e) => setProfileForm({
                                                ...profileForm,
                                                identifiers: { ...profileForm.identifiers, patent: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Employee ID</label>
                                        <input
                                            type="text"
                                            value={profileForm.identifiers?.employee || ''}
                                            onChange={(e) => setProfileForm({
                                                ...profileForm,
                                                identifiers: { ...profileForm.identifiers, employee: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>GitHub URL</label>
                                        <input
                                            type="text"
                                            value={profileForm.identifiers?.github || ''}
                                            onChange={(e) => setProfileForm({
                                                ...profileForm,
                                                identifiers: { ...profileForm.identifiers, github: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>LinkedIn URL</label>
                                        <input
                                            type="text"
                                            value={profileForm.identifiers?.linkedin || ''}
                                            onChange={(e) => setProfileForm({
                                                ...profileForm,
                                                identifiers: { ...profileForm.identifiers, linkedin: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Google Scholar URL</label>
                                        <input
                                            type="text"
                                            value={profileForm.identifiers?.googleScholar || ''}
                                            onChange={(e) => setProfileForm({
                                                ...profileForm,
                                                identifiers: { ...profileForm.identifiers, googleScholar: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>ResearchGate URL</label>
                                        <input
                                            type="text"
                                            value={profileForm.identifiers?.researchGate || ''}
                                            onChange={(e) => setProfileForm({
                                                ...profileForm,
                                                identifiers: { ...profileForm.identifiers, researchGate: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Semantic Scholar URL</label>
                                        <input
                                            type="text"
                                            value={profileForm.identifiers?.semanticScholar || ''}
                                            onChange={(e) => setProfileForm({
                                                ...profileForm,
                                                identifiers: { ...profileForm.identifiers, semanticScholar: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Academia.edu URL</label>
                                        <input
                                            type="text"
                                            value={profileForm.identifiers?.academia || ''}
                                            onChange={(e) => setProfileForm({
                                                ...profileForm,
                                                identifiers: { ...profileForm.identifiers, academia: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>


                                <h4 className="form-section-title">E-Content Contributions</h4>
                                <div className="form-group">
                                    <label>Section Title</label>
                                    <input
                                        type="text"
                                        value={profileForm.contributionTitle || ''}
                                        onChange={(e) => setProfileForm({ ...profileForm, contributionTitle: e.target.value })}
                                        placeholder="Contributions to E-Content Development"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Introduction Text</label>
                                    <textarea
                                        rows="3"
                                        value={profileForm.contributionText || ''}
                                        onChange={(e) => setProfileForm({ ...profileForm, contributionText: e.target.value })}
                                    ></textarea>
                                </div>

                                <h4 className="form-section-title">Contribution Stats</h4>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Video Lectures</label>
                                        <input
                                            type="text"
                                            value={profileForm.contributionStats?.lectures || ''}
                                            onChange={(e) => setProfileForm({
                                                ...profileForm,
                                                contributionStats: { ...profileForm.contributionStats, lectures: e.target.value }
                                            })}
                                            placeholder="e.g. 50+"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Study Materials</label>
                                        <input
                                            type="text"
                                            value={profileForm.contributionStats?.materials || ''}
                                            onChange={(e) => setProfileForm({
                                                ...profileForm,
                                                contributionStats: { ...profileForm.contributionStats, materials: e.target.value }
                                            })}
                                            placeholder="e.g. 100+"
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Students Impacted</label>
                                        <input
                                            type="text"
                                            value={profileForm.contributionStats?.students || ''}
                                            onChange={(e) => setProfileForm({
                                                ...profileForm,
                                                contributionStats: { ...profileForm.contributionStats, students: e.target.value }
                                            })}
                                            placeholder="e.g. 1000+"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Subjects Covered</label>
                                        <input
                                            type="text"
                                            value={profileForm.contributionStats?.subjects || ''}
                                            onChange={(e) => setProfileForm({
                                                ...profileForm,
                                                contributionStats: { ...profileForm.contributionStats, subjects: e.target.value }
                                            })}
                                            placeholder="e.g. 5+"
                                        />
                                    </div>
                                </div>

                                <h4 className="form-section-title">Academic Background (Timeline)</h4>
                                {profileForm.academicBackground?.map((item, index) => (
                                    <div key={index} className="array-item-card">
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Year Range</label>
                                                <input
                                                    type="text"
                                                    value={item.year}
                                                    onChange={(e) => {
                                                        const newBg = [...profileForm.academicBackground];
                                                        newBg[index].year = e.target.value;
                                                        setProfileForm({ ...profileForm, academicBackground: newBg });
                                                    }}
                                                    placeholder="e.g. 2020 - Present"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Role/Degree</label>
                                                <input
                                                    type="text"
                                                    value={item.role}
                                                    onChange={(e) => {
                                                        const newBg = [...profileForm.academicBackground];
                                                        newBg[index].role = e.target.value;
                                                        setProfileForm({ ...profileForm, academicBackground: newBg });
                                                    }}
                                                    placeholder="e.g. Associate Professor"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Institution</label>
                                            <input
                                                type="text"
                                                value={item.institution}
                                                onChange={(e) => {
                                                    const newBg = [...profileForm.academicBackground];
                                                    newBg[index].institution = e.target.value;
                                                    setProfileForm({ ...profileForm, academicBackground: newBg });
                                                }}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => {
                                                const newBg = profileForm.academicBackground.filter((_, i) => i !== index);
                                                setProfileForm({ ...profileForm, academicBackground: newBg });
                                            }}
                                        >
                                            Remove Item
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-outline btn-sm mb-4"
                                    onClick={() => setProfileForm({
                                        ...profileForm,
                                        academicBackground: [...(profileForm.academicBackground || []), { year: '', role: '', institution: '' }]
                                    })}
                                >
                                    + Add Timeline Item
                                </button>

                                <h4 className="form-section-title">Teaching Interests</h4>
                                {profileForm.teachingInterests?.map((item, index) => (
                                    <div key={index} className="array-item-card">
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Title</label>
                                                <input
                                                    type="text"
                                                    value={item.title}
                                                    onChange={(e) => {
                                                        const newInterests = [...profileForm.teachingInterests];
                                                        newInterests[index].title = e.target.value;
                                                        setProfileForm({ ...profileForm, teachingInterests: newInterests });
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Icon (Emoji)</label>
                                                <input
                                                    type="text"
                                                    value={item.icon}
                                                    onChange={(e) => {
                                                        const newInterests = [...profileForm.teachingInterests];
                                                        newInterests[index].icon = e.target.value;
                                                        setProfileForm({ ...profileForm, teachingInterests: newInterests });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Description</label>
                                            <input
                                                type="text"
                                                value={item.description}
                                                onChange={(e) => {
                                                    const newInterests = [...profileForm.teachingInterests];
                                                    newInterests[index].description = e.target.value;
                                                    setProfileForm({ ...profileForm, teachingInterests: newInterests });
                                                }}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => {
                                                const newInterests = profileForm.teachingInterests.filter((_, i) => i !== index);
                                                setProfileForm({ ...profileForm, teachingInterests: newInterests });
                                            }}
                                        >
                                            Remove Interest
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-outline btn-sm mb-4"
                                    onClick={() => setProfileForm({
                                        ...profileForm,
                                        teachingInterests: [...(profileForm.teachingInterests || []), { title: '', description: '', icon: '' }]
                                    })}
                                >
                                    + Add Interest
                                </button>
                                <div className="upload-actions">
                                    <button type="submit" className="btn btn-primary" disabled={uploading}>
                                        {uploading ? '💾 Saving...' : '💾 Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )
                    }

                    {
                        activeTab === 'videos' && (
                            <div className="upload-section card">
                                <form className="upload-form" onSubmit={handleVideoSubmit}>
                                    <h3>{editingVideo ? 'Edit Video' : 'Add New Video'}</h3>
                                    {formMessage.text && (
                                        <div className={`form-message ${formMessage.type}`}>
                                            {formMessage.text}
                                        </div>
                                    )}
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Video Title *</label>
                                            <input
                                                type="text"
                                                placeholder="Enter video title"
                                                value={videoForm.title}
                                                onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Subject/Category *</label>
                                            <select
                                                value={videoForm.subject}
                                                onChange={(e) => setVideoForm({ ...videoForm, subject: e.target.value })}
                                                required
                                            >
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
                                        <textarea
                                            placeholder="Enter video description"
                                            rows="3"
                                            value={videoForm.description}
                                            onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>YouTube Video ID *</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., dQw4w9WgXcQ"
                                                value={videoForm.youtubeId}
                                                onChange={(e) => setVideoForm({ ...videoForm, youtubeId: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Duration</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., 45:30"
                                                value={videoForm.duration}
                                                onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Video Thumbnail (Optional)</label>
                                        <input
                                            type="file"
                                            id="video-thumbnail-file"
                                            accept="image/*"
                                            onChange={(e) => setVideoThumbnailFile(e.target.files[0])}
                                            style={{ minHeight: '50px', display: 'flex', alignItems: 'center' }}
                                        />
                                        {videoThumbnailFile && (
                                            <div className="image-preview" style={{ marginTop: '1rem' }}>
                                                <p>New thumbnail selected: {videoThumbnailFile.name}</p>
                                                <img
                                                    src={URL.createObjectURL(videoThumbnailFile)}
                                                    alt="Preview"
                                                    style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '8px', marginTop: '0.5rem' }}
                                                />
                                            </div>
                                        )}
                                        {videoForm.thumbnail && !videoThumbnailFile && (
                                            <div className="current-image" style={{ marginTop: '1rem' }}>
                                                <p>Current thumbnail:</p>
                                                <img
                                                    src={videoForm.thumbnail}
                                                    alt="Current thumbnail"
                                                    style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '8px', marginTop: '0.5rem' }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="upload-actions">
                                        <button type="submit" className="btn btn-primary" disabled={uploading}>
                                            {uploading ? (editingVideo ? '💾 Updating...' : '➕ Adding...') : (editingVideo ? '💾 Update Video' : '➕ Add Video')}
                                        </button>
                                        {editingVideo && (
                                            <button type="button" className="btn btn-secondary" onClick={handleCancelVideoEdit}>
                                                ❌ Cancel Edit
                                            </button>
                                        )}
                                    </div>
                                </form>

                                {/* Video List */}
                                <div className="content-list">
                                    <h3>Manage Videos ({videos.length})</h3>
                                    {videos.map(video => (
                                        <div key={video.id || video._id} className="content-item">
                                            <div className="content-info">
                                                <strong>{video.title}</strong>
                                                <span>{video.subject} • {video.views} views</span>
                                            </div>
                                            <div className="video-actions">
                                                <button
                                                    className="btn btn-icon btn-edit"
                                                    onClick={() => handleEditVideo(video)}
                                                    title="Edit Video"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="btn btn-icon btn-delete"
                                                    onClick={() => handleDeleteVideo(video.id || video._id)}
                                                    title="Delete Video"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    }

                    {
                        activeTab === 'materials' && (
                            <div className="upload-section card">
                                <form className="upload-form" onSubmit={handleMaterialSubmit}>
                                    <h3>{editingMaterial ? 'Edit Material' : 'Upload Study Material'}</h3>
                                    {formMessage.text && (
                                        <div className={`form-message ${formMessage.type}`}>
                                            {formMessage.text}
                                        </div>
                                    )}
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Material Title *</label>
                                            <input
                                                type="text"
                                                placeholder="Enter material title"
                                                value={materialForm.title}
                                                onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Category *</label>
                                            <select
                                                value={materialForm.category}
                                                onChange={(e) => setMaterialForm({ ...materialForm, category: e.target.value })}
                                                required
                                            >
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
                                        <label>Upload File {editingMaterial && '(Leave empty to keep existing)'} *</label>
                                        <input
                                            type="file"
                                            id="material-file"
                                            accept=".pdf,.ppt,.pptx,.doc,.docx"
                                            onChange={(e) => setMaterialForm({ ...materialForm, file: e.target.files[0] })}
                                            required={!editingMaterial}
                                        />
                                    </div>
                                    <div className="upload-actions">
                                        <button type="submit" className="btn btn-primary">
                                            {editingMaterial ? '💾 Update Material' : '📤 Upload Material'}
                                        </button>
                                        {editingMaterial && (
                                            <button type="button" className="btn btn-secondary" onClick={handleCancelMaterialEdit}>
                                                ❌ Cancel Edit
                                            </button>
                                        )}
                                    </div>
                                </form>

                                {/* Materials List */}
                                <div className="content-list">
                                    <h3>Manage Materials ({materials.length})</h3>
                                    {materials.map(material => (
                                        <div key={material.id || material._id} className="content-item">
                                            <div className="content-info">
                                                <strong>{material.title}</strong>
                                                <span>{material.category} • {material.downloads} downloads</span>
                                            </div>
                                            <div className="material-actions">
                                                <button
                                                    className="btn btn-icon btn-edit"
                                                    onClick={() => handleEditMaterial(material)}
                                                    title="Edit Material"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="btn btn-icon btn-delete"
                                                    onClick={() => handleDeleteMaterial(material.id || material._id)}
                                                    title="Delete Material"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    }

                    {
                        activeTab === 'content' && (
                            <div className="upload-section card">
                                <form className="upload-form" onSubmit={handleContentUpdate}>
                                    <h3>Manage Site Content</h3>
                                    {formMessage.text && (
                                        <div className={`form-message ${formMessage.type}`}>
                                            {formMessage.text}
                                        </div>
                                    )}

                                    <div className="form-section-title">Site Branding</div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Site Title</label>
                                            <input
                                                type="text"
                                                value={contentForm.branding?.title || ''}
                                                onChange={(e) => setContentForm({
                                                    ...contentForm,
                                                    branding: { ...contentForm.branding, title: e.target.value }
                                                })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Logo Icon (Emoji)</label>
                                            <input
                                                type="text"
                                                value={contentForm.branding?.icon || ''}
                                                onChange={(e) => setContentForm({
                                                    ...contentForm,
                                                    branding: { ...contentForm.branding, icon: e.target.value }
                                                })}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-section-title">Home Hero Section</div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Badge Text</label>
                                            <input
                                                type="text"
                                                value={contentForm.hero?.badge || ''}
                                                onChange={(e) => setContentForm({
                                                    ...contentForm,
                                                    hero: { ...contentForm.hero, badge: e.target.value }
                                                })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Title Start (Gradient)</label>
                                            <input
                                                type="text"
                                                value={contentForm.hero?.titleStart || ''}
                                                onChange={(e) => setContentForm({
                                                    ...contentForm,
                                                    hero: { ...contentForm.hero, titleStart: e.target.value }
                                                })}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Title End</label>
                                        <input
                                            type="text"
                                            value={contentForm.hero?.titleEnd || ''}
                                            onChange={(e) => setContentForm({
                                                ...contentForm,
                                                hero: { ...contentForm.hero, titleEnd: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Subtitle</label>
                                        <input
                                            type="text"
                                            value={contentForm.hero?.subtitle || ''}
                                            onChange={(e) => setContentForm({
                                                ...contentForm,
                                                hero: { ...contentForm.hero, subtitle: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea
                                            rows="3"
                                            value={contentForm.hero?.description || ''}
                                            onChange={(e) => setContentForm({
                                                ...contentForm,
                                                hero: { ...contentForm.hero, description: e.target.value }
                                            })}
                                        ></textarea>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Primary Button Text</label>
                                            <input
                                                type="text"
                                                value={contentForm.hero?.ctaPrimary || ''}
                                                onChange={(e) => setContentForm({
                                                    ...contentForm,
                                                    hero: { ...contentForm.hero, ctaPrimary: e.target.value }
                                                })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Secondary Button Text</label>
                                            <input
                                                type="text"
                                                value={contentForm.hero?.ctaSecondary || ''}
                                                onChange={(e) => setContentForm({
                                                    ...contentForm,
                                                    hero: { ...contentForm.hero, ctaSecondary: e.target.value }
                                                })}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-section-title">Hero Image</div>
                                    <div className="form-group">
                                        <label>Upload Hero Image (shown on home page)</label>
                                        <input
                                            type="file"
                                            id="hero-image-file"
                                            accept="image/*"
                                            onChange={(e) => setHeroImageFile(e.target.files[0])}
                                        />
                                        {heroImageFile && (
                                            <div className="image-preview" style={{ marginTop: '1rem' }}>
                                                <p>New image selected: {heroImageFile.name}</p>
                                                <img
                                                    src={URL.createObjectURL(heroImageFile)}
                                                    alt="Preview"
                                                    style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '8px', marginTop: '0.5rem' }}
                                                />
                                            </div>
                                        )}
                                        {contentForm.hero?.image && !heroImageFile && (
                                            <div className="current-image" style={{ marginTop: '1rem' }}>
                                                <p>Current hero image:</p>
                                                <img
                                                    src={contentForm.hero.image}
                                                    alt="Current hero"
                                                    style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '8px', marginTop: '0.5rem' }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-section-title">Mission Section</div>
                                    <div className="form-group">
                                        <label>Mission Title</label>
                                        <input
                                            type="text"
                                            value={contentForm.mission?.title || ''}
                                            onChange={(e) => setContentForm({
                                                ...contentForm,
                                                mission: { ...contentForm.mission, title: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Mission Text</label>
                                        <textarea
                                            rows="4"
                                            value={contentForm.mission?.text || ''}
                                            onChange={(e) => setContentForm({
                                                ...contentForm,
                                                mission: { ...contentForm.mission, text: e.target.value }
                                            })}
                                        ></textarea>
                                    </div>

                                    <div className="form-section-title">Features List</div>
                                    {contentForm.features?.map((feature, index) => (
                                        <div key={index} className="array-item-card">
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Icon</label>
                                                    <input
                                                        type="text"
                                                        value={feature.icon}
                                                        onChange={(e) => {
                                                            const newFeatures = [...contentForm.features];
                                                            newFeatures[index].icon = e.target.value;
                                                            setContentForm({ ...contentForm, features: newFeatures });
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Title</label>
                                                    <input
                                                        type="text"
                                                        value={feature.title}
                                                        onChange={(e) => {
                                                            const newFeatures = [...contentForm.features];
                                                            newFeatures[index].title = e.target.value;
                                                            setContentForm({ ...contentForm, features: newFeatures });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Description</label>
                                                <input
                                                    type="text"
                                                    value={feature.desc}
                                                    onChange={(e) => {
                                                        const newFeatures = [...contentForm.features];
                                                        newFeatures[index].desc = e.target.value;
                                                        setContentForm({ ...contentForm, features: newFeatures });
                                                    }}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() => {
                                                    const newFeatures = contentForm.features.filter((_, i) => i !== index);
                                                    setContentForm({ ...contentForm, features: newFeatures });
                                                }}
                                            >
                                                Remove Feature
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="btn btn-outline btn-sm mb-4"
                                        onClick={() => setContentForm({
                                            ...contentForm,
                                            features: [...(contentForm.features || []), { icon: '✨', title: 'New Feature', desc: 'Description' }]
                                        })}
                                    >
                                        + Add Feature
                                    </button>

                                    <div className="upload-actions">
                                        <button type="submit" className="btn btn-primary" disabled={uploading}>
                                            {uploading ? '💾 Saving...' : '💾 Save Site Content'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )
                    }

                    {
                        activeTab === 'messages' && (
                            <div className="messages-section card">
                                <h3>Contact Messages ({messages.length})</h3>
                                {messages.length === 0 ? (
                                    <p className="no-messages">No messages yet.</p>
                                ) : (
                                    <div className="messages-list">
                                        {messages.map(msg => (
                                            <div key={msg._id} className={`message-item ${!msg.isRead ? 'unread' : ''}`}>
                                                <div className="message-header">
                                                    <div className="message-sender">
                                                        <strong>{msg.name}</strong>
                                                        <span>{msg.email}</span>
                                                    </div>
                                                    <div className="message-date">
                                                        {new Date(msg.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="message-subject">
                                                    <strong>Subject:</strong> {msg.subject || 'No Subject'}
                                                </div>
                                                <div className="message-body">
                                                    {msg.message}
                                                </div>
                                                <div className="message-actions">
                                                    {!msg.isRead && (
                                                        <button
                                                            className="btn btn-outline btn-sm"
                                                            onClick={() => handleMarkAsRead(msg._id)}
                                                        >
                                                            ✓ Mark as Read
                                                        </button>
                                                    )}
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDeleteMessage(msg._id)}
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    }
                </div>
            </section>
        </div>
    );
};

export default Admin;
