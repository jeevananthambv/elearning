// Firebase API - Using Firestore for data persistence
import { db, auth, storage } from './firebase';
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    increment,
    setDoc
} from 'firebase/firestore';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';

// Token management (for backwards compatibility with existing code)
export const getToken = () => localStorage.getItem('adminToken');
export const setToken = (token) => localStorage.setItem('adminToken', token);
export const removeToken = () => localStorage.removeItem('adminToken');

// Image Upload Helper - Upload images to Firebase Storage
export const uploadImage = async (file, folder = 'images') => {
    try {
        const fileName = `${Date.now()}-${file.name}`;
        const storageRef = ref(storage, `${folder}/${fileName}`);
        const uploadResult = await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(uploadResult.ref);
        return {
            success: true,
            url: downloadUrl,
            storagePath: uploadResult.ref.fullPath
        };
    } catch (error) {
        console.error('Error uploading image:', error);
        return { success: false, message: error.message };
    }
};

// Image Delete Helper - Delete image from Firebase Storage
export const deleteImage = async (storagePath) => {
    try {
        if (!storagePath) return { success: true };
        const storageRef = ref(storage, storagePath);
        await deleteObject(storageRef);
        return { success: true };
    } catch (error) {
        console.warn('Could not delete image:', error);
        return { success: false, message: error.message };
    }
};

// Auth API - Using Firebase Authentication
export const authAPI = {
    login: async (email, password) => {
        try {
            // Try to sign in first
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();
            setToken(token);
            return {
                success: true,
                data: {
                    token,
                    user: {
                        id: userCredential.user.uid,
                        name: userCredential.user.displayName || 'Admin',
                        email: userCredential.user.email
                    }
                }
            };
        } catch (error) {
            console.error('Login error:', error.code, error.message);

            // If user doesn't exist and using default admin credentials, auto-create
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
                // Check if using default admin credentials
                if (email === 'admin@university.edu' && password === 'admin123') {
                    try {
                        // Create the admin user
                        const newUser = await createUserWithEmailAndPassword(auth, email, password);
                        const token = await newUser.user.getIdToken();
                        setToken(token);
                        return {
                            success: true,
                            data: {
                                token,
                                user: {
                                    id: newUser.user.uid,
                                    name: 'Admin',
                                    email: newUser.user.email
                                }
                            }
                        };
                    } catch (createError) {
                        console.error('Create user error:', createError.code, createError.message);
                        // Check if email/password auth is enabled
                        if (createError.code === 'auth/operation-not-allowed') {
                            return {
                                success: false,
                                message: 'Email/Password login is not enabled. Please enable it in Firebase Console → Authentication → Sign-in method.'
                            };
                        }
                        return { success: false, message: 'Failed to setup admin account: ' + createError.message };
                    }
                }
            }

            // Provide user-friendly error messages
            let message = 'Invalid email or password';
            switch (error.code) {
                case 'auth/operation-not-allowed':
                    message = 'Email/Password login is not enabled. Please enable it in Firebase Console.';
                    break;
                case 'auth/too-many-requests':
                    message = 'Too many failed attempts. Please try again later.';
                    break;
                case 'auth/network-request-failed':
                    message = 'Network error. Please check your connection.';
                    break;
                case 'auth/invalid-email':
                    message = 'Invalid email address format.';
                    break;
                case 'auth/user-disabled':
                    message = 'This account has been disabled.';
                    break;
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    message = 'Invalid email or password.';
                    break;
                default:
                    message = error.message || 'Login failed. Please try again.';
            }
            return { success: false, message };
        }
    },

    register: async (email, password, name) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return {
                success: true,
                data: {
                    user: {
                        id: userCredential.user.uid,
                        name: name,
                        email: userCredential.user.email
                    }
                }
            };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    verify: async () => {
        return new Promise((resolve) => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    resolve({ success: true, data: { user } });
                } else {
                    resolve({ success: false, message: 'Not authenticated' });
                }
            });
        });
    },

    logout: async () => {
        await signOut(auth);
        removeToken();
    }
};

// Videos API - Using Firestore
export const videosAPI = {
    getAll: async (subject = null) => {
        try {
            const videosRef = collection(db, 'videos');
            let q = videosRef;

            if (subject && subject !== 'All') {
                q = query(videosRef, where('subject', '==', subject));
            }

            const snapshot = await getDocs(q);
            const videos = snapshot.docs.map(doc => ({
                _id: doc.id,
                id: doc.id,
                ...doc.data()
            }));

            return { success: true, count: videos.length, data: videos };
        } catch (error) {
            console.error('Error fetching videos:', error);
            return { success: false, message: error.message, data: [] };
        }
    },

    getOne: async (id) => {
        try {
            const docRef = doc(db, 'videos', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // Increment view count
                await updateDoc(docRef, {
                    views: increment(1)
                });

                return {
                    success: true,
                    data: { _id: docSnap.id, id: docSnap.id, ...docSnap.data() }
                };
            }
            return { success: false, message: 'Video not found' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    create: async (videoData) => {
        try {
            const docRef = await addDoc(collection(db, 'videos'), {
                ...videoData,
                views: 0,
                createdAt: new Date().toISOString()
            });
            return {
                success: true,
                data: { _id: docRef.id, id: docRef.id, ...videoData }
            };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    update: async (id, videoData) => {
        try {
            const docRef = doc(db, 'videos', id);
            await updateDoc(docRef, videoData);
            return {
                success: true,
                data: { _id: id, id, ...videoData }
            };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    delete: async (id) => {
        try {
            await deleteDoc(doc(db, 'videos', id));
            return { success: true, message: 'Video deleted' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
};

// Materials API - Using Firestore + Firebase Storage
export const materialsAPI = {
    getAll: async (category = null, type = null) => {
        try {
            const materialsRef = collection(db, 'materials');
            let q = materialsRef;

            // Note: Firestore requires composite indexes for multiple where clauses
            if (category && category !== 'All') {
                q = query(materialsRef, where('category', '==', category));
            }

            const snapshot = await getDocs(q);
            let materials = snapshot.docs.map(doc => ({
                _id: doc.id,
                id: doc.id,
                ...doc.data()
            }));

            // Client-side filtering for type (to avoid composite index requirement)
            if (type && type !== 'All') {
                materials = materials.filter(m => m.type === type);
            }

            return { success: true, count: materials.length, data: materials };
        } catch (error) {
            console.error('Error fetching materials:', error);
            return { success: false, message: error.message, data: [] };
        }
    },

    getOne: async (id) => {
        try {
            const docRef = doc(db, 'materials', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return {
                    success: true,
                    data: { _id: docSnap.id, id: docSnap.id, ...docSnap.data() }
                };
            }
            return { success: false, message: 'Material not found' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    create: async (formData) => {
        try {
            const title = formData.get('title');
            const category = formData.get('category');
            const file = formData.get('file');

            // Upload file to Firebase Storage
            const storageRef = ref(storage, `materials/${Date.now()}-${file.name}`);
            const uploadResult = await uploadBytes(storageRef, file);
            const fileUrl = await getDownloadURL(uploadResult.ref);

            // Get file type
            const ext = file.name.split('.').pop().toLowerCase();
            let type = 'Other';
            if (ext === 'pdf') type = 'PDF';
            else if (['ppt', 'pptx'].includes(ext)) type = 'PPT';
            else if (['doc', 'docx'].includes(ext)) type = 'DOC';

            // Format file size
            const size = file.size < 1024 * 1024
                ? (file.size / 1024).toFixed(1) + ' KB'
                : (file.size / (1024 * 1024)).toFixed(1) + ' MB';

            const materialData = {
                title,
                category,
                type,
                size,
                fileUrl,
                storagePath: uploadResult.ref.fullPath,
                originalName: file.name,
                downloads: 0,
                createdAt: new Date().toISOString()
            };

            const docRef = await addDoc(collection(db, 'materials'), materialData);

            return {
                success: true,
                data: { _id: docRef.id, id: docRef.id, ...materialData }
            };
        } catch (error) {
            console.error('Error creating material:', error);
            return { success: false, message: error.message };
        }
    },

    update: async (id, formData) => {
        try {
            const title = formData.get ? formData.get('title') : formData.title;
            const category = formData.get ? formData.get('category') : formData.category;

            const updateData = {};
            if (title) updateData.title = title;
            if (category) updateData.category = category;

            const docRef = doc(db, 'materials', id);
            await updateDoc(docRef, updateData);

            return {
                success: true,
                data: { _id: id, id, ...updateData }
            };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    delete: async (id) => {
        try {
            // Get material data to find storage path
            const docRef = doc(db, 'materials', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                // Delete file from storage if exists
                if (data.storagePath) {
                    try {
                        const storageRef = ref(storage, data.storagePath);
                        await deleteObject(storageRef);
                    } catch (storageError) {
                        console.warn('Could not delete file from storage:', storageError);
                    }
                }
            }

            await deleteDoc(docRef);
            return { success: true, message: 'Material deleted' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    getDownloadUrl: async (id) => {
        try {
            const docRef = doc(db, 'materials', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // Increment download count
                await updateDoc(docRef, {
                    downloads: increment(1)
                });
                return docSnap.data().fileUrl;
            }
            return null;
        } catch (error) {
            console.error('Error getting download URL:', error);
            return null;
        }
    }
};

// Contact API - Using Firestore
export const contactAPI = {
    submit: async (formData) => {
        try {
            const docRef = await addDoc(collection(db, 'contacts'), {
                ...formData,
                isRead: false,
                createdAt: new Date().toISOString()
            });
            return { success: true, message: 'Message sent successfully!', data: { _id: docRef.id } };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    getAll: async () => {
        try {
            const contactsRef = collection(db, 'contacts');
            const q = query(contactsRef, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);

            const contacts = snapshot.docs.map(doc => ({
                _id: doc.id,
                id: doc.id,
                ...doc.data()
            }));

            return { success: true, count: contacts.length, data: contacts };
        } catch (error) {
            return { success: false, message: error.message, data: [] };
        }
    },

    markAsRead: async (id) => {
        try {
            const docRef = doc(db, 'contacts', id);
            await updateDoc(docRef, { isRead: true });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    delete: async (id) => {
        try {
            await deleteDoc(doc(db, 'contacts', id));
            return { success: true, message: 'Message deleted' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
};

// Stats API - Computed from Firestore data
export const statsAPI = {
    getAdmin: async () => {
        try {
            const [videosSnap, materialsSnap, contactsSnap] = await Promise.all([
                getDocs(collection(db, 'videos')),
                getDocs(collection(db, 'materials')),
                getDocs(collection(db, 'contacts'))
            ]);

            const videos = videosSnap.docs.map(d => d.data());
            const materials = materialsSnap.docs.map(d => d.data());
            const contacts = contactsSnap.docs.map(d => d.data());

            const totalViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);
            const totalDownloads = materials.reduce((sum, m) => sum + (m.downloads || 0), 0);
            const unreadMessages = contacts.filter(c => !c.isRead).length;

            return {
                success: true,
                data: {
                    counts: {
                        videos: videos.length,
                        materials: materials.length,
                        messages: contacts.length,
                        unreadMessages
                    },
                    totals: { views: totalViews, downloads: totalDownloads }
                }
            };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    getPublic: async () => {
        try {
            const [videosSnap, materialsSnap] = await Promise.all([
                getDocs(collection(db, 'videos')),
                getDocs(collection(db, 'materials'))
            ]);

            const videos = videosSnap.docs.map(d => d.data());
            const materials = materialsSnap.docs.map(d => d.data());

            const totalViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);
            const totalDownloads = materials.reduce((sum, m) => sum + (m.downloads || 0), 0);

            return {
                success: true,
                data: {
                    videos: videos.length,
                    materials: materials.length,
                    views: totalViews,
                    downloads: totalDownloads
                }
            };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
};

// Profile API - Using Firestore (single document)
export const profileAPI = {
    get: async () => {
        try {
            const docRef = doc(db, 'settings', 'profile');
            const docSnap = await getDoc(docRef);

            const defaultProfile = {
                name: 'Madhankumar C',
                title: 'Assistant Professor',
                department: 'Computer Science & Engineering',
                email: 'madhankumar@university.edu',
                phone: '+91 7904863245',
                about: 'I am a passionate educator with over 10 years of experience in teaching Computer Science. My focus is on making complex concepts accessible to every student through innovative e-learning methods.',
                image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop',
                academicBackground: [
                    { year: '2023', role: 'Ph.D. in Computer Science', institution: 'Anna University, Chennai' },
                    { year: '2015', role: 'M.E. Computer Science', institution: 'Anna University, Chennai' },
                    { year: '2013', role: 'B.E. Computer Science', institution: 'Anna University, Chennai' }
                ],
                teachingInterests: [
                    { title: 'Data Structures', description: 'Exploring efficient ways to store and organize data.', icon: 'mh' },
                    { title: 'Web Development', description: 'Building modern, responsive, and dynamic applications.', icon: '💻' },
                    { title: 'Database Management', description: 'Designing robust and scalable database systems.', icon: '🗄️' },
                    { title: 'Artificial Intelligence', description: 'Understanding the fundamentals of AI and Machine Learning.', icon: '🤖' }
                ],
                contributionTitle: 'Contributions to E-Content Development',
                contributionText: 'As an advocate for digital education, I have been actively involved in developing e-learning resources that cater to diverse learning styles. My contributions include comprehensive video lectures, detailed study materials, and practical lab manuals.',
                contributionStats: {
                    lectures: '50+',
                    materials: '100+',
                    students: '1000+',
                    subjects: '5+'
                },
                identifiers: {
                    orcid: '0009-0005-1880-903X',
                    researcherId: 'MGA-7650-2025',
                    scopus: '7271159',
                    elsevier: '7271159',
                    googleScholar: 'https://scholar.google.com/citations?hl=en&user=VLy1Y18AAAAJ',
                    ieee: '101053152',
                    acm: '9279391',
                    patent: '7904863245',
                    employee: 'RTC05474',
                    vidwan: '606753',
                    researchGate: 'https://www.researchgate.net/profile/Mathan-Kumar-C?ev=prf_overview',
                    semanticScholar: 'https://www.semanticscholar.org/me/recommendations?folderIds=12537472',
                    academia: 'https://independent.academia.edu/MathankumarC2',
                    github: 'https://github.com/Mathan-2003',
                    linkedin: 'https://www.linkedin.com/in/madhan-kumar-637231248/'
                },
                social: {
                    linkedin: 'https://www.linkedin.com/in/madhan-kumar-637231248/',
                    scholar: 'https://scholar.google.com/citations?hl=en&user=VLy1Y18AAAAJ',
                    researchgate: 'https://www.researchgate.net/profile/Mathan-Kumar-C?ev=prf_overview'
                }
            };

            if (docSnap.exists()) {
                const fetchedData = docSnap.data();
                return {
                    success: true,
                    data: {
                        ...defaultProfile,
                        ...fetchedData,
                        identifiers: { ...defaultProfile.identifiers, ...(fetchedData.identifiers || {}) },
                        social: { ...defaultProfile.social, ...(fetchedData.social || {}) },
                        contributionStats: { ...defaultProfile.contributionStats, ...(fetchedData.contributionStats || {}) }
                    }
                };
            }

            return {
                success: true,
                data: defaultProfile
            };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    update: async (profileData) => {
        try {
            const docRef = doc(db, 'settings', 'profile');
            await setDoc(docRef, profileData, { merge: true });
            return { success: true, data: profileData, message: 'Profile updated successfully' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
};

// Content API - Using Firestore (single document)
export const contentAPI = {
    get: async () => {
        try {
            const docRef = doc(db, 'settings', 'siteContent');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { success: true, data: docSnap.data() };
            }

            return { success: true, data: {} };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    update: async (contentData) => {
        try {
            const docRef = doc(db, 'settings', 'siteContent');
            await setDoc(docRef, contentData, { merge: true });
            return { success: true, data: contentData };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
};

// Health check - Always returns true for Firebase
export const checkHealth = async () => {
    return true;
};

export default {
    auth: authAPI,
    videos: videosAPI,
    materials: materialsAPI,
    contact: contactAPI,
    stats: statsAPI,
    profile: profileAPI,
    content: contentAPI,
    checkHealth
};
