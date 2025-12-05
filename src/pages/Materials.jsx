import { useState } from 'react';
import './Materials.css';

// Mock data for materials
const materialsData = [
    { id: 1, title: 'Data Structures Complete Notes', type: 'PDF', category: 'Data Structures', size: '2.5 MB', icon: '📄', color: '#e74c3c' },
    { id: 2, title: 'OOP Concepts Presentation', type: 'PPT', category: 'Programming', size: '5.1 MB', icon: '📊', color: '#e67e22' },
    { id: 3, title: 'DBMS Lab Manual', type: 'PDF', category: 'DBMS', size: '3.2 MB', icon: '📄', color: '#e74c3c' },
    { id: 4, title: 'Algorithm Design Handbook', type: 'PDF', category: 'Algorithms', size: '4.8 MB', icon: '📄', color: '#e74c3c' },
    { id: 5, title: 'OS Process Management Slides', type: 'PPT', category: 'Operating Systems', size: '6.3 MB', icon: '📊', color: '#e67e22' },
    { id: 6, title: 'Network Protocols Reference', type: 'DOC', category: 'Networking', size: '1.8 MB', icon: '📝', color: '#3498db' },
    { id: 7, title: 'SQL Practice Questions', type: 'PDF', category: 'DBMS', size: '1.2 MB', icon: '📄', color: '#e74c3c' },
    { id: 8, title: 'Linked List Implementation Guide', type: 'PDF', category: 'Data Structures', size: '2.1 MB', icon: '📄', color: '#e74c3c' },
    { id: 9, title: 'Java Programming Basics', type: 'PPT', category: 'Programming', size: '4.5 MB', icon: '📊', color: '#e67e22' },
];

const categories = ['All', 'Data Structures', 'Programming', 'DBMS', 'Algorithms', 'Operating Systems', 'Networking'];
const fileTypes = ['All', 'PDF', 'PPT', 'DOC'];

const Materials = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedType, setSelectedType] = useState('All');

    const filteredMaterials = materialsData.filter(m => {
        const categoryMatch = selectedCategory === 'All' || m.category === selectedCategory;
        const typeMatch = selectedType === 'All' || m.type === selectedType;
        return categoryMatch && typeMatch;
    });

    return (
        <div className="materials-page page-content">
            {/* Page Header */}
            <section className="page-header">
                <div className="container">
                    <h1>Study Materials</h1>
                    <p>Download comprehensive study materials, notes, and presentations</p>
                </div>
            </section>

            {/* Filter Section */}
            <section className="filter-section">
                <div className="container">
                    <div className="filters-wrapper">
                        <div className="filter-group">
                            <label>Category:</label>
                            <div className="filter-tabs">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        className={`filter-tab ${selectedCategory === cat ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(cat)}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="filter-group filter-type">
                            <label>Type:</label>
                            <div className="filter-tabs">
                                {fileTypes.map((type) => (
                                    <button
                                        key={type}
                                        className={`filter-tab ${selectedType === type ? 'active' : ''}`}
                                        onClick={() => setSelectedType(type)}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Materials List */}
            <section className="section">
                <div className="container">
                    <div className="materials-list">
                        {filteredMaterials.map((material) => (
                            <div key={material.id} className="material-item card">
                                <div className="material-icon-wrapper" style={{ background: `${material.color}15` }}>
                                    <span className="material-type-icon" style={{ color: material.color }}>
                                        {material.icon}
                                    </span>
                                </div>
                                <div className="material-content">
                                    <div className="material-main">
                                        <h3 className="material-title">{material.title}</h3>
                                        <div className="material-meta">
                                            <span className="material-category">{material.category}</span>
                                            <span className="material-dot">•</span>
                                            <span className="material-type-label">{material.type}</span>
                                            <span className="material-dot">•</span>
                                            <span className="material-size">{material.size}</span>
                                        </div>
                                    </div>
                                    <div className="material-actions">
                                        <button className="btn btn-outline material-action-btn">
                                            👁 Preview
                                        </button>
                                        <button className="btn btn-primary material-action-btn">
                                            ⬇ Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredMaterials.length === 0 && (
                        <div className="no-results">
                            <p>No materials found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Materials;
