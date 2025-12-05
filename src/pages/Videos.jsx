import { useState } from 'react';
import './Videos.css';

// Mock data for videos
const videosData = [
    { id: 1, title: 'Introduction to Data Structures', subject: 'Data Structures', description: 'Learn the fundamentals of data structures including arrays, linked lists, and their applications.', thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop', duration: '45:30', youtubeId: 'dQw4w9WgXcQ' },
    { id: 2, title: 'Object Oriented Programming Basics', subject: 'Programming', description: 'Understanding OOP concepts like classes, objects, inheritance, and polymorphism.', thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop', duration: '38:15', youtubeId: 'dQw4w9WgXcQ' },
    { id: 3, title: 'Database Management Systems', subject: 'DBMS', description: 'Comprehensive overview of database concepts, SQL, and normalization techniques.', thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=225&fit=crop', duration: '52:00', youtubeId: 'dQw4w9WgXcQ' },
    { id: 4, title: 'Algorithm Analysis', subject: 'Algorithms', description: 'Learn how to analyze algorithm complexity and optimize your code for better performance.', thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=225&fit=crop', duration: '41:20', youtubeId: 'dQw4w9WgXcQ' },
    { id: 5, title: 'Operating Systems Concepts', subject: 'Operating Systems', description: 'Understanding process management, memory management, and file systems.', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=225&fit=crop', duration: '55:45', youtubeId: 'dQw4w9WgXcQ' },
    { id: 6, title: 'Computer Networks Fundamentals', subject: 'Networking', description: 'Learn about OSI model, TCP/IP, routing, and network security basics.', thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=225&fit=crop', duration: '48:30', youtubeId: 'dQw4w9WgXcQ' },
];

const subjects = ['All', 'Data Structures', 'Programming', 'DBMS', 'Algorithms', 'Operating Systems', 'Networking'];

const Videos = () => {
    const [selectedSubject, setSelectedSubject] = useState('All');
    const [selectedVideo, setSelectedVideo] = useState(null);

    const filteredVideos = selectedSubject === 'All'
        ? videosData
        : videosData.filter(v => v.subject === selectedSubject);

    const openVideoModal = (video) => {
        setSelectedVideo(video);
    };

    const closeVideoModal = () => {
        setSelectedVideo(null);
    };

    return (
        <div className="videos-page page-content">
            {/* Page Header */}
            <section className="page-header">
                <div className="container">
                    <h1>Video Lectures</h1>
                    <p>Explore our collection of comprehensive video tutorials and lectures</p>
                </div>
            </section>

            {/* Filter Section */}
            <section className="filter-section">
                <div className="container">
                    <div className="filter-tabs">
                        {subjects.map((subject) => (
                            <button
                                key={subject}
                                className={`filter-tab ${selectedSubject === subject ? 'active' : ''}`}
                                onClick={() => setSelectedSubject(subject)}
                            >
                                {subject}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Videos Grid */}
            <section className="section">
                <div className="container">
                    <div className="videos-grid-page">
                        {filteredVideos.map((video) => (
                            <div key={video.id} className="video-card-full card" onClick={() => openVideoModal(video)}>
                                <div className="video-thumbnail">
                                    <img src={video.thumbnail} alt={video.title} />
                                    <div className="video-overlay">
                                        <button className="play-btn">▶</button>
                                    </div>
                                    <span className="video-duration">{video.duration}</span>
                                </div>
                                <div className="video-details">
                                    <span className="video-subject">{video.subject}</span>
                                    <h3 className="video-title">{video.title}</h3>
                                    <p className="video-description">{video.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredVideos.length === 0 && (
                        <div className="no-results">
                            <p>No videos found in this category.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Video Modal */}
            {selectedVideo && (
                <div className="video-modal" onClick={closeVideoModal}>
                    <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeVideoModal}>✕</button>
                        <div className="video-player">
                            <iframe
                                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                                title={selectedVideo.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div className="modal-info">
                            <h2>{selectedVideo.title}</h2>
                            <span className="modal-subject">{selectedVideo.subject}</span>
                            <p>{selectedVideo.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Videos;
