import { useState, useEffect, useCallback } from 'react';
import './Materials.css';
import { materialsAPI } from '../api';

const categories = ['All', 'Data Structures', 'Programming', 'DBMS', 'Algorithms', 'Operating Systems', 'Networking'];
const _fileTypes = ['All', 'PDF', 'PPT', 'DOC'];

const Materials = () => {
    const [materialsData, setMaterialsData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedType, _setSelectedType] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch materials from backend
    const fetchMaterials = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await materialsAPI.getAll(selectedCategory, selectedType);
            if (response.success && Array.isArray(response.data)) {
                setMaterialsData(response.data);
            } else {
                setMaterialsData([]);
            }
        } catch (err) {
            console.error('Error fetching materials:', err);
            setError('Failed to load materials.');
            setMaterialsData([]);
        } finally {
            setLoading(false);
        }
    }, [selectedCategory, selectedType]);

    useEffect(() => {
        fetchMaterials();
    }, [fetchMaterials]);

    // Handle Download
    const handleDownload = async (material) => {
        try {
            const url = await materialsAPI.getDownloadUrl(material._id);
            if (url) window.open(url, '_blank');
            else alert('Download link not available');
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to get download link');
        }
    };

    // Handle Preview
    const handlePreview = async (material) => {
        if (material.type === 'PDF') {
            try {
                const url = await materialsAPI.getDownloadUrl(material._id);
                if (url) window.open(url, '_blank');
                else alert('Preview link not available');
            } catch (error) {
                console.error('Preview error:', error);
                alert('Failed to get preview link');
            }
        } else {
            alert('Preview is only available for PDF files.');
        }
    };

    return (
        <div className="materials-page page-content">
            <section className="page-header">
                <div className="container">
                    <h1>Study Materials</h1>
                    <p>Download comprehensive study materials</p>
                </div>
            </section>

            <section className="filter-section">
                <div className="container">
                    <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setSelectedCategory(cat)}
                                style={{ padding: '5px 10px', fontSize: '0.9rem' }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p className="error">{error}</p>
                    ) : (
                        <div className="materials-list" style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                            {materialsData.map((material) => (
                                <div key={material._id} className="card" style={{ padding: '20px' }}>
                                    <h3>{material.title}</h3>
                                    <p><strong>Type:</strong> {material.type} | <strong>Size:</strong> {material.size}</p>
                                    <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                                        <button className="btn btn-outline" onClick={() => handlePreview(material)}>Preview</button>
                                        <button className="btn btn-primary" onClick={() => handleDownload(material)}>Download</button>
                                    </div>
                                </div>
                            ))}
                            {materialsData.length === 0 && <p>No materials found.</p>}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Materials;
