import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// Data file path
const DATA_FILE = path.join(__dirname, 'data.json');

// Initialize data file if it doesn't exist
const initializeData = () => {
    if (!fs.existsSync(DATA_FILE)) {
        const initialData = {
            users: [
                {
                    id: '1',
                    email: 'admin@university.edu',
                    password: bcrypt.hashSync('admin123', 12),
                    name: 'Madhankumar C'
                }
            ],
            videos: [
                { id: '1', title: 'Introduction to Data Structures', subject: 'Data Structures', description: 'Learn the fundamentals of data structures including arrays, linked lists, and their applications.', thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop', duration: '45:30', youtubeId: 'dQw4w9WgXcQ', views: 0 },
                { id: '2', title: 'Object Oriented Programming Basics', subject: 'Programming', description: 'Understanding OOP concepts like classes, objects, inheritance, and polymorphism.', thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop', duration: '38:15', youtubeId: 'dQw4w9WgXcQ', views: 0 },
                { id: '3', title: 'Database Management Systems', subject: 'DBMS', description: 'Comprehensive overview of database concepts, SQL, and normalization techniques.', thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=225&fit=crop', duration: '52:00', youtubeId: 'dQw4w9WgXcQ', views: 0 },
                { id: '4', title: 'Algorithm Analysis', subject: 'Algorithms', description: 'Learn how to analyze algorithm complexity and optimize your code for better performance.', thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=225&fit=crop', duration: '41:20', youtubeId: 'dQw4w9WgXcQ', views: 0 },
                { id: '5', title: 'Operating Systems Concepts', subject: 'Operating Systems', description: 'Understanding process management, memory management, and file systems.', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=225&fit=crop', duration: '55:45', youtubeId: 'dQw4w9WgXcQ', views: 0 },
                { id: '6', title: 'Computer Networks Fundamentals', subject: 'Networking', description: 'Learn about OSI model, TCP/IP, routing, and network security basics.', thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=225&fit=crop', duration: '48:30', youtubeId: 'dQw4w9WgXcQ', views: 0 }
            ],
            materials: [
                {
                    id: '1',
                    title: 'Data Structures Lecture Notes - Unit 1',
                    category: 'Data Structures',
                    type: 'PDF',
                    size: '2.4 MB',
                    originalName: 'DS_Unit1.pdf',
                    downloads: 12
                }
            ],
            contacts: [],
            profile: {
                name: 'Madhankumar C',
                title: 'Assistant Professor',
                department: 'Computer Science & Engineering',
                email: 'madhankumar@university.edu',
                phone: '+91 98765 43210',
                location: 'Room 304, CS Block',
                about: 'I am a passionate educator with over 10 years of experience in teaching Computer Science.',
                experience: '10+ Years',
                education: 'Ph.D. in Computer Science',
                image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop'
            }
        };
        fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
        console.log('✅ Data file created with default data');
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
};

// Save data helper
const saveData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Get data helper
const getData = () => {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
};

// Initialize data
let data = initializeData();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Configure multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Helper to format file size
const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const getFileType = (filename) => {
    const ext = path.extname(filename).toLowerCase();
    if (ext === '.pdf') return 'PDF';
    if (ext === '.ppt' || ext === '.pptx') return 'PPT';
    if (ext === '.doc' || ext === '.docx') return 'DOC';
    return 'Other';
};

// Protect Middleware
const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const data = getData();
        const user = data.users.find(u => u.id === decoded.id);

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};

// ==================== AUTH ROUTES ====================
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const data = getData();
    const user = data.users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: '30d'
    });

    res.json({
        success: true,
        data: {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        }
    });
});

app.get('/api/videos/:id', (req, res) => {
    const data = getData();
    const video = data.videos.find(v => v.id === req.params.id);
    if (!video) {
        return res.status(404).json({ success: false, message: 'Video not found' });
    }
    video.views = (video.views || 0) + 1;
    saveData(data);
    res.json({ success: true, data: { ...video, _id: video.id } });
});

app.post('/api/videos', protect, (req, res) => {
    const { title, subject, description, thumbnail, duration, youtubeId } = req.body;
    if (!title || !subject || !youtubeId) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const data = getData();
    const newVideo = {
        id: Date.now().toString(),
        title, subject, description,
        thumbnail: thumbnail || `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
        duration: duration || '00:00',
        youtubeId,
        views: 0
    };

    data.videos.push(newVideo);
    saveData(data);
    res.status(201).json({ success: true, data: { ...newVideo, _id: newVideo.id } });
});

app.put('/api/videos/:id', protect, (req, res) => {
    const { title, subject, description, thumbnail, duration, youtubeId } = req.body;
    const data = getData();
    const video = data.videos.find(v => v.id === req.params.id);

    if (!video) {
        return res.status(404).json({ success: false, message: 'Video not found' });
    }

    if (title) video.title = title;
    if (subject) video.subject = subject;
    if (description) video.description = description;
    if (thumbnail) video.thumbnail = thumbnail;
    if (duration) video.duration = duration;
    if (youtubeId) {
        video.youtubeId = youtubeId;
        if (!thumbnail) {
            video.thumbnail = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
        }
    }

    saveData(data);
    res.json({ success: true, data: { ...video, _id: video.id } });
});

app.delete('/api/videos/:id', protect, (req, res) => {
    const data = getData();
    const index = data.videos.findIndex(v => v.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Video not found' });
    }
    data.videos.splice(index, 1);
    saveData(data);
    res.json({ success: true, message: 'Video deleted' });
});

// ==================== MATERIALS ROUTES ====================
app.get('/api/materials', (req, res) => {
    const data = getData();
    let materials = data.materials;
    if (req.query.category && req.query.category !== 'All') {
        materials = materials.filter(m => m.category === req.query.category);
    }
    if (req.query.type && req.query.type !== 'All') {
        materials = materials.filter(m => m.type === req.query.type);
    }
    res.json({ success: true, count: materials.length, data: materials.map(m => ({ ...m, _id: m.id })) });
});

app.get('/api/materials/download/:id', (req, res) => {
    const data = getData();
    const material = data.materials.find(m => m.id === req.params.id);
    if (!material) {
        return res.status(404).json({ success: false, message: 'Material not found' });
    }
    const filePath = path.join(uploadsDir, material.filePath);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: 'File not found' });
    }
    material.downloads = (material.downloads || 0) + 1;
    saveData(data);
    res.download(filePath, material.originalName);
});

app.post('/api/materials', protect, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Please upload a file' });
    }
    const { title, category } = req.body;
    if (!title || !category) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const data = getData();
    const newMaterial = {
        id: Date.now().toString(),
        title,
        category,
        type: getFileType(req.file.originalname),
        size: formatFileSize(req.file.size),
        filePath: req.file.filename,
        originalName: req.file.originalname,
        downloads: 0
    };

    data.materials.push(newMaterial);
    saveData(data);
    res.status(201).json({ success: true, data: { ...newMaterial, _id: newMaterial.id } });
});

app.put('/api/materials/:id', protect, (req, res) => {
    const { title, category } = req.body;
    const data = getData();
    const material = data.materials.find(m => m.id === req.params.id);

    if (!material) {
        return res.status(404).json({ success: false, message: 'Material not found' });
    }

    if (title) material.title = title;
    if (category) material.category = category;

    saveData(data);
    res.json({ success: true, data: { ...material, _id: material.id } });
});

app.delete('/api/materials/:id', protect, (req, res) => {
    const data = getData();
    const index = data.materials.findIndex(m => m.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Material not found' });
    }
    const material = data.materials[index];
    const filePath = path.join(uploadsDir, material.filePath);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
    data.materials.splice(index, 1);
    saveData(data);
    res.json({ success: true, message: 'Material deleted' });
});

// ==================== CONTACT ROUTES ====================
app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const data = getData();
    const newContact = {
        id: Date.now().toString(),
        name, email,
        subject: subject || 'No Subject',
        message,
        isRead: false,
        createdAt: new Date().toISOString()
    };

    data.contacts.push(newContact);
    saveData(data);
    res.status(201).json({ success: true, message: 'Message sent successfully!' });
});

app.get('/api/contact', protect, (req, res) => {
    const data = getData();
    res.json({
        success: true,
        count: data.contacts.length,
        data: data.contacts.map(c => ({ ...c, _id: c.id })).reverse()
    });
});

app.put('/api/contact/:id/read', protect, (req, res) => {
    const data = getData();
    const contact = data.contacts.find(c => c.id === req.params.id);
    if (!contact) {
        return res.status(404).json({ success: false, message: 'Message not found' });
    }
    contact.isRead = true;
    saveData(data);
    res.json({ success: true, data: { ...contact, _id: contact.id } });
});

app.delete('/api/contact/:id', protect, (req, res) => {
    const data = getData();
    const index = data.contacts.findIndex(c => c.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Message not found' });
    }
    data.contacts.splice(index, 1);
    saveData(data);
    res.json({ success: true, message: 'Message deleted' });
});

// ==================== CONTENT ROUTES ====================
app.get('/api/content', async (req, res) => {
    try {
        const data = await getData();
        res.json({ success: true, data: data.siteContent || {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching content' });
    }
});

app.put('/api/content', protect, async (req, res) => {
    try {
        const data = getData();
        data.siteContent = { ...data.siteContent, ...req.body };
        saveData(data);
        res.json({ success: true, data: data.siteContent });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating content' });
    }
});

// ==================== PROFILE ROUTES ====================
app.get('/api/profile', (req, res) => {
    const data = getData();
    // Return default if not exists (migration compatibility)
    const profile = data.profile || {
        name: 'Madhankumar C',
        title: 'Assistant Professor',
        department: 'Dept of Computer Science',
        about: 'Welcome to my e-content portal.',
        email: 'admin@university.edu'
    };
    res.json({ success: true, data: profile });
});

app.put('/api/profile', protect, (req, res) => {
    const data = getData();
    data.profile = { ...data.profile, ...req.body };
    saveData(data);
    res.json({ success: true, data: data.profile, message: 'Profile updated successfully' });
});

// ==================== STATS ROUTES ====================
app.get('/api/stats', protect, (req, res) => {
    const data = getData();
    const totalViews = data.videos.reduce((sum, v) => sum + (v.views || 0), 0);
    const totalDownloads = data.materials.reduce((sum, m) => sum + (m.downloads || 0), 0);
    const unreadMessages = data.contacts.filter(c => !c.isRead).length;

    res.json({
        success: true,
        data: {
            counts: {
                videos: data.videos.length,
                materials: data.materials.length,
                messages: data.contacts.length,
                unreadMessages
            },
            totals: { views: totalViews, downloads: totalDownloads }
        }
    });
});

app.get('/api/stats/public', (req, res) => {
    const data = getData();
    const totalViews = data.videos.reduce((sum, v) => sum + (v.views || 0), 0);
    const totalDownloads = data.materials.reduce((sum, m) => sum + (m.downloads || 0), 0);

    res.json({
        success: true,
        data: {
            videos: data.videos.length,
            materials: data.materials.length,
            views: totalViews,
            downloads: totalDownloads
        }
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running (JSON file mode)', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
    res.json({ message: 'Faculty E-Content API', version: '1.0.0', mode: 'JSON File Storage' });
});

// Start server
app.listen(PORT, () => {
    console.log('');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║  🎓 Faculty E-Content Backend Server                       ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log(`║  🚀 Server running on http://localhost:${PORT}               ║`);
    console.log('║  📁 Mode: JSON File Storage (No MongoDB required)          ║');
    console.log('║                                                            ║');
    console.log('║  📧 Admin Email: admin@university.edu                      ║');
    console.log('║  🔑 Admin Password: admin123                               ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');
});

export default app;
